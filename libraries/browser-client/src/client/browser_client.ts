import { DecoderState, EventCallbacks, DecoderOptions, ContextOptions, VadOptions, VadDefaultOptions, AudioProcessorParameters } from './types'
import { CloudDecoder } from './decoder'
import { ErrDeviceNotSupported, DefaultSampleRate, Segment, Word, Entity, Intent } from '../speechly'

import audioworklet from '../microphone/audioworklet'

/**
 * BrowserClient connects a browser based mediaStream to the Speechly API, including any
 * needed downsampling.
 * @public
 */
export class BrowserClient {
  private audioContext?: AudioContext
  private readonly nativeResamplingSupported: boolean
  private readonly debug: boolean = false
  private readonly useSAB: boolean
  private readonly isSafari: boolean
  private readonly isMobileSafari: boolean
  private readonly decoder: CloudDecoder
  private readonly callbacks: EventCallbacks

  private readonly vadOptions?: VadOptions
  private initialized: boolean = false
  private isStreaming: boolean = false
  private isStreamAutoStarted: boolean = false
  private active: boolean = false
  private speechlyNode?: AudioWorkletNode
  private audioProcessor?: ScriptProcessorNode
  private stream?: MediaStreamAudioSourceNode
  private listeningPromise: Promise<any> | null = null

  private stats = {
    maxSignalEnergy: 0.0,
    sentSamples: 0,
  }

  /**
   * Create a new BrowserClient instance.
   *
   * @param options - any custom options for the enclosed CloudDecoder.
   */
  constructor(options: DecoderOptions) {
    const constraints = window.navigator.mediaDevices.getSupportedConstraints()
    this.nativeResamplingSupported = constraints.sampleRate === true

    this.isMobileSafari = iOS()
    // @ts-ignore
    this.isSafari = this.isMobileSafari || window.safari !== undefined
    this.useSAB = !this.isSafari
    this.vadOptions = { ...VadDefaultOptions, ...options.vad }

    this.debug = options.debug ?? true
    this.callbacks = new EventCallbacks()
    this.callbacks.onVadStateChange.push(this.onVadStateChange.bind(this))
    this.decoder = options.decoder ?? new CloudDecoder(options)
    this.decoder.registerListener(this.callbacks)
  }

  onVadStateChange(active: boolean): void {
    if (this.debug) {
      console.log('[BrowserClient]', 'onVadStateChange', active)
    }
    if (this.vadOptions?.controlListening) {
      if (active) {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        if (!this.active) this.start()
      } else {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        if (this.active) this.stop()
      }
    }
  }

  /**
   * Create an AudioContext for resampling audio.
   */
  async initialize(options?: { mediaStream?: MediaStream }): Promise<void> {
    if (this.initialized) {
      return
    }
    this.initialized = true

    if (this.debug) {
      console.log('[BrowserClient]', 'initializing')
    }
    await this.decoder.connect()
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
    await this.decoder.initAudioProcessor(this.audioContext?.sampleRate, this.vadOptions)

    // Auto-start stream if VAD is defined
    if (this.vadOptions) {
      await this.startStream()
    }

    if (options?.mediaStream) {
      await this.attach(options?.mediaStream)
    }
  }

  /**
   * Control audio processor parameters
   * @param ap - Audio processor parameters to adjust
   */
  adjustAudioProcessor(ap: AudioProcessorParameters): void {
    this.decoder.adjustAudioProcessor(ap)
  }

  /**
   * Closes the client, detaching from any audio source and disconnecting any audio
   * processors.
   */
  async close(): Promise<void> {
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
  }

  /**
   * Detach or disconnect the client from the audio source.
   */
  async detach(): Promise<void> {
    if (this.active) {
      await this.stop()
    }
    if (this.stream) {
      this.stream.disconnect()
      this.stream = undefined
    }
  }

  /**
   * Upload an existing binary audio data buffer to the API.
   *
   * @param audioData - audio data in a binary format. Will be decoded.
   * @param options - any custom options for the audio processing.
   */
  async uploadAudioData(audioData: ArrayBuffer, options?: ContextOptions): Promise<string> {
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

    await this.startStream({ immediate: true })

    let contextId: string
    const vadActive = this.vadOptions?.enabled && this.vadOptions?.controlListening
    if (!vadActive) {
      contextId = await this.start(options)
    } else {
      contextId = 'multiple context ids'
    }

    let sendBuffer: Float32Array
    for (let b = 0; b < samples.length; b += 16000) {
      const e = b + 16000
      if (e > samples.length) {
        sendBuffer = samples.slice(b)
      } else {
        sendBuffer = samples.slice(b, e)
      }
      this.handleAudio(sendBuffer)
    }

    if (!vadActive) {
      await this.stop()
    }

    await this.stopStream()

    return contextId
  }

  /**
   * If the application starts and resumes the flow of audio, `startStream` should be called at start of a continuous audio stream.
   * If you're using VAD that controls starting and stopping audio contexts automatically, you can pass optional inference time options.
   * It resets the stream sample counters and history.
   */
  async startStream(defaultContextOptions?: ContextOptions): Promise<void> {
    await this.decoder.startStream(defaultContextOptions)
    this.isStreaming = true
  }

  /**
   * If the application starts and resumes the flow of audio, `stopStream` should be called at the end of a continuous audio stream.
   * It ensures that all of the internal audio buffers are flushed for processing.
   */
  async stopStream(): Promise<void> {
    await this.decoder.stopStream()
    this.isStreaming = false
    this.isStreamAutoStarted = false
  }

  private async queueTask(task: () => Promise<any>): Promise<any> {
    const prevTask = this.listeningPromise
    this.listeningPromise = (async () => {
      await prevTask
      return task()
    })()
    return this.listeningPromise
  }

  /**
   * Starts a new audio context, returning it's id to use for matching received responses.
   * If an active context already exists, an error is thrown.
   *
   * @param options - any custom options for the audio processing.
   * @returns The contextId of the active audio context.
   */
  async start(options?: ContextOptions): Promise<string> {
    const promise = await this.queueTask(async () => {
      await this.initialize()
      if (!this.isStreaming) {
        // Automatically control streaming for backwards compability
        await this.startStream()
        this.isStreamAutoStarted = true
      }
      const startPromise = this.decoder.startContext(options)
      this.active = true
      return startPromise
    })
    return promise
  }

  /**
   * Stops the current audio context and deactivates the audio processing pipeline.
   * If there is no active audio context, a warning is logged to console.
   *
   * @returns The contextId of the stopped context, or null if no context is active.
   */
  async stop(): Promise<string | null> {
    const contextId = await this.queueTask(async () => {
      let contextId = null
      try {
        contextId = await this.decoder.stopContext()
        if (this.isStreaming && this.isStreamAutoStarted) {
          // Automatically control streaming for backwards compability
          await this.stopStream()
        }

        if (this.stats.sentSamples === 0) {
          console.warn('[BrowserClient]', 'audioContext contained no audio data')
        }
      } catch (err) {
        console.warn('[BrowserClient]', 'stop() failed', err)
      } finally {
        this.active = false
        this.stats.sentSamples = 0
      }
      return contextId
    })
    return contextId
  }

  private handleAudio(array: Float32Array): void {
    if (this.isStreaming) {
      this.stats.sentSamples += array.length
      this.decoder.sendAudio(array)
    }
  }

  /**
   * @returns Whether the client is processing audio at the moment.
   */
  isActive(): boolean {
    return this.active
  }

  /**
   * Adds a listener for current segment change events.
   * @param cb - the callback to invoke on segment change events.
   */
  onSegmentChange(cb: (segment: Segment) => void): void {
    this.callbacks.segmentChangeCbs.push(cb)
  }

  /**
   * Adds a listener for transcript responses from the API.
   * @param cb - the callback to invoke on a transcript response.
   */
  onTranscript(cb: (contextId: string, segmentId: number, word: Word) => void): void {
    this.callbacks.transcriptCbs.push(cb)
  }

  /**
   * Adds a listener for entity responses from the API.
   * @param cb - the callback to invoke on an entity response.
   */
  onEntity(cb: (contextId: string, segmentId: number, entity: Entity) => void): void {
    this.callbacks.entityCbs.push(cb)
  }

  /**
   * Adds a listener for intent responses from the API.
   * @param cb - the callback to invoke on an intent response.
   */
  onIntent(cb: (contextId: string, segmentId: number, intent: Intent) => void): void {
    this.callbacks.intentCbs.push(cb)
  }

  /**
   * Adds a listener for tentative transcript responses from the API.
   * @param cb - the callback to invoke on a tentative transcript response.
   */
  onTentativeTranscript(cb: (contextId: string, segmentId: number, words: Word[], text: string) => void): void {
    this.callbacks.tentativeTranscriptCbs.push(cb)
  }

  /**
   * Adds a listener for tentative entities responses from the API.
   * @param cb - the callback to invoke on a tentative entities response.
   */
  onTentativeEntities(cb: (contextId: string, segmentId: number, entities: Entity[]) => void): void {
    this.callbacks.tentativeEntityCbs.push(cb)
  }

  /**
   * Adds a listener for tentative intent responses from the API.
   * @param cb - the callback to invoke on a tentative intent response.
   */
  onTentativeIntent(cb: (contextId: string, segmentId: number, intent: Intent) => void): void {
    this.callbacks.tentativeIntentCbs.push(cb)
  }

  /**
   * Adds a listener for the state changes of the client.
   * @param cb - the callback to invoke on a client state change.
   */
  onStateChange(cb: (state: DecoderState) => void): void {
    this.callbacks.stateChangeCbs.push(cb)
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
