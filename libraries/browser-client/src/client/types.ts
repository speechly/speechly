import { Segment, Word, Entity, Intent, DefaultSampleRate } from '../speechly'
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
  sampleRate: DefaultSampleRate,
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
   * Run signal detection analysis on incoming audio stream:
   * - Calculate signalDb for current audio frame (pooled from stream)
   * - Determine if frame is loud enough: signalDb `>` {@link noiseGateDb} `>` (noiseLevelDb + {@link signalToNoiseDb})
   * - Maintain history of loud/silent frames.
   * - Set or clear isSignalDetected flag based on ratio of loud/silent frames in last {@link signalSearchFrames}.
   * - Keep isSignalDetected flag set at least for {@link signalSustainMillis}.
   *
   * When false, controlListening won't have effect. Default: false.
   */
  enabled: boolean

  /**
   * Enable VAD to automatically call start/stop based on isSignalDetected state.
   * Default: true.
   */
  controlListening: boolean

  /**
   * Absolute signal energy required.
   * Range: -90.0f to 0.0f [dB]. Default: -24 [dB].
   */
  noiseGateDb: number

  /**
   * Relative signal-to-noise energy required top of learned background noise level.
   * Default: 3.0 [dB].
   */
  signalToNoiseDb: number

  /**
   * Rate of background noise learn. Defined as duration in which background noise energy is adjusted halfway towards current frame's energy.
   * Range: 0, 5000 [ms]. Default: 400 [ms].
   */
  noiseLearnHalftimeMillis: number

  /**
   * Number of past frames analyzed for setting `isSignalDetected` flag. Should be less or equal than {@link DecoderOptions.historyFrames} setting.
   * Range: 1 to 32 [frames]. Default: 5 [frames].
   */
  signalSearchFrames: number

  /**
   * Minimum 'loud' to 'silent' frame ratio in history to set 'isSignalDetected' flag.
   * Range: 0.0 to 1.0. Default: 0.7.
   */
  signalActivation: number

  /**
   * Maximum 'loud' to 'silent' frame ratio in history to clear 'isSignalDetected' flag. Only evaluated when the sustain period is over.
   * Range: 0.0 to 1.0. Default: 0.2.
   */
  signalRelease: number

  /**
   * Minimum duration to keep 'isSignalDetected' flag in set state. This effectively sets the minimum length of the utterance. Setting this to a value below 2000 ms may degrade speech-to-text accuracy.
   * Range: 2000 to 8000 [ms]. Default: 3000 [ms].
   */
  signalSustainMillis: number

  /**
   * Set audio worker to ‘immediate utterance processing’ mode. The worker controls start/stop internally without input from BrowserClient. Internally used with file upload.
   * @internal
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
