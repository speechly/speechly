import { SegmentState } from './segment'

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

export class WebsocketError extends Error {
  code: number
  wasClean: boolean

  constructor(reason: string, code: number, wasClean: boolean, ...params: any) {
    // Pass remaining arguments (including vendor specific ones) to parent constructor
    super(...params)

    this.name = `WebsocketError code ${code}`
    this.message = reason
    this.code = code
    this.wasClean = wasClean
  }
}

/**
 * Default sample rate for microphone streams.
 * @public
 */
export const DefaultSampleRate = 16000

/**
 * A structure that accumulates speech recognition (ASR) and natural language understanding (NLU) results.
 * The segment contains exactly one intent, one or more words and zero or more entities depending on the NLU configuration.
 * @public
 */
export interface Segment {
  /**
   * Audio context id for the utterance. Unique for the processed audio chunk between start and stop calls.
   * One utterance may produce one or more segments.
   */
  contextId: string

  /**
   * 0-based segment index within the audio context. Together with {@link contextId} forms an unique identifier for the segment.
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
   * Start timestamp of the word from the start of the audio stream.
   */
  startTimestamp: number

  /**
   * End timestamp of the word from start of the audio stream.
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

/**
 * A structure to accumulate SLU results for one audio context
 * @internal
 */
export interface SLUResults {
  segments: Map<number, SegmentState>
  audioStartTimeMillis: number
}
