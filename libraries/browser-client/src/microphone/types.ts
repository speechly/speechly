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
 * Error to be thrown when user did not give consent to the application to record audio.
 * @public
 */
export const ErrNoAudioConsent = new Error('Microphone consent is not given')

export enum AudioSourceState {
  NoAudioConsent = 'NoAudioConsent',
  NoBrowserSupport = 'NoBrowserSupport',
  Stopped = 'Stopped',
  Starting = 'Starting',
  Started = 'Started',
}
