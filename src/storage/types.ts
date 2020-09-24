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
   */
  initialize(): Promise<void>

  /**
   * Closes the storage.
   *
   * Calling `initialize` again after calling `close` should succeed and make storage ready to use again.
   * This method will be called by the Client as part of client closure process.
   */
  close(): Promise<void>

  /**
   * Retrieves a key from the storage.
   *
   * @param key - the key to retrieve
   */
  get(key: string): Promise<string>

  /**
   * Adds a key to the storage, possibly overwriting existing value.
   *
   * @param key - the key to write
   * @param val - the value to write
   */
  set(key: string, val: string): Promise<void>

  /**
   * Adds a key to the storage, possibly overwriting existing value.
   *
   * @param key - the key to write
   * @param genFn - generator function that will be invoked if the key cannot be found in the storage.
   * The return value of the function will be used as the value that will be stored under the given key.
   */
  getOrSet(key: string, genFn: () => string): Promise<string>
}
