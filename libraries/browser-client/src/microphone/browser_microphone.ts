import {
  ErrDeviceNotSupported,
  ErrNoAudioConsent,
  ErrNotInitialized,
  DefaultSampleRate,
  MicrophoneOptions,
} from './types'
import { Client, EventCallbacks } from '../client'
import { Segment, Word, Entity, Intent } from '../speechly'

import audioworklet from './audioworklet'

const audioProcessEvent = 'audioprocess'
const baseBufferSize = 4096

export class BrowserMicrophone {
  private readonly debug: boolean
  private readonly isWebkit: boolean
  private readonly sampleRate: number

  private readonly client: Client
  private readonly callbacks: EventCallbacks

  private muted: boolean = false
  private initialized: boolean = false
  private audioContext?: AudioContext
  private resampleRatio?: number

  private readonly nativeResamplingSupported: boolean
  private readonly autoGainControl: boolean

  // The media stream and audio track are initialized during `initialize()` call.
  private audioTrack?: MediaStreamTrack
  private mediaStream?: MediaStream
  private audioProcessor?: ScriptProcessorNode

  private stats = {
    maxSignalEnergy: 0.0,
  }

  constructor(options: MicrophoneOptions) {
    // ensure audioContext is available
    if (window.AudioContext !== undefined) {
      this.isWebkit = false
    } else if (window.webkitAudioContext !== undefined) {
      this.isWebkit = true
    } else {
      throw ErrDeviceNotSupported
    }

    // ensure mediaDevices are available
    if (window.navigator?.mediaDevices === undefined) {
      throw ErrDeviceNotSupported
    }

    try {
      const constraints = window.navigator.mediaDevices.getSupportedConstraints()
      this.nativeResamplingSupported = constraints.sampleRate === true
      if (options.autoGainControl != null && options.autoGainControl) {
        this.autoGainControl = constraints.autoGainControl === true
      } else {
        this.autoGainControl = false
      }
    } catch {
      this.nativeResamplingSupported = false
      this.autoGainControl = false
    }

    this.callbacks = new EventCallbacks()
    this.client = options.client ?? new Client(options)
    this.client.registerListener(this.callbacks)
    this.sampleRate = options.sampleRate ?? DefaultSampleRate

    this.debug = options.debug ?? false
  }

  /**
   * Initializes the microphone. Needs to happen after a user interaction in the view.
   * The reason for that is that it's required for user to first interact with the page,
   * before it can capture or play audio and video, for privacy and user experience reasons.
   */
  async initialize(): Promise<void> {
    if (this.initialized) {
      return
    }

    if (window.webkitAudioContext !== undefined) {
      // eslint-disable-next-line new-cap
      this.audioContext = new window.webkitAudioContext()
    } else {
      const opts: AudioContextOptions = {}
      if (this.nativeResamplingSupported) {
        opts.sampleRate = this.sampleRate
      }
      this.audioContext = new window.AudioContext(opts)
    }

    if (this.isWebkit) {
      // Start audio context if we are dealing with a WebKit browser.
      //
      // WebKit browsers (e.g. Safari) require to resume the context first,
      // before obtaining user media by calling `mediaDevices.getUserMedia`.
      //
      // If done in a different order, the audio context will resume successfully,
      // but will emit empty audio buffers.
      await this.audioContext.resume()
    }

    await this.client.setSampleRate(this.audioContext.sampleRate)

    const mediaStreamConstraints: MediaStreamConstraints = {
      video: false,
    }

    if (this.nativeResamplingSupported || this.autoGainControl) {
      mediaStreamConstraints.audio = {
        sampleRate: this.sampleRate,
        // @ts-ignore
        autoGainControl: this.autoGainControl,
      }
    } else {
      mediaStreamConstraints.audio = true
    }

    try {
      this.mediaStream = await window.navigator.mediaDevices.getUserMedia(mediaStreamConstraints)
    } catch {
      throw ErrNoAudioConsent
    }

    this.audioTrack = this.mediaStream.getAudioTracks()[0]

    // Start audio context if we are dealing with a non-WebKit browser.
    //
    // Non-webkit browsers (currently only Chrome on Android)
    // require that user media is obtained before resuming the audio context.
    //
    // If audio context is attempted to be resumed before `mediaDevices.getUserMedia`,
    // `audioContext.resume()` will hang indefinitely, without being resolved or rejected.
    if (!this.isWebkit) {
      await this.audioContext.resume()
    }

    if (window.AudioWorkletNode !== undefined) {
      const blob = new Blob([audioworklet], { type: 'text/javascript' })
      const blobURL = window.URL.createObjectURL(blob)
      await this.audioContext.audioWorklet.addModule(blobURL)
      const speechlyNode = new AudioWorkletNode(this.audioContext, 'speechly-worklet')
      this.audioContext.createMediaStreamSource(this.mediaStream).connect(speechlyNode)
      speechlyNode.connect(this.audioContext.destination)
      // @ts-ignore
      if (window.SharedArrayBuffer !== undefined) {
        // Chrome, Edge, Firefox, Firefox Android
        // @ts-ignore
        const controlSAB = new window.SharedArrayBuffer(4 * Int32Array.BYTES_PER_ELEMENT)
        // @ts-ignore
        const dataSAB = new window.SharedArrayBuffer(1024 * Float32Array.BYTES_PER_ELEMENT)
        this.client.useSharedArrayBuffers(controlSAB, dataSAB)
        speechlyNode.port.postMessage({
          type: 'SET_SHARED_ARRAY_BUFFERS',
          controlSAB,
          dataSAB,
          debug: this.debug,
        })
      } else {
        // Opera, Chrome Android, Webview Android
        if (this.debug) {
          console.log('[SpeechlyClient]', 'can not use SharedArrayBuffer')
        }
      }

      speechlyNode.port.onmessage = (event: MessageEvent) => {
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
        console.log('[SpeechlyClient]', 'can not use AudioWorkletNode')
      }
      // Safari, iOS Safari and Internet Explorer
      if (this.isWebkit) {
        // Multiply base buffer size of 4 kB by the resample ratio rounded up to the next power of 2.
        // i.e. for 48 kHz to 16 kHz downsampling, this will be 4096 (base) * 4 = 16384.
        this.resampleRatio = this.audioContext.sampleRate / this.sampleRate
        const bufSize = baseBufferSize * Math.pow(2, Math.ceil(Math.log(this.resampleRatio) / Math.log(2)))
        this.audioProcessor = this.audioContext.createScriptProcessor(bufSize, 1, 1)
      } else {
        this.audioProcessor = this.audioContext.createScriptProcessor(undefined, 1, 1)
      }
      this.audioContext.createMediaStreamSource(this.mediaStream).connect(this.audioProcessor)
      this.audioProcessor.connect(this.audioContext.destination)
      this.audioProcessor.addEventListener(audioProcessEvent, (event: AudioProcessingEvent) => {
        this.handleAudio(event.inputBuffer.getChannelData(0))
      })
    }

    this.initialized = true
    this.muted = true
  }

  /**
   * Closes the microphone, releases all resources and stops the Speechly client.
   */
  async close(): Promise<void> {
    if (!this.initialized) {
      throw ErrNotInitialized
    }

    await this.client.close()
    this.muted = true

    // Stop all media tracks
    const t = this.audioTrack as MediaStreamTrack
    t.enabled = false
    const stream = this.mediaStream as MediaStream
    stream.getTracks().forEach(t => t.stop())

    // Disconnect and stop ScriptProcessorNode
    if (this.audioProcessor != null) {
      const proc = this.audioProcessor
      proc.disconnect()
    }

    // Unset all audio infrastructure
    this.mediaStream = undefined
    this.audioTrack = undefined
    this.audioProcessor = undefined
    this.initialized = false
  }

  /**
   * Unmutes the microphone and starts a new Speechly AudioContext.
   * Returns the contextId of the started AudioContext.
   */
  async startRecording(appId?: string): Promise<string> {
    await this.initialize()
    const contextId = await this.client.startContext(appId)
    this.muted = false
    return contextId
  }

  /**
   * Stops the active Speechly AudioContext and mutes the microphone.
   * Returns the contextId of the stopped AudioContext.
   */
  async stopRecording(): Promise<string> {
    this.muted = true
    return this.client.stopContext()
  }

  private handleAudio(array: Float32Array): void {
    if (this.muted) {
      return
    }
    if (array.length > 0) {
      this.client.sendAudio(array)
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

  /**
   * @returns true if microphone is open
   */
  public isListening(): boolean {
    return !this.muted
  }

  /**
   * print statistics to console
   */
  public printStats(): void {
    if (this.audioTrack != null) {
      const settings: MediaTrackSettings = this.audioTrack.getSettings()
      console.log(this.audioTrack.label, this.audioTrack.readyState)
      // @ts-ignore
      console.log('channelCount', settings.channelCount)
      // @ts-ignore
      console.log('latency', settings.latency)
      // @ts-ignore
      console.log('autoGainControl', settings.autoGainControl)
    }
    console.log('maxSignalEnergy', this.stats.maxSignalEnergy)
  }
}
