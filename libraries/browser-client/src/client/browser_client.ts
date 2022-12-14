import { DecoderState, EventCallbacks, DecoderOptions, ContextOptions, VadDefaultOptions, AudioProcessorParameters, StreamOptions, StreamDefaultOptions, DecoderDefaultOptions, ResolvedDecoderOptions, VadOptions, ErrAlreadyStarted, ErrAlreadyStopped } from './types'
import { CloudDecoder } from './decoder'
import { ErrDeviceNotSupported, DefaultSampleRate, Segment, Word, Entity, Intent, WebsocketError } from '../speechly'

import audioworklet from '../microphone/audioworklet'

/**
 * Speechly BrowserClient streams audio containing speech for cloud processing and
 * provides the results of automatic speech recogition (ASR) and natural langugage understanding (NLU) via callbacks.
 *
 * Usage:
 *
 * - Create a BrowserClient instance with {@link DecoderOptions} containing a valid appId from https://api.speechly.com/dashboard.
 * - Create and initialize a {@link BrowserMicrophone} instance and {@link attach} its mediaStream to the BrowserClient instance.
 * - Control processing manually with {@link start} and {@link stop}. Alternatively, you can enable automatic control by initializing BrowserClient with {@link VadOptions} defined in the {@link DecoderOptions}.
 * - Read the ASR/NLU result {@link Segment} by providing a custom handler for the {@link onSegmentChange} callback.
 *
 * Alternatively, you can create the BrowserClient instance and process audio files (binary data) using {@link uploadAudioData}.
 * @public
 */
export class BrowserClient {
  private readonly contextStopDelay = 250
  private readonly nativeResamplingSupported: boolean
  private readonly debug: boolean = false
  private readonly useSAB: boolean
  private readonly isSafari: boolean
  private readonly isMobileSafari: boolean
  private readonly decoder: CloudDecoder
  private readonly callbacks: EventCallbacks

  private audioContext?: AudioContext
  private initialized: boolean = false
  private audioProcessorInitialized: boolean = false
  private isStreaming: boolean = false
  private active: boolean = false
  private speechlyNode?: AudioWorkletNode
  private audioProcessor?: ScriptProcessorNode
  private stream?: MediaStreamAudioSourceNode
  private listeningPromise: Promise<any> | null = null
  private readonly decoderOptions: ResolvedDecoderOptions & { vad?: VadOptions }
  private streamOptions: StreamOptions = { ...StreamDefaultOptions }

  private stats = {
    maxSignalEnergy: 0.0,
    sentSamples: 0,
  }

  /**
   * Create a new BrowserClient instance.
   *
   * @param customOptions - any custom options for BrowserClient and the enclosed CloudDecoder.
   */
  constructor(customOptions: DecoderOptions) {
    this.decoderOptions = {
      ...DecoderDefaultOptions,
      ...customOptions,
      vad: customOptions.vad ? { ...VadDefaultOptions, ...customOptions.vad } : undefined,
    }

    const constraints = window.navigator.mediaDevices.getSupportedConstraints()
    this.nativeResamplingSupported = constraints.sampleRate === true

    this.isMobileSafari = iOS()
    // @ts-ignore
    this.isSafari = this.isMobileSafari || window.safari !== undefined
    this.useSAB = !this.isSafari

    this.debug = this.decoderOptions.debug ?? true
    this.callbacks = new EventCallbacks()
    this.callbacks.stateChangeCbs.addEventListener(this.handleStateChange.bind(this))
    this.callbacks.onVadStateChange.addEventListener(this.autoControlListening.bind(this))
    this.decoder = this.decoderOptions.decoder ?? new CloudDecoder(this.decoderOptions)
    this.decoder.registerListener(this.callbacks)
  }

  /**
   * Connect to cloud, create an AudioContext for receiving audio samples from a MediaStream
   * and initialize a worker for audio processing and bi-directional streaming to the cloud.
   */
  async initialize(options?: { mediaStream?: MediaStream }): Promise<void> {
    if (this.initialized) {
      return
    }
    if (this.debug) {
      console.log('[BrowserClient]', 'initializing')
    }

    this.initialized = true

    try {
      await this.decoder.connect()
    } catch (err) {
      this.initialized = false
      if (err instanceof WebsocketError) {
        if (err.code === 1000) {
          if (this.debug) {
            console.log('[BrowserClient]', 'Early close of websocket.')
          }
          return
        }
        throw Error(`Unable to connect. Most likely there is no connection to network. Websocket error code: ${err.code}`)
      } else {
        throw err
      }
    }

    try {
      const opts: AudioContextOptions = {}
      if (this.nativeResamplingSupported) {
        opts.sampleRate = DefaultSampleRate
      }
      if (window.webkitAudioContext !== undefined) {
        // create webkit flavor of audiocontext
        try {
          // eslint-disable-next-line new-cap
          this.audioContext = new window.webkitAudioContext(opts)
        } catch (err) {
          if (this.debug) {
            console.log('[BrowserClient]', 'creating audioContext without samplerate conversion', err)
          }
          // older webkit without constructor options
          // eslint-disable-next-line new-cap
          this.audioContext = new window.webkitAudioContext()
        }
      } else {
        this.audioContext = new window.AudioContext(opts)
        // Start audio context if we are dealing with a WebKit browser.
        //
        // WebKit browsers (e.g. Safari) require to resume the context first,
        // before obtaining user media by calling `mediaDevices.getUserMedia`.
        //
        // If done in a different order, the audio context will resume successfully,
        // but will emit empty audio buffers.
        if (window.webkitAudioContext !== undefined) {
          await this.audioContext.resume()
        }
      }
    } catch {
      this.initialized = false
      throw ErrDeviceNotSupported
    }

    if (!this.isSafari && window.AudioWorkletNode !== undefined) {
      if (this.debug) {
        console.log('[BrowserClient]', 'using AudioWorkletNode')
      }
      const blob = new Blob([audioworklet], { type: 'text/javascript' })
      const blobURL = window.URL.createObjectURL(blob)
      await this.audioContext.audioWorklet.addModule(blobURL)
      this.speechlyNode = new AudioWorkletNode(this.audioContext, 'speechly-worklet')
      this.speechlyNode.connect(this.audioContext.destination)
      // @ts-ignore
      if (this.useSAB && window.SharedArrayBuffer !== undefined) {
        // Chrome, Edge, Firefox, Firefox Android
        if (this.debug) {
          console.log('[BrowserClient]', 'using SharedArrayBuffer')
        }
        // @ts-ignore
        const controlSAB = new window.SharedArrayBuffer(4 * Int32Array.BYTES_PER_ELEMENT)
        // @ts-ignore
        const dataSAB = new window.SharedArrayBuffer(1024 * Float32Array.BYTES_PER_ELEMENT)
        this.decoder.useSharedArrayBuffers(controlSAB, dataSAB)
        this.speechlyNode.port.postMessage({
          type: 'SET_SHARED_ARRAY_BUFFERS',
          controlSAB,
          dataSAB,
          debug: this.debug,
        })
      } else {
        // Safari, Opera, Chrome Android, Webview Android
        // or if site CORS headers do not allow SharedArrayBuffer
        if (this.debug) {
          console.log('[BrowserClient]', 'can not use SharedArrayBuffer')
        }
      }

      this.speechlyNode.port.onmessage = (event: MessageEvent) => {
        switch (event.data.type) {
          case 'STATS':
            if (event.data.signalEnergy > this.stats.maxSignalEnergy) {
              this.stats.maxSignalEnergy = event.data.signalEnergy
            }
            this.stats.sentSamples += parseInt(event.data.samples)
            break
          case 'DATA':
            // this is not called if SAB is used, the buffers are sent immediately
            this.handleAudio(event.data.frames)
            break
          default:
        }
      }
    } else {
      if (this.debug) {
        console.log('[BrowserClient]', 'using ScriptProcessorNode')
      }
      if (window.webkitAudioContext !== undefined) {
        // Multiply base buffer size of 4 kB by the resample ratio rounded up to the next power of 2.
        // i.e. for 48 kHz to 16 kHz downsampling, this will be 4096 (base) * 4 = 16384.
        const resampleRatio = this.audioContext.sampleRate / DefaultSampleRate
        const bufSize = 4096 * Math.pow(2, Math.ceil(Math.log(resampleRatio) / Math.log(2)))
        this.audioProcessor = this.audioContext.createScriptProcessor(bufSize, 1, 1)
      } else {
        this.audioProcessor = this.audioContext.createScriptProcessor(undefined, 1, 1)
      }
      this.audioProcessor.connect(this.audioContext.destination)
      this.audioProcessor.addEventListener('audioprocess', (event: AudioProcessingEvent) => {
        this.handleAudio(event.inputBuffer.getChannelData(0))
      })
    }
    if (this.debug) {
      console.log('[BrowserClient]', 'audioContext sampleRate is', this.audioContext?.sampleRate)
    }
    this.streamOptions.sampleRate = this.audioContext?.sampleRate
    await this.decoder.initAudioProcessor(this.streamOptions.sampleRate, this.decoderOptions.frameMillis, this.decoderOptions.historyFrames, this.decoderOptions.vad)
    this.audioProcessorInitialized = true

    if (options?.mediaStream) {
      await this.attach(options?.mediaStream)
    }
  }

  /**
   * Attach a MediaStream to the client, enabling the client to send the audio to the
   * Speechly API for processing. The processing is activated by calling
   * {@link BrowserClient.start} and deactivated by calling {@link BrowserClient.stop}.
   */
  async attach(mediaStream: MediaStream): Promise<void> {
    await this.initialize()
    await this.detach()
    this.stream = this.audioContext?.createMediaStreamSource(mediaStream)
    // ensure audioContext is active
    if (this.audioContext?.state !== 'running') {
      if (this.debug) {
        console.log('[BrowserClient]', 'audioContext resume required, state is', this.audioContext?.state)
      }
      await this.audioContext?.resume()
    }
    if (this.speechlyNode) {
      this.stream?.connect(this.speechlyNode)
    } else if (this.audioProcessor) {
      this.stream?.connect(this.audioProcessor)
    } else {
      throw Error('[BrowserClient] cannot attach to mediaStream, not initialized')
    }
    await this.autoControlStream()
  }

  /**
   * @returns Whether the client is processing audio at the moment.
   */
  isActive(): boolean {
    return this.active
  }

  /**
   * Starts a new audio context, returning it's id to use for matching received responses.
   * If an active context already exists, an error is thrown.
   *
   * @param options - any custom options for the audio processing.
   * @returns The contextId of the active audio context
   */
  async start(options?: ContextOptions): Promise<string> {
    if (this.active) {
      throw ErrAlreadyStarted
    }

    this.active = true

    const contextId = await this.queueTask(async () => {
      await this.initialize()
      if (!this.isStreaming) {
        // Automatically control streaming for backwards compability
        await this.startStream({ autoStarted: true })
      }
      const contextId = await this.decoder.startContext(options)
      return contextId
    })
    return contextId
  }

  /**
   * Stops the current audio context and deactivates the audio processing pipeline.
   * If there is no active audio context, a warning is logged to console.
   */
  async stop(stopDelayMs = this.contextStopDelay): Promise<string> {
    if (!this.active) {
      throw ErrAlreadyStopped
    }

    this.active = false

    const contextId = await this.queueTask(async () => {
      try {
        const contextId = await this.decoder.stopContext(stopDelayMs)
        // Automatically control streaming for backwards compability
        if (!this.decoderOptions.vad?.enabled && this.isStreaming && this.streamOptions.autoStarted) {
          await this.stopStream()
        }

        if (this.stats.sentSamples === 0) {
          console.warn('[BrowserClient]', 'audioContext contained no audio data')
        }
        return contextId
      } catch (err) {
        console.warn('[BrowserClient]', 'stop() failed', err)
      } finally {
        this.stats.sentSamples = 0
      }
    })

    return contextId
  }

  /**
   * Sets the default context options (appId, inference parameters, timezone). New audio contexts
   * use these options until new options are provided. Decoder's functions startContext() can
   * also override the options per function call.
   */
  async setContextOptions(options: ContextOptions): Promise<void> {
    await this.decoder.setContextOptions(options)
  }

  /**
   * Control audio processor parameters like VAD
   * @param ap - Audio processor parameters to adjust
   */
  adjustAudioProcessor(ap: AudioProcessorParameters): void {
    if (ap.vad) {
      if (this.decoderOptions.vad) {
        this.decoderOptions.vad = { ...this.decoderOptions.vad, ...ap.vad }
      } else {
        throw Error('Unable to adjust VAD - it was not defined in the constructor')
      }
    }
    this.decoder.adjustAudioProcessor(ap)

    if (this.decoderOptions.vad?.enabled) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      this.autoControlStream()
    } else {
      if (this.active) {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        this.stop()
      }
    }
  }

  /**
   * Upload an audio binary (like .wav) to the cloud for automatic speech recogition (ASR) and natural langugage understanding (NLU).
   * Callbacks are fired as the processing advances.
   *
   * @param audioData - audio data in a binary format. Will be decoded.
   * @param options - any custom options for the audio processing.
   * @returns array of segments containing the final results of speech recognition (ASR and NLU).
   */
  async uploadAudioData(audioData: ArrayBuffer, options?: ContextOptions): Promise<Segment[]> {
    await this.initialize()
    const audioBuffer = await this.audioContext?.decodeAudioData(audioData)
    if (audioBuffer === undefined) {
      throw Error('Could not decode audioData')
    }
    const samples = audioBuffer.getChannelData(0)

    // convert 2-channel audio to 1-channel if need be
    if (audioBuffer.numberOfChannels > 1) {
      const chan1samples = audioBuffer.getChannelData(1)
      for (let i = 0; i < samples.length; i++) {
        samples[i] = (samples[i] + chan1samples[i]) / 2.0
      }
    }

    if (this.active) await this.stop(0)
    if (this.isStreaming) await this.stopStream()

    await this.startStream({
      sampleRate: audioBuffer.sampleRate,
      preserveSegments: true,
      immediate: true,
    })

    const vadActive = this.decoderOptions.vad?.enabled && this.decoderOptions.vad?.controlListening
    const chunkMillis = 1000
    let throttlingWaitMillis = 0

    if (!vadActive) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      await this.start(options)
    } else {
      if (options) await this.setContextOptions(options)
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      if (this.decoderOptions.vad!.signalSustainMillis >= chunkMillis) {
        const allowedContexts = 10
        const lookbackWindowMillis = 10000
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const worstCaseContextsInLookback = lookbackWindowMillis / this.decoderOptions.vad!.signalSustainMillis
        const maxSpeedUp = allowedContexts / worstCaseContextsInLookback
        throttlingWaitMillis = chunkMillis / maxSpeedUp
      } else {
        console.warn(`Throttling disabled due to low (<= ${chunkMillis}) VAD sustain value. Server may disconnect while processing if contexts are created at high rate.`)
      }
      throttlingWaitMillis = 0 // @DEBUG
    }

    let sendBuffer: Float32Array
    const chunkSamples = Math.round(audioBuffer.sampleRate * chunkMillis / 1000)

    for (let b = 0; b < samples.length; b += chunkSamples) {
      const e = b + chunkSamples
      if (e > samples.length) {
        sendBuffer = samples.slice(b)
      } else {
        sendBuffer = samples.slice(b, e)
      }
      this.handleAudio(sendBuffer)
      await this.sleep(throttlingWaitMillis)
    }

    if (!vadActive) {
      await this.stop(0)
    }

    await this.stopStream()

    // Store result before startStream as it'll clear the results
    const result = this.decoder.getSegments()

    return result
  }

  /**
   * `startStream` is used to indicate start of continuous audio stream.
   * It resets the stream sample counters and history.
   * BrowserClient internally calls `startStream` upon `initialize` and `start` so it's not needed unless you've manually called `stopStream` and want to resume audio processing afterwards.
   * @param streamOptionOverrides - options for stream processing
   */
  async startStream(streamOptionOverrides?: Partial<StreamOptions>): Promise<void> {
    this.streamOptions = { ...this.streamOptions, autoStarted: false, ...streamOptionOverrides }
    await this.decoder.startStream(this.streamOptions)
    this.isStreaming = true
  }

  /**
   * `stopStream` is used to indicate end of continuous audio stream.
   * It ensures that all of the internal audio buffers are flushed for processing.
   * BrowserClient internally calls `stopStream` upon `stop` so it's not needed unless then source audio stream is no longer available or you manually want to pause audio processing.
   * Use `startStream` to resume audio processing afterwards.
   */
  async stopStream(): Promise<void> {
    if (this.isStreaming) {
      this.isStreaming = false
      await this.decoder.stopStream()
    }
  }

  private async queueTask(task: () => Promise<any>): Promise<any> {
    const prevTask = this.listeningPromise
    this.listeningPromise = (async () => {
      await prevTask
      return task()
    })()
    return this.listeningPromise
  }

  private autoControlListening(vadActive: boolean): void {
    if (this.debug) {
      console.log('[BrowserClient]', 'autoControlListening', vadActive)
    }
    if (this.decoderOptions.vad?.controlListening) {
      if (vadActive) {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        if (!this.active) this.start()
      } else {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        if (this.active) this.stop(0)
      }
    }
  }

  private async autoControlStream(): Promise<void> {
    if (!this.audioProcessorInitialized) return

    if (!this.stream) return

    // Auto-start stream if VAD is enabled
    if (this.decoderOptions.vad?.enabled && !this.isStreaming) {
      await this.startStream({ autoStarted: true })
      return
    }

    // Auto-stop stream if automatically started
    if (!this.decoderOptions.vad?.enabled && this.isStreaming && this.streamOptions.autoStarted) {
      await this.stopStream()
    }
  }

  private handleStateChange(decoderState: DecoderState): void {
    switch (decoderState) {
      case DecoderState.Disconnected:
      case DecoderState.Failed:
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        this.stopStream()
        this.active = false
        this.listeningPromise = null
        break
    }
  }

  /**
   * Detach or disconnect the client from the audio source.
   */
  async detach(): Promise<void> {
    if (this.active) {
      await this.stop(0)
    }
    if (this.stream) {
      this.stream.disconnect()
      this.stream = undefined
    }
  }

  /**
   * Closes the client, detaching from any audio source and disconnecting any audio
   * processors.
   */
  async close(): Promise<void> {
    if (this.debug) {
      console.log('[BrowserClient]', 'close')
    }
    await this.detach()
    if (this.speechlyNode !== null) {
      this.speechlyNode?.port.close()
      this.speechlyNode?.disconnect()
    }
    // Disconnect and stop ScriptProcessorNode
    if (this.audioProcessor !== undefined) {
      this.audioProcessor?.disconnect()
    }
    await this.decoder.close()
    this.initialized = false
    this.listeningPromise = null
  }

  private async sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  private handleAudio(array: Float32Array): void {
    if (this.isStreaming) {
      this.stats.sentSamples += array.length
      this.decoder.sendAudio(array)
    }
  }

  /**
   * Adds a listener for start events
   * @param cb - the callback to invoke on context start
   */
  onStart(cb: (contextId: string) => void): void {
    this.callbacks.contextStartedCbs.addEventListener(cb)
  }

  /**
   * Adds a listener for stop events
   * @param cb - the callback to invoke on context stop
   */
  onStop(cb: (contextId: string) => void): void {
    this.callbacks.contextStoppedCbs.addEventListener(cb)
  }

  /**
   * Adds a listener for current segment change events.
   * @param cb - the callback to invoke on segment change events.
   */
  onSegmentChange(cb: (segment: Segment) => void): void {
    this.callbacks.segmentChangeCbs.addEventListener(cb)
  }

  /**
   * Adds a listener for transcript responses from the API.
   * @param cb - the callback to invoke on a transcript response.
   */
  onTranscript(cb: (contextId: string, segmentId: number, word: Word) => void): void {
    this.callbacks.transcriptCbs.addEventListener(cb)
  }

  /**
   * Adds a listener for entity responses from the API.
   * @param cb - the callback to invoke on an entity response.
   */
  onEntity(cb: (contextId: string, segmentId: number, entity: Entity) => void): void {
    this.callbacks.entityCbs.addEventListener(cb)
  }

  /**
   * Adds a listener for intent responses from the API.
   * @param cb - the callback to invoke on an intent response.
   */
  onIntent(cb: (contextId: string, segmentId: number, intent: Intent) => void): void {
    this.callbacks.intentCbs.addEventListener(cb)
  }

  /**
   * Adds a listener for tentative transcript responses from the API.
   * @param cb - the callback to invoke on a tentative transcript response.
   */
  onTentativeTranscript(cb: (contextId: string, segmentId: number, words: Word[], text: string) => void): void {
    this.callbacks.tentativeTranscriptCbs.addEventListener(cb)
  }

  /**
   * Adds a listener for tentative entities responses from the API.
   * @param cb - the callback to invoke on a tentative entities response.
   */
  onTentativeEntities(cb: (contextId: string, segmentId: number, entities: Entity[]) => void): void {
    this.callbacks.tentativeEntityCbs.addEventListener(cb)
  }

  /**
   * Adds a listener for tentative intent responses from the API.
   * @param cb - the callback to invoke on a tentative intent response.
   */
  onTentativeIntent(cb: (contextId: string, segmentId: number, intent: Intent) => void): void {
    this.callbacks.tentativeIntentCbs.addEventListener(cb)
  }

  /**
   * Adds a listener for the state changes of the client.
   * @param cb - the callback to invoke on a client state change.
   */
  onStateChange(cb: (state: DecoderState) => void): void {
    this.callbacks.stateChangeCbs.addEventListener(cb)
  }
}

function iOS(): boolean {
  const iosPlatforms = ['iPad Simulator', 'iPhone Simulator', 'iPod Simulator', 'iPad', 'iPhone', 'iPod']
  return (
    iosPlatforms.indexOf(navigator.platform) >= 0 ||
    // iPad on iOS 13 detection
    (navigator.userAgent.includes('Mac') && 'ontouchend' in document)
  )
}
