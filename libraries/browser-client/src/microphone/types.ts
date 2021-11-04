/**
 * Default sample rate for microphone streams.
 * @public
 */
export const DefaultSampleRate = 16000

/**
 * Error to be thrown when the microphone was accessed before it was initialized.
 * @public
 */
export const ErrNotInitialized = new Error('Microphone is not initialized')

/**
 * Error to be thrown when the initialize method of a Microphone instance is called more than once.
 * @public
 */
export const ErrAlreadyInitialized = new Error('Microphone is already initialized')

/**
 * Error to be thrown when the device does not support the Microphone instance's target audio APIs.
 * @public
 */
export const ErrDeviceNotSupported = new Error('Current device does not support microphone API')

/**
 * Error to be thrown when user did not give consent to the application to record audio.
 * @public
 */
export const ErrNoAudioConsent = new Error('Microphone consent is no given')

/**
 * Error to be thrown when user tries to change appId without project login.
 * @public
 */
export const ErrAppIdChangeWithoutProjectLogin = new Error('AppId changed without project login')

/**
 * A callback that receives an ArrayBuffer representing a frame of audio.
 * @public
 */
export type AudioCallback = (audioBuffer: Int16Array) => void

/**
 * The interface for a microphone.
 * @public
 */
export interface Microphone {
  /**
   * Initialises the microphone.
   *
   * This should prepare the microphone infrastructure for receiving audio chunks,
   * but the microphone should remain muted after the call.
   * This method will be called by the Client as part of client initialisation process.
   */
  initialize(audioContext: AudioContext, mediaStreamConstraints: MediaStreamConstraints): Promise<void>

  /**
   * Closes the microphone, tearing down all the infrastructure.
   *
   * The microphone should stop emitting audio after this is called.
   * Calling `initialize` again after calling `close` should succeed and make microphone ready to use again.
   * This method will be called by the Client as part of client closure process.
   */
  close(): Promise<void>

  /**
   * Mutes the microphone. If the microphone is muted, the `onAudio` callbacks should not be called.
   */
  mute(): void

  /**
   * Unmutes the microphone.
   */
  unmute(): void

  /**
   * Print usage stats to console in debug mode.
   */
  printStats(): void
}
