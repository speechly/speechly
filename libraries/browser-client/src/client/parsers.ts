import {
  TentativeTranscriptResponse,
  TranscriptResponse,
  TentativeEntitiesResponse,
  EntityResponse,
  IntentResponse,
} from '../websocket'
import { Word, Entity, Intent } from '../speechly'

export function parseTentativeTranscript(data: TentativeTranscriptResponse, timeOffset: number): Word[] {
  return data.words.map(({ word, index, start_timestamp, end_timestamp }) => {
    return {
      value: word,
      index: index,
      startTimestamp: start_timestamp + timeOffset,
      endTimestamp: end_timestamp + timeOffset,
      isFinal: false,
    }
  })
}

export function parseTranscript(data: TranscriptResponse, timeOffset: number): Word {
  return {
    value: data.word,
    index: data.index,
    startTimestamp: data.start_timestamp + timeOffset,
    endTimestamp: data.end_timestamp + timeOffset,
    isFinal: true,
  }
}

export function parseTentativeEntities(data: TentativeEntitiesResponse): Entity[] {
  return data.entities.map(({ entity, value, start_position, end_position }) => {
    return {
      type: entity,
      value: value,
      startPosition: start_position,
      endPosition: end_position,
      isFinal: false,
    }
  })
}

export function parseEntity(data: EntityResponse): Entity {
  return {
    type: data.entity,
    value: data.value,
    startPosition: data.start_position,
    endPosition: data.end_position,
    isFinal: true,
  }
}

export function parseIntent(data: IntentResponse, isFinal: boolean): Intent {
  return {
    intent: data.intent,
    isFinal: isFinal,
  }
}
