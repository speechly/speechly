import { Word, Entity, Intent, Segment } from './types'

export class SegmentState {
  id: number
  contextId: string
  isFinalized: boolean = false
  words: Word[] = []
  entities: Map<string, Entity> = new Map<string, Entity>()
  intent: Intent = { intent: '', isFinal: false }

  constructor(ctxId: string, sId: number) {
    this.contextId = ctxId
    this.id = sId
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
    const words = segment.words.filter((w: Word) => w.value).map((w: Word) => ({ value: w.value, index: w.index }))
    const cleanSegment = { ...segment, ...{ words } }
    return JSON.stringify(cleanSegment, null, 2)
  }

  updateTranscript(words: Word[]): SegmentState {
    words.forEach(w => {
      // Only accept tentative words if the segment is tentative.
      if (!this.isFinalized || w.isFinal) {
        this.words[w.index] = w
      }
    })

    return this
  }

  updateEntities(entities: Entity[]): SegmentState {
    entities.forEach(e => {
      // Only accept tentative entities if the segment is tentative.
      if (!this.isFinalized || e.isFinal) {
        this.entities.set(entityMapKey(e), e)
      }
    })
    return this
  }

  updateIntent(intent: Intent): SegmentState {
    // Only accept tentative intent if the segment is tentative.
    if (!this.isFinalized || intent.isFinal) {
      this.intent = intent
    }

    return this
  }

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
}

function entityMapKey(e: Entity): string {
  return `${e.startPosition.toString()}:${e.endPosition.toString()}`
}
