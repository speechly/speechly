import { ErrorCallback, ContextCallback } from '../types'

export interface WebsocketClient {
  initialize(deviceID: string, cb: ErrorCallback): void
  close(closeCode: number, closeReason: string): Error | void

  start(cb: ContextCallback): void
  stop(cb: ContextCallback): void
  send(data: ArrayBuffer): Error | void

  onResponse(cb: ResponseCallback): void
  onClose(cb: CloseCallback): void
}

export type ResponseCallback = (response: WebsocketResponse) => void
export type CloseCallback = (err: Error) => void

export enum WebsocketResponseType {
  Started = 'started',
  Stopped = 'stopped',
  SegmentEnd = 'segment_end',
  Transcript = 'transcript',
  Entity = 'entity',
  Intent = 'intent',
  TentativeTranscript = 'tentative_transcript',
  TentativeEntities = 'tentative_entities',
  TentativeIntent = 'tentative_intent'
}

export interface WebsocketResponse {
  type: WebsocketResponseType
  audio_context: string
  segment_id: number
  data: TentativeTranscriptResponse | TranscriptResponse | TentativeEntitiesResponse | EntityResponse | IntentResponse
}

export interface TentativeTranscriptResponse {
  transcript: string
  words: TranscriptResponse[]
}

export interface TranscriptResponse {
  word: string
  index: number
  start_timestamp: number
  end_timestamp: number
}

export interface TentativeEntitiesResponse {
  entities: EntityResponse[]
}

export interface EntityResponse {
  entity: string
  value: string
  start_position: number
  end_position: number
}

export interface IntentResponse {
  intent: string
}
