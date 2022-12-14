import { AudioProcessorParameters, ContextOptions, StreamOptions, VadOptions } from '../client'
import { WebsocketError } from '../speechly'

/**
 * The interface for response returned by WebSocket client.
 * @internal
 */
export interface WebsocketResponse {
  /**
   * Response type.
   */
  type: WebsocketResponseType | WorkerSignal

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

  /**
   * Optional client-side metadata associated to the response.
   * The payload value, if present, should match the response type.
   */
  params?: StartContextParams
}

/**
 * Known WebSocket response types.
 * @internal
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
  TentativeIntent = 'tentative_intent',
}

/**
 * Messages from worker to controller
 * @internal
 */
export enum WorkerSignal {
  Opened = 'WEBSOCKET_OPEN',
  Closed = 'WEBSOCKET_CLOSED',
  AudioProcessorReady = 'SOURCE_SAMPLE_RATE_SET_SUCCESS',
  VadSignalHigh = 'VadSignalHigh',
  VadSignalLow = 'VadSignalLow',
  RequestContextStart = 'RequestContextStart',
}

/**
 * Messages from controller to worker
 * @internal
 */
export enum ControllerSignal {
  connect = 'connect',
  initAudioProcessor = 'initAudioProcessor',
  adjustAudioProcessor = 'adjustAudioProcessor',
  SET_SHARED_ARRAY_BUFFERS = 'SET_SHARED_ARRAY_BUFFERS',
  CLOSE = 'CLOSE',
  START_CONTEXT = 'START_CONTEXT',
  SWITCH_CONTEXT = 'SWITCH_CONTEXT',
  STOP_CONTEXT = 'STOP_CONTEXT',
  AUDIO = 'AUDIO',
  startStream = 'startStream',
  stopStream = 'stopStream',
  setContextOptions = 'setContextOptions',
}

export interface StartContextParams {
  audioStartTimeMillis: number
}

/**
 * Transcript response payload.
 * @internal
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
 * @internal
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
 * @internal
 */
export interface IntentResponse {
  /**
   * Intent type (e.g. "book", "find", "turn_on").
   */
  intent: string
}

/**
 * Tentative transcript response payload.
 * @internal
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
 * Tentative entities response payload.
 * @internal
 */
export interface TentativeEntitiesResponse {
  /**
   * Individual entities.
   */
  entities: EntityResponse[]
}

/**
 * A callback that is invoked whenever a response is received from Speechly SLU WebSocket API.
 * @internal
 */
export type ResponseCallback = (response: WebsocketResponse) => void

/**
 * A callback that is invoked whenever WebSocket connection is closed.
 * @internal
 */
// eslint-disable-next-line @typescript-eslint/member-delimiter-style
export type CloseCallback = (err: WebsocketError) => void

/**
 * The interface for a client for Speechly SLU WebSocket API.
 * @internal
 */

/**
 * @internal
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
   * This method will be called by the Client as part of the initialisation process.
   *
   * @param apiUrl - url.
   * @param authToken - authentication token.
   * @param targetSampleRate - target sample rate of audio.
   * @param debug - debug flag.
   */
  initialize(apiUrl: string, authToken: string, targetSampleRate: number, debug: boolean): Promise<void>

  /**
   * Initialises the client.
   *
   * This should prepare websocket to be used (set source sample rate).
   * This method will be called by the Client as part of the initialisation process.
   *
   * @param sourceSampleRate - sample rate of audio source.
   * @param frameMillis - milliseconds per audio frame. Default 30 [ms].
   * @param historyFrames - number of history audio frames. Default 5 [frames].
   */
  initAudioProcessor(sourceSampleRate: number, frameMillis: number, historyFrames: number, vadOptions?: VadOptions): Promise<void>

  /**
   * Control audio processor parameters
   * @param ap - Audio processor parameters to adjust
   */
  adjustAudioProcessor(ap: AudioProcessorParameters): void

  /**
   * Closes the client.
   *
   * This should close the connection and tear down all infrastructure related to it.
   * Calling `initialize` again after calling `close` should be possible.
   */
  close(): Promise<void>

  /**
   * Starts a new audio context by sending the start event to the API.
   * The promise returned should resolve or reject after the API has responded with confirmation or an error has occured.
   */
  startContext(options?: ContextOptions): Promise<string>

  /**
   * Stops an audio context by sending the stop event to the API.
   * The promise returned should resolve or reject after the API has responded with confirmation or an error has occured.
   */
  stopContext(): Promise<string>

  /**
   * Stops current context and immediately starts a new SLU context
   * by sending a start context event to the API and unmuting the microphone.
   */
  switchContext(options: ContextOptions): Promise<string>

  /**
   * Sends audio to the API.
   * If there is no active context (no successful previous calls to `startContext`), this must fail.
   *
   * @param audioChunk - audio chunk to send.
   */
  sendAudio(audioChunk: Float32Array): void

  /**
   * Sends message to the Worker.
   *
   * @param message - message to send.
   */
  postMessage(message: Object): void

  startStream(streamOptions: StreamOptions): Promise<void>

  stopStream(): Promise<void>

  /**
   * Sets the default context options (appId, inference parameters, timezone). New audio contexts
   * use these options until new options are provided. Decoder's functions startContext() can
   * also override the options per function call.
   */
  setContextOptions(options: ContextOptions): Promise<void>
}
