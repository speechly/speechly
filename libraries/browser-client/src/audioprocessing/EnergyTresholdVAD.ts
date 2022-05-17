import { VadDefaultOptions, VadOptions } from '../client'
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
  vadOptions: VadOptions

  FrameMillis = 30

  IsSignalDetected = false
  SignalDb = -90.0
  NoiseLevelDb = -90.0

  Energy = 0.0
  BaselineEnergy = -1.0
  loudFrameBits = 0
  vadSustainMillisLeft = 0

  constructor(vadOptionOverrides?: Partial<VadOptions>) {
    this.vadOptions = { ...VadDefaultOptions, ...vadOptionOverrides }
    console.log(this.vadOptions)
  }

  public ProcessFrame(floats: Float32Array, start = 0, length = -1): void {
    if (!this.vadOptions.enabled) {
      this.ResetVAD()
      return
    }

    this.Energy = AudioTools.GetEnergy(floats, start, length)

    if (this.BaselineEnergy < 0) {
      this.BaselineEnergy = this.Energy
    }

    const isLoudFrame = this.Energy > Math.max(AudioTools.DbToEnergy(this.vadOptions.noiseGateDb), this.BaselineEnergy * AudioTools.DbToEnergy(this.vadOptions.signalToNoiseDb))
    this.PushFrameHistory(isLoudFrame)

    this.IsSignalDetected = this.DetermineNewSignalState(this.IsSignalDetected)

    this.AdaptBackgroundNoise()

    this.SignalDb = AudioTools.EnergyToDb(this.Energy / this.BaselineEnergy)
    this.NoiseLevelDb = AudioTools.EnergyToDb(this.BaselineEnergy)
  }

  private DetermineNewSignalState(currentState: boolean): boolean {
    this.vadSustainMillisLeft = Math.max(this.vadSustainMillisLeft - this.FrameMillis, 0)

    const loudFrames = this.CountLoudFrames(this.vadOptions.signalSearchFrames)

    const activationFrames = Math.round(this.vadOptions.signalActivation * this.vadOptions.signalSearchFrames)
    const releaseFrames = Math.round(this.vadOptions.signalRelease * this.vadOptions.signalSearchFrames)

    if (loudFrames >= activationFrames) {
      // Renew sustain time
      this.vadSustainMillisLeft = this.vadOptions.signalSustainMillis
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
      if (this.vadOptions.noiseLearnHalftimeMillis > 0) {
        var decay = Math.pow(2.0, -this.FrameMillis / this.vadOptions.noiseLearnHalftimeMillis)
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
