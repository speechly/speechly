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
