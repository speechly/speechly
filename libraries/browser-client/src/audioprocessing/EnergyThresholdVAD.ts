import { VadOptions } from '../client'
import AudioTools from './AudioTools'

/**
 * Adaptive energy threshold voice activity detection (VAD) implementation.
 * It can be used to enable hands-free operation of the SLU decoder.
 *
 * When enough frames with a signal stronger than SignalToNoiseDb have been detected, IsSignalDetected goes true. When enough silent frames have been detected, IsSignalDetected goes false after the sustain time.
 * Use its public fields to configure the static noise gate level, signal-to-noise level, activation/deactivation treshold (ratio of signal to silent frames) and the signal sustain time.
 * The background noise level gradually adapts when no signal is detected.
 *
 * IsSignalDetected can be used to drive SpeechlyClient's StartContext and StopContext automatically by setting ControlListening true.
 * @internal
 */

class EnergyTresholdVAD {
  public isSignalDetected = false
  public signalDb = -90.0
  public noiseLevelDb = -90.0

  public vadOptions: VadOptions
  public readonly frameMillis: number = 30

  private energy = 0.0
  private baselineEnergy = -1.0
  private loudFrameBits = 0
  private vadSustainMillisLeft = 0

  constructor(frameMillis: number, vadOptions: VadOptions) {
    this.frameMillis = frameMillis
    this.vadOptions = vadOptions
  }

  public adjustVadOptions(vadOptions: Partial<VadOptions>): void {
    this.vadOptions = { ...this.vadOptions, ...vadOptions }
  }

  public resetVAD(): void {
    this.isSignalDetected = false
    this.loudFrameBits = 0
    this.energy = 0
    this.baselineEnergy = -1
  }

  public processFrame(floats: Float32Array, start = 0, length = -1, eos: boolean = false): void {
    if (!this.vadOptions.enabled) {
      this.resetVAD()
      return
    }

    if (eos) return

    this.energy = AudioTools.getEnergy(floats, start, length)

    if (this.baselineEnergy < 0) {
      this.baselineEnergy = this.energy
    }

    const isLoudFrame = this.energy > Math.max(AudioTools.dbToEnergy(this.vadOptions.noiseGateDb), this.baselineEnergy * AudioTools.dbToEnergy(this.vadOptions.signalToNoiseDb))
    this.pushFrameHistory(isLoudFrame)

    this.isSignalDetected = this.determineNewSignalState(this.isSignalDetected)

    this.adaptBackgroundNoise()

    this.signalDb = AudioTools.energyToDb(this.energy / this.baselineEnergy)
    this.noiseLevelDb = AudioTools.energyToDb(this.baselineEnergy)
  }

  private determineNewSignalState(currentState: boolean): boolean {
    this.vadSustainMillisLeft = Math.max(this.vadSustainMillisLeft - this.frameMillis, 0)

    const loudFrames = this.countLoudFrames(this.vadOptions.signalSearchFrames)

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

  private adaptBackgroundNoise(): void {
    // Gradually learn background noise level
    if (!this.isSignalDetected) {
      if (this.vadOptions.noiseLearnHalftimeMillis > 0) {
        var decay = Math.pow(2.0, -this.frameMillis / this.vadOptions.noiseLearnHalftimeMillis)
        this.baselineEnergy = (this.baselineEnergy * decay) + (this.energy * (1 - decay))
      }
    }
  }

  private pushFrameHistory(isLoud: boolean): void {
    this.loudFrameBits = (isLoud ? 1 : 0) | (this.loudFrameBits << 1)
  }

  private countLoudFrames(numHistoryFrames: number): number {
    let numActiveFrames = 0
    let t = this.loudFrameBits
    while (numHistoryFrames > 0) {
      if ((t & 1) === 1) numActiveFrames++
      t = t >> 1
      numHistoryFrames--
    }
    return numActiveFrames
  }
}

export default EnergyTresholdVAD
