import { Word, Entity, Intent } from './types'
import {
  TentativeTranscriptResponse,
  TranscriptResponse,
  TentativeEntitiesResponse,
  EntityResponse,
  IntentResponse
} from '../websocket'

export function parseTentativeTranscript(data: TentativeTranscriptResponse): Word[] {
  // eslint-disable-next-line @typescript-eslint/camelcase
  return data.words.map(({ word, index, start_timestamp, end_timestamp }) => {
    return {
      value: word,
      index: index,
      startTimestamp: start_timestamp,
      endTimestamp: end_timestamp,
      isFinal: false
    }
  })
}

export function parseTranscript(data: TranscriptResponse): Word {
  // eslint-disable-next-line @typescript-eslint/camelcase
  return {
    value: data.word,
    index: data.index,
    startTimestamp: data.start_timestamp,
    endTimestamp: data.end_timestamp,
    isFinal: true
  }
}

export function parseTentativeEntities(data: TentativeEntitiesResponse): Entity[] {
  // eslint-disable-next-line @typescript-eslint/camelcase
  return data.entities.map(({ entity, value, start_position, end_position }) => {
    return {
      type: entity,
      value: value,
      startPosition: start_position,
      endPosition: end_position,
      isFinal: false
    }
  })
}

export function parseEntity(data: EntityResponse): Entity {
  // eslint-disable-next-line @typescript-eslint/camelcase
  return {
    type: data.entity,
    value: data.value,
    startPosition: data.start_position,
    endPosition: data.end_position,
    isFinal: true
  }
}

export function parseIntent(data: IntentResponse, isFinal: boolean): Intent {
  // eslint-disable-next-line @typescript-eslint/camelcase
  return {
    intent: data.intent,
    isFinal: isFinal
  }
}
