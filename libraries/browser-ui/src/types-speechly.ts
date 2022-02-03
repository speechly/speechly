import type { Behaviour, Effect, Icon } from "./constants"

/**
 * The smallest component of SLU API, defined by an intent.
 * @public
 */
 export interface Segment {
  /**
   * The identifier of parent SLU context.
   */
  contextId: string;
  /**
   * The identifier of the segment within the parent context.
   */
  id: number;
  /**
   * Whether the segment is final. A final segment is guaranteed to only contain final parts.
   */
  isFinal: boolean;
  /**
   * The intent of the segment.
   */
  intent: Intent;
  /**
   * All words which belong to the segment, ordered by their indices.
   */
  words: Word[];
  /**
   * All entities which belong to the segment, not ordered.
   */
  entities: Entity[];
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


export type ITaggedWord = {
  word: string
  serialNumber: number
  entityType: string | null
  isFinal: boolean
  hide: boolean
}

export type IAppearance = {
  icon: Icon,
  behaviour: Behaviour,
  effect: Effect,
}

export type IHoldEvent = {
  timeMs: number;
}
