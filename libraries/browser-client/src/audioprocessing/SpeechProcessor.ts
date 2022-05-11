import AudioTools from './AudioTools'
import EnergyTresholdVAD from './EnergyTresholdVAD'

class SpeechProcessor {
  IsAudioStreaming = true
  public Vad: EnergyTresholdVAD = null
  /**
   * Returns true when StartContext is called and expecting StopContext next
   */
  public IsActive = false

  /**
   * Current count of continuously processed samples (thru ProcessAudio) from start of stream
   */
  public StreamSamplePos = 0

  public SamplesSent = 0

  private readonly inputSampleRate = 16000
  private readonly internalSampleRate = 16000
  private readonly frameMillis = 30
  private sampleRingBuffer = null
  private frameSamplePos = 0
  private currentFrameNumber = 0
  private readonly historyFrames = 5

  private readonly frameSamples
  private streamFramePos = 0

  constructor() {
    this.frameSamples = this.internalSampleRate * this.frameMillis / 1000
    this.sampleRingBuffer = new Array(this.frameSamples * this.historyFrames)
  }

  public SendAudio = (samples: number[], startIndex: number, length: number): void => {}

  public StartContext(): void {
    console.log('StartContext')
    if (this.IsActive) {
      throw new Error('Already listening.')
    }

    /*
    if (!this.IsAudioStreaming) {
      StartStream(AudioInputStreamIdentifier, auto: true);
    }
    */

    this.IsActive = true
    this.SamplesSent = 0
  }

  public StopContext(): void {
    console.log('StopContext')
    if (!this.IsActive) {
      throw new Error('Already stopped listening.')
    }
    this.IsActive = false
  }

  /// <summary>
  /// Process speech audio samples from a microphone or other audio source.
  ///
  /// It's recommended to constantly feed new audio as long as you want to use Speechly's SLU services.
  ///
  /// You can control when to start and stop process speech either manually with <see cref="StartContext"/> and <see cref="StopContext"/> or
  /// automatically by providing a voice activity detection (VAD) field to <see cref="SpeechlyClient"/>.
  ///
  /// The audio is handled as follows:
  /// - Downsample to 16kHz if needed
  /// - Add to history ringbuffer
  /// - Calculate energy (VAD)
  /// - Automatic Start/StopContext (VAD)
  /// - Send utterance audio to a file
  /// - Send utterance audio to Speechly SLU decoder
  /// </summary>
  /// <param name="floats">Array of float containing samples to feed to the audio pipeline. Each sample needs to be in range -1f..1f.</param>
  /// <param name="start">Start index of audio to process in samples (default: `0`).</param>
  /// <param name="length">Length of audio to process in samples or `-1` to process the whole array (default: `-1`).</param>
  /// <param name="forceSubFrameProcess"><see cref="StopStream"/> internally uses this to force processing of last subframe at end of audio stream (default: `false`).</param>

  public ProcessAudio(floats: number[], start = 0, length = -1, forceSubFrameProcess = false): void {
    /*
    if (!this.IsAudioStreaming) {
      StartStream(AudioInputStreamIdentifier, auto: false);  // Assume no auto-start/stop if ProcessAudio call encountered before startContext call
    }
    */

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
        AudioTools.Downsample(floats, this.sampleRingBuffer, i, inputSamplesToFillFrame, frameBase + this.frameSamplePos, samplesToFillFrame)
        i += inputSamplesToFillFrame
        this.frameSamplePos += samplesToFillFrame
      }

      // Process frame
      if (this.frameSamplePos === this.frameSamples || forceSubFrameProcess) {
        this.frameSamplePos = 0
        const subFrameSamples = forceSubFrameProcess ? this.frameSamplePos : this.frameSamples

        if (!forceSubFrameProcess) {
          this.ProcessFrame(this.sampleRingBuffer, frameBase, subFrameSamples)
        }

        if (this.IsActive) {
          if (this.SamplesSent === 0) {
            // Start of the utterance - send history frames
            const sendHistory = Math.min(this.streamFramePos, this.historyFrames - 1)
            let historyFrameIndex = (this.currentFrameNumber + this.historyFrames - sendHistory) % this.historyFrames
            while (historyFrameIndex !== this.currentFrameNumber) {
              this.SendAudio(this.sampleRingBuffer, historyFrameIndex * this.frameSamples, this.frameSamples)
              historyFrameIndex = (historyFrameIndex + 1) % this.historyFrames
            }
          }
          this.SendAudio(this.sampleRingBuffer, frameBase, subFrameSamples)
        }

        this.streamFramePos += 1
        this.StreamSamplePos += subFrameSamples
        this.currentFrameNumber = (this.currentFrameNumber + 1) % this.historyFrames
      }
    }
  }

  private ProcessFrame(floats: number[], start = 0, length = -1): void {
    this.AnalyzeAudioFrame(floats, start, length)
    this.AutoControlListening()
  }

  private AnalyzeAudioFrame(waveData: number[], s: number, frameSamples: number): void {
    if (this.Vad?.Enabled) {
      this.Vad.ProcessFrame(waveData, s, frameSamples)
    }
  }

  private AutoControlListening(): void {
    if (this.Vad?.Enabled && this.Vad?.ControlListening) {
      if (!this.IsActive && this.Vad.IsSignalDetected) {
        this.StartContext()
      }

      if (this.IsActive && !this.Vad.IsSignalDetected) {
        this.StopContext()
      }
    }
  }
}

export default SpeechProcessor
