import { ErrorCallback } from '../types'
import { AudioCallback, Microphone } from './types'
import { AudioProcessor, BrowserAudioProcessor } from './browser_audio_processor'

export class BrowserMicrophone implements Microphone {
  private readonly audioProcessor: AudioProcessor
  private onAudioCb: AudioCallback = () => {}

  constructor(sampleRate: number, audioProcessor?: AudioProcessor) {
    this.audioProcessor = audioProcessor ?? new BrowserAudioProcessor(sampleRate, this.handleAudio)
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
    this.audioProcessor.mute()
  }

  unmute(): void {
    this.audioProcessor.unmute()
  }

  private readonly handleAudio = (audioBuffer: Int16Array): void => {
    this.onAudioCb(audioBuffer)
  }
}
