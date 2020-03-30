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
