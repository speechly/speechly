import { ErrorCallback } from '../types'
import { AudioCallback, Microphone } from './types'
import { AudioProcessor, BrowserAudioProcessor } from './browser_audio_processor'
import { float32ToInt16, AudioFilter, newSampler } from './sampler'

export class BrowserMicrophone implements Microphone {
  private readonly audioProcessor: AudioProcessor
  private readonly downsampler: AudioFilter

  private isMuted: boolean = false
  private onAudioCb: AudioCallback = () => {}

  constructor(sampleRate: number, audioProcessor?: AudioProcessor, sampler?: AudioFilter) {
    this.audioProcessor = audioProcessor ?? new BrowserAudioProcessor(sampleRate, this.handleAudio)
    this.downsampler = sampler ?? newSampler(this.audioProcessor.sampleRate, sampleRate)
  }

  onAudio(cb: AudioCallback): void {
    this.onAudioCb = cb
  }

  initialize(cb: ErrorCallback): void {
    this.audioProcessor
      .initialize()
      .then(() => {
        this.mute()
        cb()
      })
      .catch(cb)
  }

  close(cb: ErrorCallback): void {
    this.mute()
    this.audioProcessor.close()
    cb()
  }

  mute(): void {
    this.isMuted = true
    this.audioProcessor.mute()
  }

  unmute(): void {
    this.isMuted = false
    this.audioProcessor.unmute()
  }

  private readonly handleAudio = (audioBuffer: Float32Array): void => {
    if (this.isMuted) {
      return
    }

    this.onAudioCb(float32ToInt16(this.downsampler.call(audioBuffer)))
  }
}
