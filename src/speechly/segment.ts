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
      intent: this.intent
    }
  }

  updateTranscript(words: Word[]): SegmentState {
    words.forEach(w => {
      this.words[w.index] = w
    })

    return this
  }

  updateEntities(entities: Entity[]): SegmentState {
    entities.forEach(e => this.entities.set(entityMapKey(e), e))
    return this
  }

  updateIntent(intent: Intent): SegmentState {
    if (!this.intent.isFinal) {
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
