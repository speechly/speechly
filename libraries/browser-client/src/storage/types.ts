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
 * @internal
 */
export interface Storage {
  /**
   * Retrieves a key from the storage.
   *
   * @param key - the key to retrieve
   */
  get(key: string): string | null

  /**
   * Adds a key to the storage, possibly overwriting existing value.
   *
   * @param key - the key to write
   * @param val - the value to write
   */
  set(key: string, val: string): void

  /**
   * Adds a key to the storage, possibly overwriting existing value.
   *
   * @param key - the key to write
   * @param genFn - generator function that will be invoked if the key cannot be found in the storage.
   * The return value of the function will be used as the value that will be stored under the given key.
   */
  getOrSet(key: string, genFn: () => string): string
}
