import { Word, Entity, Intent } from '@speechly/browser-client'

export { Word, Entity, Intent, Segment as SpeechSegment } from '@speechly/browser-client'
/**
 * The state of SpeechContext.
 * @public
 */
export enum SpeechState {
  /**
   * The context is in a state of unrecoverable error.
   * It is only possible to fix this by destroying and creating it from scratch.
   */
  Failed = 'Failed',

  /**
   * Current browser is not supported by Speechly - it's not possible to use speech functionality.
   */
  NoBrowserSupport = 'NoBrowserSupport',

  /**
   * The user did not provide permissions to use the microphone - it is not possible to use speech functionality.
   */
  NoAudioConsent = 'NoAudioConsent',

  /**
   * The context has been created but not initialised. The audio and API connection are not enabled.
   */
  Idle = 'Idle',

  /**
   * The context is connecting to the API.
   */
  Connecting = 'Connecting',

  /**
   * The context is ready to use.
   */
  Ready = 'Ready',

  /**
   * The context is current recording audio and sending it to the API for recognition.
   * The results are also being fetched.
   */
  Recording = 'Recording',

  /**
   * The context is waiting for the API to finish sending trailing responses.
   * No audio is being sent anymore.
   */
  Loading = 'Loading',
}

/**
 * Wraps the tentative transcript response from the API.
 * @public
 */
export type TentativeSpeechTranscript = {
  contextId: string
  segmentId: number
  words: Word[]
  text: string
}

/**
 * Wraps the final transcript response from the API.
 * @public
 */
export type SpeechTranscript = {
  contextId: string
  segmentId: number
  word: Word
}

/**
 * Wraps the tentative entities response from the API.
 * @public
 */
export type TentativeSpeechEntities = {
  contextId: string
  segmentId: number
  entities: Entity[]
}

/**
 * Wraps the final entity response from the API.
 * @public
 */
export type SpeechEntity = {
  contextId: string
  segmentId: number
  entity: Entity
}

/**
 * Wraps the tentative intent response from the API.
 * @public
 */
export type TentativeSpeechIntent = {
  contextId: string
  segmentId: number
  intent: Intent
}

/**
 * Wraps the final intent response from the API.
 * @public
 */
export type SpeechIntent = {
  contextId: string
  segmentId: number
  intent: Intent
}
