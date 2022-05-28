import { ErrDeviceNotSupported, DefaultSampleRate } from '../speechly'
import { ErrNoAudioConsent, ErrNotInitialized } from './types'

/**
 * Gets browser based microphone using the window.navigator.mediaDevices interface.
 * The exposed `mediaStream` can be attached to a `BrowserClient` instance.
 * @public
 */
export class BrowserMicrophone {
  private muted: boolean = false
  private initialized: boolean = false

  private readonly nativeResamplingSupported: boolean
  private readonly autoGainControlSupported: boolean

  // The media stream and audio track are initialized during `initialize()` call.
  mediaStream?: MediaStream

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
   * Initializes the microphone. Must to be called directly in an user interaction handler
   * to successfully enable audio capturing. The call will trigger a browser permission prompt on the first time.
   * 
   * This behaviour is imposed by browser security features.
   * 
   */
  async initialize(): Promise<void> {
    if (this.initialized) {
      return
    }

    // ensure mediaDevices are available
    if (window.navigator?.mediaDevices === undefined) {
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
      this.mediaStream = await window.navigator.mediaDevices.getUserMedia(mediaStreamConstraints)
    } catch (err) {
      console.error(err)
      throw ErrNoAudioConsent
    }

    this.initialized = true
    this.muted = true
  }

  /**
   * Closes the microphone, releases all resources and stops the Speechly client.
   */
  async close(): Promise<void> {
    if (!this.initialized) {
      throw ErrNotInitialized
    }

    this.muted = true

    // Stop all media tracks
    const stream = this.mediaStream as MediaStream
    stream.getTracks().forEach(t => t.stop())

    // Unset all audio infrastructure
    this.mediaStream = undefined
    this.initialized = false
  }

  /**
   * @returns true if microphone is open
   */
  public isRecording(): boolean {
    return !this.muted
  }
}
