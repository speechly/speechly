/**
 * A callback that receives either an error or a contextId.
 * @public
 */
export type ContextCallback = (error?: Error, contextId?: string) => void

/**
 * A callback that receives an optional error.
 * @public
 */
export type ErrorCallback = (error?: Error) => void

/**
 * A callback that receives an ArrayBuffer representing a frame of audio.
 * @public
 */
export type AudioCallback = (audioBuffer: ArrayBuffer) => void

/**
 * A callback that receives either an error or the value retrieved from the storage.
 * @public
 */
export type StorageGetCallback = (error?: Error, val?: string) => void

/**
 * An interface for a microphone.
 * @public
 */
export interface Microphone {
  /**
   * Registers the callback that is invoked whenever an audio chunk is emitted.
   *
   * @param cb - the callback to invoke.
   */
  onAudio(cb: AudioCallback): void

  /**
   * Initialises the microphone.
   *
   * This should prepare the microphone infrastructure for receiving audio chunks,
   * but the microphone should remain muted after the call.
   * This method will be called by the Client as part of client initialisation process.
   *
   * @param cb - the callback that is invoked after initialisation is completed (either successfully or with an error).
   */
  initialize(cb: ErrorCallback): void

  /**
   * Closes the microphone, tearing down all the infrastructure.
   *
   * The microphone should stop emitting audio after this is called.
   * Calling `initialize` again after calling `close` should succeed and make microphone ready to use again.
   * This method will be called by the Client as part of client closure process.
   *
   * @param cb - the callback that should be invoked after the closure process is completed
   * (either successfully or with an error).
   */
  close(cb: ErrorCallback): void

  /**
   * Mutes the microphone. If the microphone is muted, the `onAudio` callbacks should not be called.
   */
  mute(): void

  /**
   * Unmutes the microphone.
   */
  unmute(): void
}

/**
 * An interface for local key-value storage.
 * @public
 */
export interface Storage {
  /**
   * Initialises the storage.
   *
   * Any long-running operation (or operation that can fail), should be done in this method,
   * rather than in a constructor.
   * This method will be called by the Client as part of client initialisation process.
   *
   * @param cb - the callback that is invoked after initialisation is completed (either successfully or with an error).
   */
  initialize(cb: ErrorCallback): void

  /**
   * Closes the storage.
   *
   * Calling `initialize` again after calling `close` should succeed and make storage ready to use again.
   * This method will be called by the Client as part of client closure process.
   *
   * @param cb - the callback that should be invoked after the closure process is completed
   * (either successfully or with an error).
   */
  close(cb: ErrorCallback): void

  /**
   * Retrieves a key from the storage.
   *
   * @param key - the key to retrieve
   * @param cb - the callback that should be invoked after retrieval operation is done,
   * either with the value or with an error.
   */
  get(key: string, cb: StorageGetCallback): void

  /**
   * Adds a key to the storage, possibly overwriting existing value.
   *
   * @param key - the key to write
   * @param val - the value to write
   * @param cb - the callback that should be invoked after retrieval operation is done,
   * either with the value or with an error.
   */
  set(key: string, val: string, cb: ErrorCallback): void
}
