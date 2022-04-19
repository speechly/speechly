import { CloudDecoder, DecoderState, EventCallbacks, DecoderOptions } from '../client'
import { ErrDeviceNotSupported, DefaultSampleRate, Segment, Word, Entity, Intent } from '../speechly'

import audioworklet from '../microphone/audioworklet'

export class BrowserClient {
  private audioContext?: AudioContext
  private readonly nativeResamplingSupported: boolean
  private readonly debug: boolean = false
  private readonly isWebkit: boolean
  private readonly decoder: CloudDecoder
  private readonly callbacks: EventCallbacks

  private initialized: boolean = false
  private active: boolean = false
  private speechlyNode?: AudioWorkletNode
  private audioProcessor?: ScriptProcessorNode
  private stream?: MediaStreamAudioSourceNode

  private stats = {
    maxSignalEnergy: 0.0,
  }

  constructor(options: DecoderOptions) {
    const constraints = window.navigator.mediaDevices.getSupportedConstraints()
    this.nativeResamplingSupported = constraints.sampleRate === true

    this.isWebkit = window.webkitAudioContext !== undefined

    this.debug = options.debug ?? true
    this.callbacks = new EventCallbacks()
    this.decoder = options.decoder ?? new CloudDecoder(options)
    this.decoder.registerListener(this.callbacks)
  }

  /**
   * Create an AudioContext for resampling audio. */
  async initialize(): Promise<void> {
    if (this.initialized) {
      return
    }
    if (this.debug) {
      console.log('[BrowserClient]', 'initializing')
    }
    await this.decoder.connect()
    try {
      if (this.isWebkit) {
        // eslint-disable-next-line new-cap
        this.audioContext = new window.webkitAudioContext()
      } else {
        const opts: AudioContextOptions = {}
        if (this.nativeResamplingSupported) {
          opts.sampleRate = DefaultSampleRate
        }
        this.audioContext = new window.AudioContext(opts)
      }
    } catch {
      throw ErrDeviceNotSupported
    }

    if (window.AudioWorkletNode !== undefined) {
      if (this.debug) {
        console.log('[BrowserClient]', 'using AudioWorkletNode')
      }
      const blob = new Blob([audioworklet], { type: 'text/javascript' })
      const blobURL = window.URL.createObjectURL(blob)
      await this.audioContext.audioWorklet.addModule(blobURL)
      this.speechlyNode = new AudioWorkletNode(this.audioContext, 'speechly-worklet')
      this.speechlyNode.connect(this.audioContext.destination)
      // @ts-ignore
      if (window.SharedArrayBuffer !== undefined) {
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
        // Opera, Chrome Android, Webview Android
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
            break
          case 'DATA':
            this.handleAudio(event.data.frames)
            break
          default:
        }
      }
    } else {
      if (this.debug) {
        console.log('[BrowserClient]', 'using ScriptProcessorNode')
      }
      // Safari, iOS Safari and Internet Explorer
      if (this.isWebkit) {
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
    await this.decoder.setSampleRate(this.audioContext?.sampleRate)
    this.initialized = true
  }

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
  }

  async attach(mediaStream: MediaStream): Promise<void> {
    await this.initialize()
    // ensure audioContext is active
    await this.audioContext?.resume()

    this.stream = this.audioContext?.createMediaStreamSource(mediaStream)
    if (this.speechlyNode) {
      this.stream?.connect(this.speechlyNode)
    } else if (this.audioProcessor) {
      this.stream?.connect(this.audioProcessor)
    } else {
      throw Error('[BrowserClient] cannot attach to mediaStream, not initialized')
    }
  }

  async detach(): Promise<void> {
    if (this.active) {
      await this.stop()
    }
    if (this.stream) {
      this.stream.disconnect()
      this.stream = undefined
    }
  }

  async uploadAudioData(audioData: ArrayBuffer): Promise<void> {
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

    await this.start()

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

    await this.stop()
  }

  async start(appId?: string): Promise<string> {
    await this.initialize()
    const contextId = await this.decoder.startContext(appId)
    this.active = true
    return contextId
  }

  async stop(): Promise<string> {
    this.active = false
    return this.decoder.stopContext()
  }

  private handleAudio(array: Float32Array): void {
    if (!this.active) {
      return
    }
    if (array.length > 0) {
      this.decoder.sendAudio(array)
    }
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

  onStateChange(cb: (state: DecoderState) => void): void {
    this.callbacks.stateChangeCbs.push(cb)
  }
}
