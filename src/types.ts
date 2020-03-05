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
