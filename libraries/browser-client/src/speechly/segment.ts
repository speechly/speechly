import { Word, Entity, Intent, Segment } from './types'

/**
 * A high level API for automatic speech recognition (ASR) and natural language understanding (NLU) results. Results will accumulate in Segment for the duration of the an utterance.
 * @internal
 */
export class SegmentState {
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
   * True when the segment will not be changed any more
   */
  isFinalized: boolean = false

  /**
   * Detected words in the segment
   */
  words: Word[] = []

  /**
   * Detected entities in the segment
   */
  entities: Map<string, Entity> = new Map<string, Entity>()

  /**
   * Detected intent for the segment
   */
  intent: Intent = { intent: '', isFinal: false }

  /**
   * @param contextId - Audio context id
   * @param segmentIndex - 0-based segment index within the audio context
   * @internal
   */
  constructor(contextId: string, segmentIndex: number) {
    this.contextId = contextId
    this.id = segmentIndex
  }

  toSegment(): Segment {
    let i = 0
    const entities: Entity[] = new Array(this.entities.size)
    this.entities.forEach(v => {
      entities[i] = v
      i++
    })

    return {
      id: this.id,
      contextId: this.contextId,
      isFinal: this.isFinalized,
      words: this.words,
      entities: entities,
      intent: this.intent,
    }
  }

  toString(): string {
    const segment: Segment = this.toSegment()
    const words = segment.words.filter((w: Word) => w.value)
    const cleanSegment = { ...segment, ...{ words } }
    return JSON.stringify(cleanSegment, null, 2)
  }

  /**
   * @param words - changed words
   * @returns updated SegmentState
   * @internal
   */
  updateTranscript(words: Word[]): SegmentState {
    words.forEach(w => {
      // Only accept tentative words if the segment is tentative.
      if (!this.isFinalized || w.isFinal) {
        this.words[w.index] = w
      }
    })

    return this
  }

  /**
   * @param entities - changed entities
   * @returns updated SegmentState
   * @internal
   */
  updateEntities(entities: Entity[]): SegmentState {
    entities.forEach(e => {
      // Only accept tentative entities if the segment is tentative.
      if (!this.isFinalized || e.isFinal) {
        this.entities.set(this.entityMapKey(e), e)
      }
    })
    return this
  }

  /**
   * @param intent - changed intent
   * @returns updated SegmentState
   * @internal
   */
  updateIntent(intent: Intent): SegmentState {
    // Only accept tentative intent if the segment is tentative.
    if (!this.isFinalized || intent.isFinal) {
      this.intent = intent
    }

    return this
  }

  /**
   * @returns SegmentState with final flags set
   * @internal
   */
  finalize(): SegmentState {
    // Filter away any entities which were not finalized.
    this.entities.forEach((val, key) => {
      if (!val.isFinal) {
        this.entities.delete(key)
      }
    })

    // Filter away any transcripts which were not finalized.
    this.words = this.words.filter(w => w.isFinal)

    if (!this.intent.isFinal) {
      this.intent.intent = ''
      this.intent.isFinal = true
    }

    // Mark as final.
    this.isFinalized = true

    return this
  }

  private entityMapKey(e: Entity): string {
    return `${e.startPosition.toString()}:${e.endPosition.toString()}`
  }
}
