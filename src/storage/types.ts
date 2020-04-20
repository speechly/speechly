import { ErrorCallback } from '../types'

/**
 * Error to be thrown if storage API is not supported by the device.
 * @public
 */
export const ErrNoStorageSupport = new Error('Current device does not support storage API')

/**
 * Error to be thrown if requested key was not found in the storage.
 * @public
 */
export const ErrKeyNotFound = new Error('Requested key was not present in storage')

/**
 * A callback that receives either an error or the value retrieved from the storage.
 * @public
 */
export type StorageGetCallback = (error?: Error, val?: string) => void

/**
 * The interface for local key-value storage.
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
