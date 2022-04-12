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

/**
 * A callback that is invoked whenever current {@link Segment | segment} changes.
 * @public
 */
export type SegmentChangeCallback = (segment: Segment) => void

/**
 * A callback that is invoked whenever a new tentative transcript is received from the API.
 * @public
 */
export type TentativeTranscriptCallback = (contextId: string, segmentId: number, words: Word[], text: string) => void

/**
 * A callback that is invoked whenever a new transcript is received from the API.
 * @public
 */
export type TranscriptCallback = (contextId: string, segmentId: number, word: Word) => void

/**
 * A callback that is invoked whenever new tentative entities are received from the API.
 * @public
 */
export type TentativeEntitiesCallback = (contextId: string, segmentId: number, entities: Entity[]) => void

/**
 * A callback that is invoked whenever new entity is received from the API.
 * @public
 */
export type EntityCallback = (contextId: string, segmentId: number, entity: Entity) => void

/**
 * A callback that is invoked whenever new intent (tentative or not) is received from the API.
 * @public
 */
export type IntentCallback = (contextId: string, segmentId: number, intent: Intent) => void

/**
 * Delegate will handle all events received from the Client.
 * @public
 */
export abstract class EventSource {
  // private stateChangeCb?: StateChangeCallback
  private segmentChangeCb: SegmentChangeCallback = () => {}
  private tentativeTranscriptCb: TentativeTranscriptCallback = () => {}
  private tentativeEntitiesCb: TentativeEntitiesCallback = () => {}
  private tentativeIntentCb: IntentCallback = () => {}
  private transcriptCb: TranscriptCallback = () => {}
  private entityCb: EntityCallback = () => {}
  private intentCb: IntentCallback = () => {}

  /**
   * Adds a listener for current segment change events.
   * @param cb - the callback to invoke on segment change events.
   */
  onSegmentChange(cb: SegmentChangeCallback): void {
    this.segmentChangeCb = cb
  }

  emitSegmentChange(segment: Segment): void {
    this.segmentChangeCb(segment)
  }

  /**
   * Adds a listener for tentative transcript responses from the API.
   * @param cb - the callback to invoke on a tentative transcript response.
   */
  onTentativeTranscript(cb: TentativeTranscriptCallback): void {
    this.tentativeTranscriptCb = cb
  }

  emitTentativeTranscript(contextId: string, segmentId: number, words: Word[], text: string): void {
    this.tentativeTranscriptCb(contextId, segmentId, words, text)
  }

  /**
   * Adds a listener for transcript responses from the API.
   * @param cb - the callback to invoke on a transcript response.
   */
  onTranscript(cb: TranscriptCallback): void {
    this.transcriptCb = cb
  }

  emitTranscript(contextId: string, segmentId: number, word: Word): void {
    this.transcriptCb(contextId, segmentId, word)
  }

  /**
   * Adds a listener for tentative entities responses from the API.
   * @param cb - the callback to invoke on a tentative entities response.
   */
  onTentativeEntities(cb: TentativeEntitiesCallback): void {
    this.tentativeEntitiesCb = cb
  }

  emitTentativeEntities(contextId: string, segmentId: number, entities: Entity[]): void {
    this.emitTentativeEntities(contextId, segmentId, entities)
  }

  /**
   * Adds a listener for entity responses from the API.
   * @param cb - the callback to invoke on an entity response.
   */
  onEntity(cb: EntityCallback): void {
    this.entityCb = cb
  }

  emitEntity(contextId: string, segmentId: number, entity: Entity): void {
    this.entityCb(contextId, segmentId, entity)
  }

  /**
   * Adds a listener for tentative intent responses from the API.
   * @param cb - the callback to invoke on a tentative intent response.
   */
  onTentativeIntent(cb: IntentCallback): void {
    this.tentativeIntentCb = cb
  }

  emitTentativeIntent(contextId: string, segmentId: number, intent: Intent): void {
    this.tentativeIntentCb(contextId, segmentId, intent)
  }

  /**
   * Adds a listener for intent responses from the API.
   * @param cb - the callback to invoke on an intent response.
   */
  onIntent(cb: IntentCallback): void {
    this.intentCb = cb
  }

  emitIntent(contextId: string, segmentId: number, intent: Intent): void {
    this.intentCb(contextId, segmentId, intent)
  }
}
