import { Word, Entity, Intent } from '@speechly/browser-client'

export { Word, Entity, Intent, Segment as SpeechSegment } from '@speechly/browser-client'

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
