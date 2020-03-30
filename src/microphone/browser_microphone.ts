import { AudioCallback, Microphone, ErrorCallback } from '../types'
import { generateDownsampler, float32ToInt16, AudioFilter } from './downsampler'
import { ErrAlreadyInitialized, ErrDeviceNotSupported, ErrNoAudioConsent, ErrNotInitialized } from './const'

export class BrowserMicrophone implements Microphone {
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
      return cb(ErrDeviceNotSupported)
    }

    window.navigator.mediaDevices
      .getUserMedia({ audio: true, video: false })
      .then(mediaStream => {
        this.mediaStream = mediaStream
        this.audioTrack = this.mediaStream.getAudioTracks()[0]

        // Mute the microphone, since that is the chosen initial state.
        this.audioTrack.enabled = false

        if (window.AudioContext !== undefined) {
          this.audioContext = new window.AudioContext()
        } else if (window.webkitAudioContext !== undefined) {
          // eslint-disable-next-line new-cap
          this.audioContext = new window.webkitAudioContext()
        } else {
          throw Error('Microphone functionality is not supported in your browser')
        }

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
  }
}
