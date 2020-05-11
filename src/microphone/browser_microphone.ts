import { AudioCallback, Microphone } from './types'
import { AudioProcessor, BrowserAudioProcessor } from './browser_audio_processor'
import { AudioFilter, generateDownsampler, float32ToInt16 } from './downsampler'

export class BrowserMicrophone implements Microphone {
  private readonly audioProcessor: AudioProcessor
  private readonly downsampler: AudioFilter

  private isMuted: boolean = false
  private onAudioCb: AudioCallback = () => {}

  constructor(sampleRate: number, audioProcessor?: AudioProcessor, downsampler?: AudioFilter) {
    this.audioProcessor = audioProcessor ?? new BrowserAudioProcessor(this.handleAudio)
    this.downsampler = downsampler ?? generateDownsampler(this.audioProcessor.sampleRate, sampleRate)
  }

  onAudio(cb: AudioCallback): void {
    this.onAudioCb = cb
  }

  async initialize(): Promise<void> {
    return this.audioProcessor.initialize()
  }

  async close(): Promise<void> {
    this.mute()
    return this.audioProcessor.close()
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
