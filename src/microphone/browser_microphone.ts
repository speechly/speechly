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

  async initialize(): Promise<void> {
    await this.audioProcessor.initialize()
    this.mute()
  }

  async close(): Promise<void> {
    this.mute()
    return this.audioProcessor.close()
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
