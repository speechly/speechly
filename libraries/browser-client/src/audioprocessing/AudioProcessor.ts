import AudioTools from './AudioTools'
import EnergyThresholdVAD from './EnergyThresholdVAD'

/**
 * @internal
 */
class AudioProcessor {
  public vad?: EnergyThresholdVAD

  /**
   * Returns true when StartContext is called and expecting StopContext next
   */
  public isActive = false

  /**
   * Current count of downsampled and continuously processed samples (thru ProcessAudio) from start of stream
   */
  public streamSamplePos = 0
  public samplesSent = 0
  public utteranceSerial = -1
  public onSendAudio = (samples: Float32Array, startIndex: number, length: number): void => {}
  public onVadStateChange = (isSignalDetected: boolean): void => {}

  private inputSampleRate: number = 16000
  private readonly internalSampleRate: number = 16000
  private sampleRingBuffer: Float32Array
  private readonly historyFrames: number = 5

  private readonly frameMillis: number = 30
  private readonly frameSamples: number

  private currentFrameNumber: number = 0
  private frameSamplePos: number = 0
  private streamFramePos: number = 0
  private wasSignalDetected: boolean = false

  constructor(inputSampleRate: number, outputSampleRate: number, frameMillis: number, historyFrames: number) {
    this.inputSampleRate = inputSampleRate
    this.internalSampleRate = outputSampleRate
    this.frameMillis = frameMillis
    this.historyFrames = historyFrames

    this.frameSamples = ~~(this.internalSampleRate * this.frameMillis / 1000)
    this.sampleRingBuffer = new Float32Array(this.frameSamples * this.historyFrames)
  }

  /**
   * Process speech audio samples from a microphone or other audio source.
   *
   * You can control when to start and stop process speech either manually with <see cref="StartContext"/> and <see cref="StopContext"/> or
   * automatically by providing a voice activity detection (VAD) field to <see cref="SpeechlyClient"/>.
   *
   * The audio is handled as follows:
   * - Downsample to 16kHz if needed
   * - Add to history ringbuffer
   * - Calculate energy (VAD)
   * - Automatic Start/StopContext (VAD)
   * - Send utterance audio to Speechly SLU decoder
   *
   * @param floats - Array of float containing samples to feed to the audio pipeline. Each sample needs to be in range -1f..1f.
   * @param start - Start index of audio to process in samples (default: `0`).
   * @param length - Length of audio to process in samples or `-1` to process the whole array (default: `-1`).
   * @param flush - StopStream internally uses this to force processing of last subframe at end of audio stream (default: `false`).
   * @returns
   */
  public processAudio(floats: Float32Array, start = 0, length = -1, flush = false): void {
    if (length < 0) length = floats.length
    if (length === 0) return

    let i = start
    const endIndex = start + length

    while (i < endIndex) {
      const frameBase = this.currentFrameNumber * this.frameSamples

      if (this.inputSampleRate === this.internalSampleRate) {
        // Copy input samples to fill current ringbuffer frame
        const samplesToFillFrame = Math.min(endIndex - i, this.frameSamples - this.frameSamplePos)
        const frameEndIndex = this.frameSamplePos + samplesToFillFrame
        while (this.frameSamplePos < frameEndIndex) {
          this.sampleRingBuffer[frameBase + this.frameSamplePos++] = floats[i++]
        }
      } else {
        // Downsample input samples to fill current ringbuffer frame
        const ratio = 1.0 * this.inputSampleRate / this.internalSampleRate
        const inputSamplesToFillFrame = Math.min(endIndex - i, Math.round(ratio * (this.frameSamples - this.frameSamplePos)))
        const samplesToFillFrame = Math.min(Math.round((endIndex - i) / ratio), this.frameSamples - this.frameSamplePos)
        if (samplesToFillFrame > 0) {
          AudioTools.downsample(floats, this.sampleRingBuffer, i, inputSamplesToFillFrame, frameBase + this.frameSamplePos, samplesToFillFrame)
        }
        i += inputSamplesToFillFrame
        this.frameSamplePos += samplesToFillFrame
      }

      if (this.frameSamplePos > this.frameSamples) {
        throw new Error(`this.frameSamplePos (${this.frameSamplePos}) > this.frameSamples (${this.frameSamples})`)
      }

      // Process frame
      if (this.frameSamplePos === this.frameSamples || flush) {
        const subFrameSamples = flush ? this.frameSamplePos : this.frameSamples

        if (!flush) {
          this.processFrame(this.sampleRingBuffer, frameBase, subFrameSamples)
        }

        if (this.isActive) {
          if (this.samplesSent === 0) {
            // Start of the utterance - send history frames
            const sendHistory = Math.min(this.streamFramePos, this.historyFrames - 1)
            let historyFrameIndex = (this.currentFrameNumber + this.historyFrames - sendHistory) % this.historyFrames
            while (historyFrameIndex !== this.currentFrameNumber) {
              this.onSendAudio(this.sampleRingBuffer, historyFrameIndex * this.frameSamples, this.frameSamples)
              this.samplesSent += this.frameSamples
              historyFrameIndex = (historyFrameIndex + 1) % this.historyFrames
            }
          }
          this.onSendAudio(this.sampleRingBuffer, frameBase, subFrameSamples)
          this.samplesSent += subFrameSamples
        }

        if (this.frameSamplePos === this.frameSamples) {
          this.frameSamplePos = 0
          this.streamFramePos += 1
          this.streamSamplePos += subFrameSamples
          this.currentFrameNumber = (this.currentFrameNumber + 1) % this.historyFrames
        }
      }
    }
  }

  public startContext(): void {
    this.isActive = true
    this.samplesSent = 0
    this.utteranceSerial++
  }

  public stopContext(): void {
    this.flush()
    this.isActive = false
  }

  public reset(inputSampleRate?: number): void {
    this.isActive = false
    this.streamFramePos = 0
    this.streamSamplePos = 0
    this.frameSamplePos = 0
    this.currentFrameNumber = 0
    this.utteranceSerial = -1
    if (inputSampleRate) this.inputSampleRate = inputSampleRate
    this.vad?.resetVAD()
  }

  /**
   * @returns current position in stream in milliseconds
   */
  public getStreamPosition(): number {
    return Math.round(this.streamSamplePos / this.internalSampleRate * 1000)
  }

  private flush(): void {
    this.processAudio(this.sampleRingBuffer, 0, this.frameSamplePos, true)
  }

  private processFrame(floats: Float32Array, start = 0, length = -1): void {
    if (this.vad?.vadOptions.enabled) {
      this.processVadFrame(this.vad, floats, start, length)
    }
  }

  private processVadFrame(vad: EnergyThresholdVAD, floats: Float32Array, start = 0, length = -1): void {
    vad.processFrame(floats, start, length)
    if (vad.isSignalDetected !== this.wasSignalDetected) {
      this.onVadStateChange(vad.isSignalDetected)
      this.wasSignalDetected = vad.isSignalDetected
    }
  }
}

export default AudioProcessor
