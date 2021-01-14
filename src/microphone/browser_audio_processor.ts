import { ErrDeviceNotSupported, ErrNoAudioConsent, ErrNotInitialized } from './types'
import { AudioFilter, newSampler } from './sampler'

export type AudioHandler = (audioBuffer: Int16Array) => void

export interface AudioProcessor {
  initialize(): Promise<void>
  close(): Promise<void>
  mute(): void
  unmute(): void
}

const audioProcessEvent = 'audioprocess'
const baseBufferSize = 4096

export class BrowserAudioProcessor implements AudioProcessor {
  private initialized: boolean = false
  private muted: boolean = false

  // Audio callback invoked when audio is returned by the script processor.
  private readonly isWebkit: boolean
  private readonly onAudio: AudioHandler
  private readonly audioContext: AudioContext
  private readonly sampler: AudioFilter
  private readonly nativeResamplingSupported: boolean
  private readonly sampleRate: number

  // The media stream and audio track are initialized during `initialize()` call.
  private audioTrack?: MediaStreamTrack
  private mediaStream?: MediaStream

  // Audio processing functionality is initialized lazily during first `unmute()` call.
  // The reason for that is that it's required for user to first interact with the page,
  // before it can capture or play audio and video, for privacy and user experience reasons.
  private audioProcessor?: ScriptProcessorNode

  constructor(sampleRate: number, onAudio: AudioHandler, sampler?: AudioFilter) {
    try {
      const constraints = window.navigator.mediaDevices.getSupportedConstraints()
      this.nativeResamplingSupported = constraints.sampleRate === true
    } catch {
      this.nativeResamplingSupported = false
    }

    if (window.AudioContext !== undefined) {
      const opts: AudioContextOptions = {}
      if (this.nativeResamplingSupported) {
        opts.sampleRate = sampleRate
      }

      this.audioContext = new window.AudioContext(opts)
      this.isWebkit = false
    } else if (window.webkitAudioContext !== undefined) {
      // eslint-disable-next-line new-cap
      this.audioContext = new window.webkitAudioContext()
      this.isWebkit = true
    } else {
      throw ErrDeviceNotSupported
    }

    this.sampler = sampler ?? newSampler(this.audioContext.sampleRate, sampleRate)
    this.sampleRate = sampleRate
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
      const opts: MediaStreamConstraints = {
        video: false,
      }

      if (this.nativeResamplingSupported) {
        opts.audio = {
          sampleRate: this.sampleRate,
        }
      } else {
        opts.audio = true
      }

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
    if (!this.isWebkit) {
      await this.audioContext.resume()
    }

    if (this.isWebkit) {
      // Multiply base buffer size of 4 kB by the resample ratio rounded up to the next power of 2.
      // i.e. for 48 kHz to 16 kHz downsampling, this will be 4096 (base) * 4 = 16384.
      const bufSize = baseBufferSize * Math.pow(2, Math.ceil(Math.log(this.sampler.resampleRatio) / Math.log(2)))
      this.audioProcessor = this.audioContext.createScriptProcessor(bufSize, 1, 1)
    } else {
      this.audioProcessor = this.audioContext.createScriptProcessor(undefined, 1, 1)
    }
    if (window.AudioWorkletNode !== undefined && this.nativeResamplingSupported) {
      await this.audioContext.audioWorklet.addModule('speechly-processor.js')
      const speechlyNode = new AudioWorkletNode(this.audioContext, 'speechly-worklet')
      this.audioContext.createMediaStreamSource(this.mediaStream).connect(speechlyNode)
      speechlyNode.connect(this.audioContext.destination)
      speechlyNode.port.onmessage = this.handleWorkletAudio
    } else {
      this.audioContext.createMediaStreamSource(this.mediaStream).connect(this.audioProcessor)
      this.audioProcessor.connect(this.audioContext.destination)
      this.audioProcessor.addEventListener(audioProcessEvent, this.handleAudio)
    }

    this.initialized = true
  }

  async close(): Promise<void> {
    if (!this.initialized) {
      throw ErrNotInitialized
    }

    // Stop all media tracks
    const stream = this.mediaStream as MediaStream
    stream.getTracks().forEach(t => t.stop())

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

  private readonly handleAudio = (event: AudioProcessingEvent): void => {
    if (this.muted) {
      return
    }

    this.onAudio(this.sampler.call(event.inputBuffer.getChannelData(0)))
  }

  private readonly handleWorkletAudio = (event: MessageEvent): void => {
    if (this.muted) {
      return
    }

    this.onAudio(event.data)
  }
}
