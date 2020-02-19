import { ErrorCallback } from '../types'
import { generateDownsampler, float32ToInt16, AudioFilter } from './downsampler'

export type AudioCallback = (audioBuffer: ArrayBuffer) => void

export const DefaultSampleRate = 16000
export const ErrNotInitialized = new Error('Microphone is not initialized')
export const ErrAlreadyInitialized = new Error('Microphone is already initialized')
export const ErrNoBrowserSupport = new Error('Current browser does not support audio API')
export const ErrNoAudioConsent = new Error('Microphone consent is no given')

export class Microphone {
  private readonly sampleRate: number
  private onAudioCb: AudioCallback = () => {}

  // The media stream and audio track are initialized during `initialize()` call.
  private audioTrack?: MediaStreamTrack
  private mediaStream?: MediaStream

  // Audio processing functionality is initialized lazily during first `unmute()` call.
  // The reason for that is that it's required for user to first interact with the page,
  // before it can capture or play audio and video, for privacy and user experience reasons.
  private audioProcessor?: ScriptProcessorNode
  private audioContext?: AudioContext
  private downsampler?: AudioFilter

  constructor(sampleRate: number) {
    this.sampleRate = sampleRate
  }

  onAudio(cb: AudioCallback): void {
    this.onAudioCb = cb
  }

  initialize(cb: ErrorCallback): void {
    if (this.audioTrack !== undefined) {
      return cb(ErrAlreadyInitialized)
    }

    if (window.navigator?.mediaDevices === undefined) {
      return cb(ErrNoBrowserSupport)
    }

    window.navigator.mediaDevices
      .getUserMedia({ audio: true, video: false })
      .then(mediaStream => {
        this.mediaStream = mediaStream
        this.audioTrack = this.mediaStream.getAudioTracks()[0]
        // Mute the microphone, since that is the chosen initial state.
        this.audioTrack.enabled = false

        cb()
      })
      .catch(() => {
        cb(ErrNoAudioConsent)
      })
  }

  close(cb: ErrorCallback): void {
    if (this.mediaStream === undefined) {
      return cb(ErrNotInitialized)
    }

    // Mute before closing, to make it graceful.
    this.mute()

    // Stop and disconnect media stream / audio context.
    this.mediaStream.getTracks().forEach(t => t.stop())

    if (this.audioProcessor !== undefined) {
      this.audioProcessor.disconnect()
    }

    // If audio context is not initialized, we don't need to close it.
    if (this.audioContext === undefined) {
      return cb()
    }

    // Unset all properties, so that the microphone can be re-initialized.
    const callback = (err: void | Error): void => {
      this.mediaStream = undefined
      this.audioTrack = undefined
      this.audioContext = undefined
      this.downsampler = undefined
      this.audioProcessor = undefined

      if (err !== undefined) {
        return cb(err)
      }

      return cb()
    }

    this.audioContext
      .close()
      .then(callback)
      .catch(callback)
  }

  mute(): void {
    if (this.audioTrack === undefined) {
      return
    }

    this.audioTrack.enabled = false
  }

  unmute(): void {
    if (this.audioTrack === undefined) {
      return
    }

    this.audioTrack.enabled = true

    if (this.audioContext === undefined) {
      this.initializeAudioContext()
    }
  }

  private initializeAudioContext(): void {
    if (this.mediaStream === undefined) {
      throw Error('Microphone media stream is not initialized')
    }

    if (this.audioContext !== undefined) {
      throw Error('Microphone audio context is already initialized')
    }

    this.audioContext = new AudioContext()
    this.downsampler = generateDownsampler(this.audioContext.sampleRate, this.sampleRate)
    this.audioProcessor = this.audioContext.createScriptProcessor(4096, 1, 1)

    // Connect microphone to processor.
    this.audioContext.createMediaStreamSource(this.mediaStream).connect(this.audioProcessor)
    // Connect processor to destination.
    this.audioProcessor.connect(this.audioContext.destination)
    // Bind audio handler to receive audio data.
    this.audioProcessor.onaudioprocess = audioProcessingEvent => {
      if (this.audioTrack === undefined) {
        throw Error('Microphone audio track is not initialized')
      }

      if (this.downsampler === undefined) {
        throw Error('Microphone downsampler is not initialized')
      }

      // Skip audio if the mic is muted.
      if (!this.audioTrack.enabled) {
        return
      }

      const downsampled = float32ToInt16(this.downsampler(audioProcessingEvent.inputBuffer.getChannelData(0)))
      this.onAudioCb(downsampled)
    }
  }
}
