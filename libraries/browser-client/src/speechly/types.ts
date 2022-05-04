/**
 * Error to be thrown when the device does not support audioContext.
 * @public
 */
export const ErrDeviceNotSupported = new Error('Current device does not support microphone API')

/**
 * Error to be thrown when user tries to change appId without project login.
 * @public
 */
export const ErrAppIdChangeWithoutProjectLogin = new Error('AppId changed without project login')

/**
 * Default sample rate for microphone streams.
 * @public
 */
export const DefaultSampleRate = 16000

/**
 * The smallest component of SLU API, defined by an intent.
 * @public
 */
export interface Segment {
  /**
   * The identifier of parent SLU context.
   */
  contextId: string

  /**
   * The identifier of the segment within the parent context.
   */
  id: number

  /**
   * Whether the segment is final. A final segment is guaranteed to only contain final parts.
   */
  isFinal: boolean

  /**
   * The intent of the segment.
   */
  intent: Intent

  /**
   * All words which belong to the segment, ordered by their indices.
   */
  words: Word[]

  /**
   * All entities which belong to the segment, not ordered.
   */
  entities: Entity[]
}

/**
 * The intent detected by the SLU API.
 * @public
 */
export interface Intent {
  /**
   * The value of the intent.
   */
  intent: string

  /**
   * Whether the intent was detected as final.
   */
  isFinal: boolean
}

/**
 * A single word detected by the SLU API.
 * @public
 */
export interface Word {
  /**
   * The value of the word.
   */
  value: string

  /**
   * The index of the word within a segment.
   */
  index: number

  /**
   * Start timestamp of the word within the audio of the context.
   */
  startTimestamp: number

  /**
   * End timestamp of the word within the audio of the context.
   */
  endTimestamp: number

  /**
   * Whether the word was detected as final.
   */
  isFinal: boolean
}

/**
 * A single entity detected by the SLU API.
 * @public
 */
export interface Entity {
  /**
   * The type specified by the developer in the NLU rules in the dashboard (e.g. restaurant_type).
   */
  type: string

  /**
   * The value of the entity (e.g. Papa Joe's).
   */
  value: string

  /**
   * The index of the first word that contains this entity.
   */
  startPosition: number

  /**
   * The index of the last word that contains this entity.
   */
  endPosition: number

  /**
   * Whether the entity was detected as final.
   */
  isFinal: boolean
}
