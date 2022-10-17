import { ErrDeviceNotSupported, DefaultSampleRate } from '../speechly'
import { AudioSourceState, ErrNoAudioConsent } from './types'

/**
 * Gets browser based microphone using the window.navigator.mediaDevices interface.
 * The exposed `mediaStream` can be attached to a `BrowserClient` instance.
 * @public
 */
export class BrowserMicrophone {
  private muted: boolean = false
  private initialized: boolean = false
  private state: AudioSourceState = AudioSourceState.Stopped

  private readonly nativeResamplingSupported: boolean
  private readonly autoGainControlSupported: boolean
  private readonly debug = false

  // The media stream and audio track are initialized during `initialize()` call.
  mediaStream?: MediaStream
  stateChangeCbs: Array<(state: AudioSourceState) => void> = []

  constructor() {
    try {
      const constraints = window.navigator.mediaDevices.getSupportedConstraints()
      this.nativeResamplingSupported = constraints.sampleRate === true
      this.autoGainControlSupported = constraints.autoGainControl === true
    } catch {
      this.nativeResamplingSupported = false
      this.autoGainControlSupported = false
    }
  }

  /**
   * Adds a listener for the state changes of the client.
   * @param cb - the callback to invoke on a client state change.
   */
  onStateChange(cb: (state: AudioSourceState) => void): void {
    this.stateChangeCbs.push(cb)
  }

  /**
   * Initializes the microphone. Needs to happen after a user interaction in the view.
   * The reason for that is that it's required for user to first interact with the page,
   * before it can capture or play audio and video, for privacy and user experience reasons.
   */
  async initialize(): Promise<void> {
    if (this.initialized) {
      return
    }

    // ensure mediaDevices are available
    if (window.navigator?.mediaDevices === undefined) {
      this.setState(AudioSourceState.NoBrowserSupport)
      throw ErrDeviceNotSupported
    }

    const mediaStreamConstraints: MediaStreamConstraints = {
      video: false,
    }

    if (this.nativeResamplingSupported || this.autoGainControlSupported) {
      mediaStreamConstraints.audio = {
        sampleRate: DefaultSampleRate,
        // @ts-ignore
        autoGainControl: this.autoGainControlSupported,
      }
    } else {
      mediaStreamConstraints.audio = true
    }
    try {
      this.setState(AudioSourceState.Starting)
      this.mediaStream = await window.navigator.mediaDevices.getUserMedia(mediaStreamConstraints)
    } catch (err) {
      this.setState(AudioSourceState.NoAudioConsent)
      console.error(err)
      throw ErrNoAudioConsent
    }

    this.initialized = true
    this.muted = true
    this.setState(AudioSourceState.Started)
  }

  setState(newState: AudioSourceState): void {
    if (this.state === newState) {
      return
    }

    if (this.debug) {
      console.log('[BrowserMicrophone]', this.state, '->', newState)
    }

    this.state = newState
    this.stateChangeCbs.forEach(cb => cb(newState))
  }

  /**
   * Closes the microphone, releases all resources and stops the Speechly client.
   */
  async close(): Promise<void> {
    if (!this.initialized) return

    this.muted = true

    // Stop all media tracks
    const stream = this.mediaStream as MediaStream
    stream.getTracks().forEach(t => t.stop())

    // Unset all audio infrastructure
    this.mediaStream = undefined
    this.initialized = false
    this.setState(AudioSourceState.Stopped)
  }

  /**
   * @returns true if microphone is open
   */
  public isRecording(): boolean {
    return !this.muted
  }
}
