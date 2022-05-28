import { Segment, Word, Entity, Intent } from '../speechly'
import { Storage } from '../storage'
import { CloudDecoder } from './decoder'

/**
 * @internal
 */
export interface ResolvedDecoderOptions {
  /**
   * Connect to Speechly upon creating the client instance. Defaults to true.
   */
  connect: boolean

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
  apiUrl: string

  /**
   * The sample rate of the audio to use.
   */
  sampleRate: number

  /**
   * Whether to output debug statements to the console.
   */
  debug: boolean

  /**
   * Whether to output updated segments to the console.
   */
  logSegments: boolean

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
   * Length of audio frame in milliseconds. Audio frame is the audio basic processing unit in VAD and audio history ringbuffer.
   */
  frameMillis: number

  /**
   * Number of history frames to keep in ringbuffer. They are sent upon start of context to capture the start of utterance, which is especially important to compensate loss of utterance start with VAD.
   */
  historyFrames: number
}

/**
 * The options which can be used to configure the client.
 * @public
 */
export interface DecoderOptions extends Partial<ResolvedDecoderOptions> {
  /**
   * Enable voice activity detection (VAD) configuration overrides
   */
  vad?: Partial<VadOptions>
}

export const DecoderDefaultOptions = {
  connect: true,
  apiUrl: 'https://api.speechly.com',
  sampleRate: 16000,
  debug: false,
  logSegments: false,
  frameMillis: 30,
  historyFrames: 5,
}

/**
 * Options for voice activity detection (VAD)
 * @public
 */
export interface VadOptions {
  /**
   * Run energy analysis
   */
  enabled: boolean

  /**
   * Signal-to-noise energy ratio needed for frame to be 'loud'.
   * Default: 3.0 [dB].
   */
  signalToNoiseDb: number

  /**
   * Energy threshold - below this won't trigger activation.
   * Range: -90.0f to 0.0f [dB]. Default: -24 [dB].
   */
  noiseGateDb: number

  /**
   * Rate of background noise learn. Defined as duration in which background noise energy is moved halfway towards current frame's energy.
   * Range: 0, 5000 [ms]. Default: 400 [ms].
   */
  noiseLearnHalftimeMillis: number

  /**
   * Number of past frames analyzed for energy threshold VAD. Should be less or equal than HistoryFrames.
   * Range: 1 to 32 [frames]. Default: 5 [frames].
   */
  signalSearchFrames: number

  /**
   * Minimum 'signal' to 'silent' frame ratio in history to activate 'IsSignalDetected'
   * Range: 0.0 to 1.0. Default: 0.7.
   */
  signalActivation: number

  /**
   * Maximum 'signal' to 'silent' frame ratio in history to inactivate 'IsSignalDetected'. Only evaluated when the sustain period is over.
   * Range: 0.0 to 1.0. Default: 0.2.
   */
  signalRelease: number

  /**
   * Duration to keep 'IsSignalDetected' active. Renewed as long as VADActivation is holds true.
   * Range: 0 to 8000 [ms]. Default: 3000 [ms].
   */
  signalSustainMillis: number

  /**
   * Enable listening control if you want to use IsSignalDetected to control SLU start / stop.
   * Default: true.
   */
  controlListening: boolean

  /**
   * Set audio worker
   * to ‘immediate audio processor’ mode where it can control start/stop context internally at its own pace.
   */
  immediate?: boolean
}

export interface AudioProcessorParameters {
  vad?: Partial<VadOptions>
  immediate?: boolean
}

/**
 * Default options for voice activity detection (VAD)
 * @public
 */
export const VadDefaultOptions: VadOptions = {
  enabled: false,
  controlListening: true,
  signalToNoiseDb: 3.0,
  noiseGateDb: -24.0,
  noiseLearnHalftimeMillis: 400,
  signalSearchFrames: 5,
  signalActivation: 0.7,
  signalRelease: 0.2,
  signalSustainMillis: 3000,
}

export interface StreamOptions {
  preserveSegments: boolean
}

export const StreamDefaultOptions: StreamOptions = {
  preserveSegments: false,
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
 * Array with methods for adding and removing event listener functions
 * @internal
 */
export class ListenerArray<T> extends Array<T> {
  addEventListener(e: T): void {
    this.push(e)
  }

  removeEventListener(e: T): void {
    const index = this.findIndex(cb => cb === e)
    if (index >= 0) {
      this.splice(index, 1)
    }
  }
}

/**
 * All possible callbacks for the decoder.
 * @internal
 */
export class EventCallbacks {
  stateChangeCbs: ListenerArray<(state: DecoderState) => void> = new ListenerArray()
  transcriptCbs: ListenerArray<(contextId: string, segmentId: number, word: Word) => void> = new ListenerArray()
  entityCbs: ListenerArray<(contextId: string, segmentId: number, entity: Entity) => void> = new ListenerArray()
  intentCbs: ListenerArray<(contextId: string, segmentId: number, intent: Intent) => void> = new ListenerArray()

  segmentChangeCbs: ListenerArray<(segment: Segment) => void> = new ListenerArray()
  tentativeTranscriptCbs: ListenerArray<(contextId: string, segmentId: number, words: Word[], text: string) => void> = new ListenerArray()
  tentativeEntityCbs: ListenerArray<(contextId: string, segmentId: number, entities: Entity[]) => void> = new ListenerArray()
  tentativeIntentCbs: ListenerArray<(contextId: string, segmentId: number, intent: Intent) => void> = new ListenerArray()
  contextStartedCbs: ListenerArray<(contextId: string) => void> = new ListenerArray()
  contextStoppedCbs: ListenerArray<(contextId: string) => void> = new ListenerArray()
  onVadStateChange: ListenerArray<(active: boolean) => void> = new ListenerArray()
}

/**
 * Valid options for a new audioContext. All options are optional.
 * @public
 */
export interface ContextOptions {
  appId?: string

  /**
   * Inference time vocabulary.
   */
  vocabulary?: string[]

  /**
   * Inference time vocabulary bias.
   */
  vocabularyBias?: string[]

  /**
   * Inference time silence triggered segmentation.
   */
  silenceTriggeredSegmentation?: string[]

  /**
   * Inference timezone in [TZ database format](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones).
   * e.g. "Africa/Abidjan". Timezone should be wrapped to list, like ["Africa/Abidjan"].
   */
  timezone?: string[]
}
