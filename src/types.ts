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
