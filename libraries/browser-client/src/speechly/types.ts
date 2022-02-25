import { Microphone } from '../microphone'
import { Storage } from '../storage'
import { APIClient } from '../websocket'

/**
 * The options which can be used to configure the client.
 * @public
 */
export interface ClientOptions {
  /**
   * The unique identifier of an app in the dashboard.
   */
  appId?: string

  /**
   * Connect to Speechly upon creating the client instance. Defaults to true.
   */
  connect?: boolean

  /**
   * The unique identifier of a project in the dashboard.
   */
  projectId?: string

  /**
   * @deprecated
   * The language which is used by the app.
   */
  language?: string

  /**
   * The URL of Speechly login endpoint.
   */
  loginUrl?: string

  /**
   * The URL of Speechly SLU API endpoint.
   */
  apiUrl?: string

  /**
   * The sample rate of the audio to use.
   */
  sampleRate?: number

  /**
   * Whether to output debug statements to the console.
   */
  debug?: boolean

  /**
   * Whether to use auto gain control.
   * True by default.
   */
  autoGainControl?: boolean
  /**
   * Whether to output updated segments to the console.
   */
  logSegments?: boolean

  /**
   * Custom microphone implementation.
   * If not provided, an implementation based on getUserMedia and Web Audio API is used.
   */
  microphone?: Microphone

  /**
   * Custom API client implementation.
   * If not provided, an implementation based on Speechly SLU WebSocket API is used.
   */
  apiClient?: APIClient

  /**
   * Custom storage implementation.
   * If not provided, browser's LocalStorage API is used.
   */
  storage?: Storage
}

/**
 * A callback that is invoked whenever the {@link ClientState | client state} changes.
 * @public
 */
export type StateChangeCallback = (state: ClientState) => void

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
 * All possible states of a Speechly API client. Failed, NoBrowserSupport and NoAudioConsent states are non-recoverable
 * erroneous states, which should be handled by the end user, according to the semantics of an application.
 * Other states can also be utilized for e.g. enabling and disabling recording buttons or showing the status in the app.
 * It is also possible to use arithmetics for state comparison, e.g. `if (state < speechly.ClientState.Disconnected)`,
 * to react to non-recoverable states.
 * @public
 */
export enum ClientState {
  Failed = 0,
  NoBrowserSupport,
  NoAudioConsent,
  __UnrecoverableErrors,
  Disconnected,
  Disconnecting,
  Connecting,
  Preinitialized,
  Initializing,
  Connected,
  Stopping,
  Starting,
  Recording,
}

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
