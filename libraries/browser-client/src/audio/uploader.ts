import { Client, ClientState, ClientOptions, EventCallbacks } from '../client'

import { Segment } from '../speechly'

const ErrNoAudioContext = new Error('No AudioContext available')

/**
 * Client for processing an existing AudioBuffer or MediaStream.
 */
export class AudioUploader {
  private readonly client: Client
  private readonly nativeResamplingSupported: boolean
  private readonly sampleRate: number
  private audioContext?: AudioContext
  private readonly callbacks: EventCallbacks

  constructor(options: ClientOptions) {
    this.callbacks = new EventCallbacks()
    this.client = options.client ?? new Client(options)
    this.client.registerListener(this.callbacks)
    this.sampleRate = options.sampleRate ?? 16000

    try {
      const constraints = window.navigator.mediaDevices.getSupportedConstraints()
      this.nativeResamplingSupported = constraints.sampleRate === true
    } catch {
      this.nativeResamplingSupported = false
    }
  }

  async initialize(): Promise<void> {
    if (this.audioContext) {
      return
    }
    await this.client.connect()
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
    await this.client.setSampleRate(this.audioContext.sampleRate)
  }

  async close(): Promise<void> {
    if (this.audioContext !== undefined) {
      await this.audioContext.close()
      this.audioContext = undefined
    }
    await this.client.close()
  }

  async sendAudioData(audioData: ArrayBuffer): Promise<void> {
    await this.initialize()
    const audioBuffer = await this.audioContext?.decodeAudioData(audioData)
    if (audioBuffer === undefined) {
      throw ErrNoAudioContext
    }

    const samples = audioBuffer.getChannelData(0)

    // convert 2-channel audio to 1-channel if need be
    if (audioBuffer.numberOfChannels > 1) {
      const chan1samples = audioBuffer.getChannelData(1)
      for (let i = 0; i < samples.length; i++) {
        samples[i] = (samples[i] + chan1samples[i]) / 2.0
      }
    }

    await this.client.startContext()

    let sendBuffer: Float32Array
    for (let b = 0; b < samples.length; b += 16000) {
      const e = b + 16000
      if (e > samples.length) {
        sendBuffer = samples.slice(b)
      } else {
        sendBuffer = samples.slice(b, e)
      }
      this.client.sendAudio(sendBuffer)
    }

    await this.client.stopContext()
  }

  onSegmentChange(cb: (s: Segment) => void): void {
    this.callbacks.segmentChangeCbs.push(cb)
  }

  onStateChange(cb: (s: ClientState) => void): void {
    this.callbacks.stateChangeCbs.push(cb)
  }
}
