import { ErrDeviceNotSupported, ErrNoAudioConsent, ErrNotInitialized, Microphone } from './types'
import { APIClient } from '../websocket'
import audioworklet from './audioworklet'

const audioProcessEvent = 'audioprocess'
const baseBufferSize = 4096

export class BrowserMicrophone implements Microphone {
  private readonly audioContext: AudioContext
  private readonly apiClient: APIClient
  private readonly resampleRatio: number
  private readonly sampleRate: number

  private initialized: boolean = false
  private muted: boolean = false

  // The media stream and audio track are initialized during `initialize()` call.
  private audioTrack?: MediaStreamTrack
  private mediaStream?: MediaStream

  // Audio processing functionality is initialized lazily during first `unmute()` call.
  // The reason for that is that it's required for user to first interact with the page,
  // before it can capture or play audio and video, for privacy and user experience reasons.
  private audioProcessor?: ScriptProcessorNode

  constructor(audioContext: AudioContext, sampleRate: number, apiClient: APIClient) {
    this.audioContext = audioContext
    this.apiClient = apiClient
    this.sampleRate = sampleRate
    this.resampleRatio = this.audioContext.sampleRate / this.sampleRate
  }

  async initialize(isWebkit: boolean, opts: MediaStreamConstraints): Promise<void> {
    if (window.navigator?.mediaDevices === undefined) {
      throw ErrDeviceNotSupported
    }

    // Start audio context if we are dealing with a WebKit browser.
    //
    // WebKit browsers (e.g. Safari) require to resume the context first,
    // before obtaining user media by calling `mediaDevices.getUserMedia`.
    //
    // If done in a different order, the audio context will resume successfully,
    // but will emit empty audio buffers.
    if (isWebkit) {
      await this.audioContext.resume()
    }

    try {
      this.mediaStream = await window.navigator.mediaDevices.getUserMedia(opts)
    } catch {
      throw ErrNoAudioConsent
    }

    this.audioTrack = this.mediaStream.getAudioTracks()[0]
    this.audioTrack.enabled = false

    // Start audio context if we are dealing with a non-WebKit browser.
    //
    // Non-webkit browsers (currently only Chrome on Android)
    // require that user media is obtained before resuming the audio context.
    //
    // If audio context is attempted to be resumed before `mediaDevices.getUserMedia`,
    // `audioContext.resume()` will hang indefinitely, without being resolved or rejected.
    if (!isWebkit) {
      await this.audioContext.resume()
    }

    if (window.AudioWorkletNode !== undefined) {
      const blob = new Blob([audioworklet], { type: 'text/javascript' })
      const blobURL = window.URL.createObjectURL(blob)
      await this.audioContext.audioWorklet.addModule(blobURL)
      const speechlyNode = new AudioWorkletNode(this.audioContext, 'speechly-worklet')
      this.audioContext.createMediaStreamSource(this.mediaStream).connect(speechlyNode)
      speechlyNode.connect(this.audioContext.destination)
      if (window.SharedArrayBuffer !== undefined) {
        // Chrome, Edge, Firefox, Firefox Android
        const controlSAB = new window.SharedArrayBuffer(2 * Int32Array.BYTES_PER_ELEMENT)
        const dataSAB = new window.SharedArrayBuffer(2 * 4096 * Float32Array.BYTES_PER_ELEMENT)
        this.apiClient.postMessage({
          type: 'SET_SHARED_ARRAY_BUFFERS',
          controlSAB,
          dataSAB,
        })
        speechlyNode.port.postMessage({
          type: 'SET_SHARED_ARRAY_BUFFERS',
          controlSAB,
          dataSAB,
        })
      } else {
        // Opera, Chrome Android, Webview Anroid
        speechlyNode.port.onmessage = (event: MessageEvent) => {
          this.handleAudio(event.data)
        }
      }
    } else {
    // Safari, iOS Safari and Internet Explorer
      if (isWebkit) {
        // Multiply base buffer size of 4 kB by the resample ratio rounded up to the next power of 2.
        // i.e. for 48 kHz to 16 kHz downsampling, this will be 4096 (base) * 4 = 16384.
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

    this.mute()
  }

  async close(): Promise<void> {
    this.mute()
    if (!this.initialized) {
      throw ErrNotInitialized
    }

    // Stop all media tracks
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

  mute(): void {
    this.muted = true

    if (this.initialized) {
      const t = this.audioTrack as MediaStreamTrack
      t.enabled = false
    }
  }

  unmute(): void {
    this.muted = false

    if (this.initialized) {
      const t = this.audioTrack as MediaStreamTrack
      t.enabled = true
    }
  }

  private readonly handleAudio = (array: Float32Array): void => {
    if (this.muted) {
      return
    }

    this.apiClient.sendAudio(array)
  }
}
