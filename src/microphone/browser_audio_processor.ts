import { ErrDeviceNotSupported, ErrNoAudioConsent, ErrNotInitialized } from './types'

export type AudioHandler = (audioBuffer: Float32Array) => void

export interface AudioProcessor {
  readonly sampleRate: number
  initialize(): Promise<void>
  close(): Promise<void>
  mute(): void
  unmute(): void
}

const audioProcessEvent = 'audioprocess'

export class BrowserAudioProcessor implements AudioProcessor {
  private initialized: boolean = false
  readonly sampleRate: number

  // Audio callback invoked when audio is returned by the script processor.
  private readonly isWebkit: boolean
  private readonly onAudio: AudioHandler
  private readonly audioContext: AudioContext

  // The media stream and audio track are initialized during `initialize()` call.
  private audioTrack?: MediaStreamTrack
  private mediaStream?: MediaStream

  // Audio processing functionality is initialized lazily during first `unmute()` call.
  // The reason for that is that it's required for user to first interact with the page,
  // before it can capture or play audio and video, for privacy and user experience reasons.
  private audioProcessor?: ScriptProcessorNode

  constructor(onAudio: AudioHandler) {
    if (window.AudioContext !== undefined) {
      this.audioContext = new window.AudioContext()
      this.isWebkit = false
    } else if (window.webkitAudioContext !== undefined) {
      // eslint-disable-next-line new-cap
      this.audioContext = new window.webkitAudioContext()
      this.isWebkit = true
    } else {
      throw ErrDeviceNotSupported
    }

    this.sampleRate = this.audioContext.sampleRate
    this.onAudio = onAudio
  }

  async initialize(): Promise<void> {
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
    if (this.isWebkit) {
      await this.audioContext.resume()
    }

    try {
      this.mediaStream = await window.navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false,
      })
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
    if (!this.isWebkit) {
      await this.audioContext.resume()
    }

    this.audioProcessor = this.audioContext.createScriptProcessor(undefined, 2, 1)
    this.audioContext.createMediaStreamSource(this.mediaStream).connect(this.audioProcessor)
    this.audioProcessor.connect(this.audioContext.destination)
    this.audioProcessor.addEventListener(audioProcessEvent, this.handleAudio)

    this.initialized = true
  }

  async close(): Promise<void> {
    if (!this.initialized) {
      throw ErrNotInitialized
    }

    // Stop all media tracks
    const stream = this.mediaStream as MediaStream
    stream.getTracks().forEach((t) => t.stop())

    // Disconnect and stop ScriptProcessorNode
    const proc = this.audioProcessor as ScriptProcessorNode
    proc.disconnect()
    proc.removeEventListener(audioProcessEvent, this.handleAudio)

    // Unset all audio infrastructure
    this.mediaStream = undefined
    this.audioTrack = undefined
    this.audioProcessor = undefined
    this.initialized = false
  }

  mute(): void {
    if (this.initialized) {
      const t = this.audioTrack as MediaStreamTrack
      t.enabled = false
    }
  }

  unmute(): void {
    if (this.initialized) {
      const t = this.audioTrack as MediaStreamTrack
      t.enabled = true
    }
  }

  private readonly handleAudio = (event: AudioProcessingEvent): void => {
    this.onAudio(event.inputBuffer.getChannelData(0))
  }
}
