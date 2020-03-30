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
  onAudio(cb: AudioCallback): void
  initialize(cb: ErrorCallback): void
  close(cb: ErrorCallback): void
  mute(): void
  unmute(): void
}

/**
 * An interface for local key-value storage.
 * @public
 */
export interface Storage {
  get(key: string, cb: StorageGetCallback): void
  set(key: string, val: string, cb: ErrorCallback): void
}
