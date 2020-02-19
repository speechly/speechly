import { IWord, IEntity, IIntent, ISegment } from './types'

export class SegmentState {
  id: number
  contextId: string
  isFinalized: boolean = false
  words: IWord[] = []
  entities: Map<string, IEntity> = new Map<string, IEntity>()
  intent: IIntent = { intent: '', isFinal: false }

  constructor(ctxId: string, sId: number) {
    this.contextId = ctxId
    this.id = sId
  }

  toSegment(): ISegment {
    let i = 0
    const entities: IEntity[] = new Array(this.entities.size)
    for (const v of this.entities.values()) {
      entities[i] = v
      i++
    }

    return {
      id: this.id,
      contextId: this.contextId,
      isFinal: this.isFinalized,
      words: this.words,
      entities: entities,
      intent: this.intent
    }
  }

  updateTranscript(words: IWord[]): SegmentState {
    words.forEach(w => {
      this.words[w.index] = w
    })
    return this
  }

  updateEntities(entities: IEntity[]): SegmentState {
    entities.forEach(e => this.entities.set(entityMapKey(e), e))
    return this
  }

  updateIntent(intent: IIntent): SegmentState {
    this.intent = intent
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

    // Mark as final.
    this.isFinalized = true

    return this
  }
}

function entityMapKey(e: IEntity): string {
  return `${e.startPosition.toString()}:${e.endPosition.toString()}`
}
