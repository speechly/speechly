import { ErrorCallback } from '../types'

/**
 * The interface for response returned by WebSocket client.
 * @public
 */
export interface WebsocketResponse {
  /**
   * Response type.
   */
  type: WebsocketResponseType

  /**
   * Audio context ID.
   */
  audio_context: string

  /**
   * Segment ID.
   */
  segment_id: number

  /**
   * Response payload.
   *
   * The payload value should match the response type (i.e. TranscriptResponse should have Transcript type).
   * Not all response types have payloads - Started, Stopped and SegmentEnd don't have payloads.
   * TentativeIntent and Intent share the same payload interface (IntentResponse).
   */
  data: TranscriptResponse | EntityResponse | IntentResponse | TentativeTranscriptResponse | TentativeEntitiesResponse
}

/**
 * Known WebSocket response types.
 * @public
 */
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

/**
 * Transcript response payload.
 * @public
 */
export interface TranscriptResponse {
  /**
   * Transcripted word.
   */
  word: string

  /**
   * The index of the transcripted word in the segment.
   */
  index: number

  /**
   * Start timestamp of the transcript in the audio stream in milliseconds.
   */
  start_timestamp: number

  /**
   * End timestamp of the transcript in the audio stream in milliseconds.
   */
  end_timestamp: number
}

/**
 * Entity response payload.
 * @public
 */
export interface EntityResponse {
  /**
   * Entity type (e.g. restaurant, direction, room, device).
   */
  entity: string

  /**
   * Entity value (e.g. "sushi bar", "northwest", "living room", "kitchen lights").
   */
  value: string

  /**
   * Start position of the entity in the segment. Correlates with TranscriptResponse indices.
   * Inclusive.
   */
  start_position: number

  /**
   * End position of the entity in the segment. Correlates with TranscriptResponse indices.
   * Exclusive.
   */
  end_position: number
}

/**
 * Intent response payload.
 * @public
 */
export interface IntentResponse {
  /**
   * Intent type (e.g. "book", "find", "turn_on").
   */
  intent: string
}

/**
 * Tentative transcript response payload.
 * @public
 */
export interface TentativeTranscriptResponse {
  /**
   * Transcript text, i.e. the full transcript of the audio to-date.
   */
  transcript: string

  /**
   * Individual transcript words.
   */
  words: TranscriptResponse[]
}

/**
 * Tenative entities response payload.
 * @public
 */
export interface TentativeEntitiesResponse {
  /**
   * Individual entities.
   */
  entities: EntityResponse[]
}

/**
 * A callback that is invoked whenever a response is received from Speechly SLU WebSocket API.
 * @public
 */
export type ResponseCallback = (response: WebsocketResponse) => void

/**
 * A callback that is invoked whenever WebSocket connection is closed.
 * @public
 */
export type CloseCallback = (err: Error) => void

/**
 * A callback that receives either an error or a contextId.
 * @public
 */
export type ContextCallback = (error?: Error, contextId?: string) => void

/**
 * The interface for a client for Speechly SLU WebSocket API.
 * @public
 */
export interface APIClient {
  /**
   * Registers a callback that is invoked whenever a response is received from the API.
   *
   * @param cb - this callback to invoke.
   */
  onResponse(cb: ResponseCallback): void

  /**
   * Registers a callback that is invoked whenever WebSocket connection is closed (either normally or due to an error).
   *
   * @param cb - the callback to invoke.
   */
  onClose(cb: CloseCallback): void

  /**
   * Initialises the client.
   *
   * This should prepare websocket to be used (i.e. establish connection to the API).
   * This method will be called by the Client as part of the initialisation process.
   *
   * @param deviceID - device ID to use when connecting to the API.
   * @param cb - the callback to invoke when initialisation is completed (either successfully or with an error).
   */
  initialize(deviceID: string, cb: ErrorCallback): void

  /**
   * Closes the client.
   *
   * This should close the connection and tear down all infrastructure related to it.
   * Calling `initialize` again after calling `close` should be possible.
   *
   * @param closeCode - WebSocket close code to send to the API.
   * @param closeReason - WebSocket close reason to send to the API.
   */
  close(closeCode: number, closeReason: string): Error | void

  /**
   * Starts a new audio context by sending the start event to the API.
   * The callback must be invoked after the API has responded with confirmation or an error has occured.
   *
   * @param cb - the callback to invoke after the starting has finished.
   */
  startContext(cb: ContextCallback): void

  /**
   * Stops an audio context by sending the stop event to the API.
   * The callback must be invoked after the API has responded with confirmation or an error has occured.
   *
   * @param cb - the callback to invoke after the stopping has finished.
   */
  stopContext(cb: ContextCallback): void

  /**
   * Sends audio to the API.
   * If there is no active context (no successful previous calls to `startContext`), this must fail.
   *
   * @param audioChunk - audio chunk to send.
   */
  sendAudio(audioChunk: Int16Array): Error | void
}
