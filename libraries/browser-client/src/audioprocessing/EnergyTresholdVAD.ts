import AudioTools from './AudioTools'

/**
/// Adaptive energy threshold voice activity detection (VAD) implementation.
/// It can be used to enable hands-free operation of the SLU decoder.
///
/// When enough frames with a signal stronger than SignalToNoiseDb have been detected, IsSignalDetected goes true. When enough silent frames have been detected, IsSignalDetected goes false after the sustain time.
/// Use its public fields to configure the static noise gate level, signal-to-noise level, activation/deactivation treshold (ratio of signal to silent frames) and the signal sustain time.
/// The background noise level gradually adapts when no signal is detected.
///
/// IsSignalDetected can be used to drive SpeechlyClient's StartContext and StopContext automatically by setting ControlListening true.
*/

class EnergyTresholdVAD {
  /**
    "Run energy analysis."
  */
  Enabled = true

  /**
  [Tooltip("Signal-to-noise energy ratio needed for frame to be 'loud'")]
  */
  SignalToNoiseDb = 3.0

  /**
  [Range(-90.0f, 0.0f)]
  [Tooltip("Energy threshold - below this won't trigger activation")]
  */
  NoiseGateDb = -24.0

  /**
  [Range(0, 5000)]
  [Tooltip("Rate of background noise learn. Defined as duration in which background noise energy is moved halfway towards current frame's energy.")]
  */
  NoiseLearnHalftimeMillis = 400

  /**
   * Number of past frames analyzed for energy threshold VAD. Should be less or equal than HistoryFrames.
   * [Range(1, 32)]
   */
  SignalSearchFrames = 5

  /**
  [Range(.0f, 1.0f)]
  [Tooltip("Minimum 'signal' to 'silent' frame ratio in history to activate 'IsSignalDetected'")]
  */
  SignalActivation = 0.7

  /**
  [Range(.0f, 1.0f)]
  [Tooltip("Maximum 'signal' to 'silent' frame ratio in history to inactivate 'IsSignalDetected'. Only evaluated when the sustain period is over.")]
  */
  SignalRelease = 0.2

  /**
  [Range(0, 8000)]
  [Tooltip("Duration to keep 'IsSignalDetected' active. Renewed as long as VADActivation is holds true.")]
  */
  SignalSustainMillis = 3000

  IsSignalDetected = false
  SignalDb = -90.0
  NoiseLevelDb = -90.0

  /**
  [Header("Signal detection controls listening")]
  [Tooltip("Enable listening control if you want to use IsSignalDetected to control SpeechlyClient's StartContext/StopContext.")]
  */
  ControlListening = true

  Energy = 0.0
  BaselineEnergy = -1.0
  loudFrameBits = 0
  vadSustainMillisLeft = 0
  FrameMillis = 30

  // public ProcessFrame(float[] floats: number[], int start = 0, int length = -1) {
  public ProcessFrame(floats: Float32Array, start = 0, length = -1): void {
    if (!this.Enabled) {
      this.ResetVAD()
      return
    }

    this.Energy = AudioTools.GetEnergy(floats, start, length)

    if (this.BaselineEnergy < 0) {
      this.BaselineEnergy = this.Energy
    }

    const isLoudFrame = this.Energy > Math.max(AudioTools.DbToEnergy(this.NoiseGateDb), this.BaselineEnergy * AudioTools.DbToEnergy(this.SignalToNoiseDb))
    this.PushFrameHistory(isLoudFrame)

    this.IsSignalDetected = this.DetermineNewSignalState(this.IsSignalDetected)

    this.AdaptBackgroundNoise()

    this.SignalDb = AudioTools.EnergyToDb(this.Energy / this.BaselineEnergy)
    this.NoiseLevelDb = AudioTools.EnergyToDb(this.BaselineEnergy)
  }

  private DetermineNewSignalState(currentState: boolean): boolean {
    this.vadSustainMillisLeft = Math.max(this.vadSustainMillisLeft - this.FrameMillis, 0)

    const loudFrames = this.CountLoudFrames(this.SignalSearchFrames)

    const activationFrames = Math.round(this.SignalActivation * this.SignalSearchFrames)
    const releaseFrames = Math.round(this.SignalRelease * this.SignalSearchFrames)

    if (loudFrames >= activationFrames) {
      // Renew sustain time
      this.vadSustainMillisLeft = this.SignalSustainMillis
      return true
    }

    if (loudFrames <= releaseFrames && this.vadSustainMillisLeft === 0) {
      return false
    }

    return currentState
  }

  private AdaptBackgroundNoise(): void {
    // Gradually learn background noise level
    if (!this.IsSignalDetected) {
      if (this.NoiseLearnHalftimeMillis > 0) {
        var decay = Math.pow(2.0, -this.FrameMillis / this.NoiseLearnHalftimeMillis)
        this.BaselineEnergy = (this.BaselineEnergy * decay) + (this.Energy * (1 - decay))
      }
    }
  }

  private PushFrameHistory(isLoud: boolean): void {
    this.loudFrameBits = (isLoud ? 1 : 0) | (this.loudFrameBits << 1)
  }

  private CountLoudFrames(numHistoryFrames: number): number {
    let numActiveFrames = 0
    let t = this.loudFrameBits
    while (numHistoryFrames > 0) {
      if ((t & 1) === 1) numActiveFrames++
      t = t >> 1
      numHistoryFrames--
    }
    return numActiveFrames
  }

  private ResetVAD(): void {
    this.IsSignalDetected = false
    this.loudFrameBits = 0
    this.Energy = 0
    this.BaselineEnergy = -1
  }
}

export default EnergyTresholdVAD
