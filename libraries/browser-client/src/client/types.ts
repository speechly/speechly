import { Segment, Word, Entity, Intent } from '../speechly'
import { Storage } from '../storage'
import { CloudDecoder } from './decoder'

/**
 * The options which can be used to configure the client.
 * @public
 */
export interface DecoderOptions {
  /**
   * Connect to Speechly upon creating the client instance. Defaults to true.
   */
  connect?: boolean

  /**
   * The unique identifier of an app in the dashboard.
   */
  appId?: string

  /**
   * The unique identifier of a project in the dashboard.
   */
  projectId?: string

  /**
   * The URL of Speechly SLU API endpoint. Defaults to https://api.speechly.com.
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
   * Whether to output updated segments to the console.
   */
  logSegments?: boolean

  /**
   * Listener for client state changes.
   */
  callbacks?: EventCallbacks

  /**
   * Custom API client implementation.
   * If not provided, an implementation based on Speechly SLU WebSocket API is used.
   */
  decoder?: CloudDecoder

  /**
   * Custom storage implementation.
   * If not provided, browser's LocalStorage API is used.
   */
  storage?: Storage

  /**
   * 
   */
  vad?: VadOptions
}

export interface VadOptions {
}

/**
 * All possible states of a Speechly API client. Failed state is non-recoverable.
 * It is also possible to use arithmetics for state comparison, e.g. `if (state < speechly.ClientState.Disconnected)`,
 * to react to non-recoverable states.
 * @public
 */
export enum DecoderState {
  Failed = 0,
  Disconnected,
  Connected,
  Active,
}

/**
 * All possible callbacks for the decoder.
 * @public
 */
export class EventCallbacks {
  stateChangeCbs: Array<(state: DecoderState) => void> = []
  transcriptCbs: Array<(contextId: string, segmentId: number, word: Word) => void> = []
  entityCbs: Array<(contextId: string, segmentId: number, entity: Entity) => void> = []
  intentCbs: Array<(contextId: string, segmentId: number, intent: Intent) => void> = []

  segmentChangeCbs: Array<(segment: Segment) => void> = []
  tentativeTranscriptCbs: Array<(contextId: string, segmentId: number, words: Word[], text: string) => void> = []
  tentativeEntityCbs: Array<(contextId: string, segmentId: number, entities: Entity[]) => void> = []
  tentativeIntentCbs: Array<(contextId: string, segmentId: number, intent: Intent) => void> = []
  contextStartedCbs: Array<(contextId: string) => void> = []
  contextStoppedCbs: Array<(contextId: string) => void> = []
  onVadStateChange: Array<(active: boolean) => void> = []
}

/**
 * Valid options for a new audioContext. All options are optional.
 * @public
 */
export interface ContextOptions {
  appId?: string
}
