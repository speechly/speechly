import { v4 as uuidv4 } from 'uuid'

import { validateToken, fetchToken } from '../websocket/token'

import { SegmentState, ErrAppIdChangeWithoutProjectLogin, Segment, SLUResults, WebsocketError } from '../speechly'

import {
  APIClient,
  WebWorkerController,
  WebsocketResponse,
  WebsocketResponseType,
  TentativeTranscriptResponse,
  TranscriptResponse,
  TentativeEntitiesResponse,
  EntityResponse,
  IntentResponse,
  WorkerSignal,
} from '../websocket'

import { Storage, LocalStorage } from '../storage'

import { DecoderState, EventCallbacks, ContextOptions, VadOptions, AudioProcessorParameters, StreamOptions, StreamDefaultOptions, ResolvedDecoderOptions } from './types'
import { stateToString } from './state'

import { parseTentativeTranscript, parseIntent, parseTranscript, parseTentativeEntities, parseEntity } from './parsers'

const deviceIdStorageKey = 'speechly-device-id'
const authTokenKey = 'speechly-auth-token'

/**
 * A client for Speechly Spoken Language Understanding (SLU) API. The client handles initializing the websocket
 * connection to Speechly API, sending control events and audio stream. It reads and dispatches the responses
 * through a high-level API for interacting with so-called speech segments.
 * @internal
 */
export class CloudDecoder {
  private readonly debug: boolean
  private readonly logSegments: boolean
  private readonly projectId?: string
  private readonly appId?: string
  private readonly storage?: Storage
  private readonly apiClient: APIClient
  private readonly loginUrl: string
  private readonly deviceId: string
  private readonly apiUrl: string
  streamOptions: StreamOptions = StreamDefaultOptions
  private resolveStopStream?: any

  private activeContexts = 0

  private readonly audioContexts = new Map<string, SLUResults>()
  private readonly maxReconnectAttemptCount = 10

  private connectAttempt: number = 0
  private connectPromise: Promise<void> | null = null

  private authToken?: string
  private readonly cbs: EventCallbacks[] = []

  sampleRate: number
  state: DecoderState = DecoderState.Disconnected

  constructor(options: ResolvedDecoderOptions) {
    this.logSegments = options.logSegments

    this.appId = options.appId
    this.projectId = options.projectId
    this.sampleRate = options.sampleRate
    this.debug = options.debug

    if (this.appId !== undefined && this.projectId !== undefined) {
      throw Error('[Decoder] You cannot use both appId and projectId at the same time')
    } else if (this.appId === undefined && this.projectId === undefined) {
      throw Error('[Decoder] Either an appId or a projectId is required')
    }

    const apiUrl = options.apiUrl
    this.apiUrl = generateWsUrl(apiUrl.replace('http', 'ws') + '/ws/v1', this.sampleRate)
    this.loginUrl = `${apiUrl}/login`

    // Attempt to access local storage for caching settings. Do without if it's blocked by security settings
    try {
      this.storage = options.storage ?? new LocalStorage()
      this.deviceId = this.storage.getOrSet(deviceIdStorageKey, uuidv4)
    } catch (err) {
      this.deviceId = uuidv4()
    }

    this.apiClient = new WebWorkerController()
    this.apiClient.onResponse(this.handleWebsocketResponse)
    this.apiClient.onClose(this.handleWebsocketClosure)

    if (options.connect ?? true) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      this.connect()
    }
  }

  private getReconnectDelayMs(attempt: number): number {
    return 2 ** attempt * 100
  }

  private async sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  /**
   * Connect to Speechly backend.
   * This function will be called by initialize if not manually called earlier.
   * Calling connect() immediately after constructor and setting callbacks allows
   * prewarming the connection, resulting in less noticeable waits for the user.
   */
  async connect(): Promise<void> {
    if (this.connectPromise === null) {
      this.connectPromise = (async () => {
        this.setState(DecoderState.Disconnected)
        // Get auth token from cache or renew it
        const storedToken = this.storage?.get(authTokenKey)
        if (!storedToken || !validateToken(storedToken, this.projectId, this.appId, this.deviceId)) {
          try {
            this.authToken = await fetchToken(this.loginUrl, this.projectId, this.appId, this.deviceId, fetch)
            // Cache the auth token in local storage for future use.
            if (this.storage) {
              this.storage.set(authTokenKey, this.authToken)
            }
          } catch (err) {
            this.connectPromise = null
            this.setState(DecoderState.Failed)
            throw err
          }
        } else {
          this.authToken = storedToken
        }

        // Establish websocket connection
        try {
          await this.apiClient.initialize(this.apiUrl, this.authToken, this.sampleRate, this.debug)
        } catch (err) {
          this.connectPromise = null
          if (!(err instanceof WebsocketError && err.code === 1000)) {
            this.setState(DecoderState.Failed)
          }
          throw err
        }
        this.advanceState(DecoderState.Connected)
      })()
    }
    await this.connectPromise
  }

  /**
   * Control audio processor parameters
   * @param ap - Audio processor parameters to adjust
   */
  adjustAudioProcessor(ap: AudioProcessorParameters): void {
    this.apiClient.adjustAudioProcessor(ap)
  }

  /**
   * Closes the client by closing the API connection.
   */
  async close(): Promise<void> {
    let error: string | undefined

    try {
      await this.apiClient.close()
    } catch (err) {
      // @ts-ignore
      error = err.message
    }

    this.audioContexts.clear()
    this.activeContexts = 0
    this.connectPromise = null
    this.setState(DecoderState.Disconnected)

    if (error !== undefined) {
      throw Error(error)
    }
  }

  async startStream(streamOptions: StreamOptions): Promise<void> {
    if (this.debug) {
      console.log('[Decoder]', 'startStream')
    }

    this.streamOptions = streamOptions
    this.audioContexts.clear()
    this.activeContexts = 0

    await this.apiClient.startStream(streamOptions)
  }

  async stopStream(): Promise<void> {
    if (this.debug) {
      console.log('[Decoder]', 'stopStream')
    }

    await this.apiClient.stopStream()

    await this.waitResults()
  }

  private async waitResults(): Promise<void> {
    // Wait for active contexts to finish
    if (this.activeContexts > 0) {
      const p = new Promise(resolve => {
        this.resolveStopStream = resolve
      })
      await p
    }
    this.resolveStopStream = undefined
  }

  /**
   * Starts a new SLU context by sending a start context event to the API.
   */
  async startContext(options?: ContextOptions): Promise<string> {
    if (this.state === DecoderState.Failed) {
      throw Error('[Decoder] startContext cannot be run in Failed state.')
    } else if (this.state < DecoderState.Connected) {
      await this.connect()
    } else if (this.state > DecoderState.Connected) {
      throw Error(
        '[Decoder] Unable to complete startContext: Expected Connected state, but was in ' +
          stateToString(this.state) +
          '.',
      )
    }

    this.setState(DecoderState.Active)
    let contextId: string
    if (this.projectId != null) {
      if (options?.appId) {
        contextId = await this.apiClient.startContext(options)
      } else {
        throw new Error('options.appId is required with project login')
      }
    } else {
      if (options?.appId != null && this.appId !== options?.appId) {
        this.setState(DecoderState.Failed)
        throw ErrAppIdChangeWithoutProjectLogin
      }
      contextId = await this.apiClient.startContext(options)
    }

    // Ensure state has not been changed by await apiClient.startContext() due to websocket errors.
    // Due to apiClient.startContext implementation, they don't throw an error here, but call handleWebsocketClosure instead which changes to DecoderState.Disconnected
    if (this.state < DecoderState.Active) {
      throw Error('[Decoder] Unable to complete startContext: Problem acquiring contextId')
    }

    return contextId
  }

  /**
   * Send audio array.
   */
  sendAudio(audio: Float32Array): void {
    this.apiClient.sendAudio(audio)
  }

  /**
   * Stops current SLU context by sending a stop context event to the API and muting the microphone
   * delayed by contextStopDelay = 250 ms
   */
  async stopContext(stopDelayMs: number): Promise<string> {
    if (this.state === DecoderState.Failed) {
      throw Error('[Decoder] stopContext cannot be run in unrecovable error state.')
    } else if (this.state !== DecoderState.Active) {
      throw Error(
        '[Decoder] Unable to complete stopContext: Expected Active state, but was in ' +
          stateToString(this.state) +
          '.',
      )
    }
    if (stopDelayMs > 0) {
      await this.sleep(stopDelayMs)
    }
    const contextId = await this.apiClient.stopContext()
    this.setState(DecoderState.Connected)
    return contextId
  }

  /**
   * Stops current context and immediately starts a new SLU context
   * by sending a start context event to the API and unmuting the microphone.
   * @param options - any custom options for the audio processing.
   */
  async switchContext(options: ContextOptions): Promise<string> {
    if (this.state !== DecoderState.Active) {
      throw Error(
        '[Decoder] Unable to complete switchContext: Expected Active state, but was in ' +
          stateToString(this.state) +
          '.',
      )
    }
    const contextId = await this.apiClient.switchContext(options)
    return contextId
  }

  registerListener(listener: EventCallbacks): void {
    this.cbs.push(listener)
  }

  async initAudioProcessor(sourceSampleRate: number, frameMillis: number, historyFrames: number, vadOptions?: VadOptions): Promise<void> {
    await this.apiClient.initAudioProcessor(sourceSampleRate, frameMillis, historyFrames, vadOptions)
  }

  useSharedArrayBuffers(controlSAB: any, dataSAB: any): void {
    this.apiClient.postMessage({
      type: 'SET_SHARED_ARRAY_BUFFERS',
      controlSAB,
      dataSAB,
    })
  }

  async setContextOptions(options: ContextOptions): Promise<void> {
    await this.apiClient.setContextOptions(options)
  }

  private readonly handleWebsocketResponse = (response: WebsocketResponse): void => {
    if (this.debug) {
      console.log('[Decoder]', 'Received response', response)
    }

    switch (response.type) {
      case WorkerSignal.VadSignalHigh:
        this.cbs.forEach(cb => cb.onVadStateChange.forEach(f => f(true)))
        break
      case WorkerSignal.VadSignalLow:
        this.cbs.forEach(cb => cb.onVadStateChange.forEach(f => f(false)))
        break
      case WorkerSignal.RequestContextStart:
        this.activeContexts++
        break
      case WebsocketResponseType.Started: {
        const params = response.params
        this.audioContexts.set(response.audio_context, {
          segments: new Map(),
          audioStartTimeMillis: params?.audioStartTimeMillis ?? 0,
        })
        this.cbs.forEach(cb => cb.contextStartedCbs.forEach(f => f(response.audio_context)))
        break
      }
      case WebsocketResponseType.Stopped: {
        this.activeContexts--
        this.cbs.forEach(cb => cb.contextStoppedCbs.forEach(f => f(response.audio_context)))
        if (!this.streamOptions.preserveSegments) {
          this.audioContexts.delete(response.audio_context)
        }

        // Signal stopStream listeners that the final results are in, it's ok to resolve the await
        if (this.resolveStopStream !== undefined && this.activeContexts === 0) {
          this.resolveStopStream()
        }
        break
      }
      default:
        this.handleSegmentUpdate(response)
        break
    }
  }

  private readonly handleSegmentUpdate = (response: WebsocketResponse): void => {
    const { audio_context, segment_id, type } = response
    let { data } = response

    const context = this.audioContexts.get(audio_context)
    if (context === undefined) {
      console.warn('[Decoder]', 'Received response for non-existent context', audio_context)
      return
    }

    let segmentState = context.segments.get(segment_id) ?? new SegmentState(audio_context, segment_id)

    switch (type) {
      case WebsocketResponseType.TentativeTranscript:
        data = data as TentativeTranscriptResponse
        const words = parseTentativeTranscript(data, context.audioStartTimeMillis)
        const transcript = data.transcript
        this.cbs.forEach(cb => cb.tentativeTranscriptCbs.forEach(f => f(audio_context, segment_id, words, transcript)))
        segmentState = segmentState.updateTranscript(words)
        break
      case WebsocketResponseType.Transcript:
        data = data as TranscriptResponse
        const word = parseTranscript(data, context.audioStartTimeMillis)
        this.cbs.forEach(cb => cb.transcriptCbs.forEach(f => f(audio_context, segment_id, word)))
        segmentState = segmentState.updateTranscript([word])
        break
      case WebsocketResponseType.TentativeEntities:
        data = data as TentativeEntitiesResponse
        const entities = parseTentativeEntities(data)
        this.cbs.forEach(cb => cb.tentativeEntityCbs.forEach(f => f(audio_context, segment_id, entities)))
        segmentState = segmentState.updateEntities(entities)
        break
      case WebsocketResponseType.Entity:
        data = data as EntityResponse
        const entity = parseEntity(data)
        this.cbs.forEach(cb => cb.entityCbs.forEach(f => f(audio_context, segment_id, entity)))
        segmentState = segmentState.updateEntities([entity])
        break
      case WebsocketResponseType.TentativeIntent:
        data = data as IntentResponse
        const tentativeIntent = parseIntent(data, false)
        this.cbs.forEach(cb => cb.tentativeIntentCbs.forEach(f => f(audio_context, segment_id, tentativeIntent)))
        segmentState = segmentState.updateIntent(tentativeIntent)
        break
      case WebsocketResponseType.Intent:
        data = data as IntentResponse
        const intent = parseIntent(data, true)
        this.cbs.forEach(cb => cb.intentCbs.forEach(f => f(audio_context, segment_id, intent)))
        segmentState = segmentState.updateIntent(intent)
        break
      case WebsocketResponseType.SegmentEnd:
        segmentState = segmentState.finalize()
        break
      default:
      // TODO: handle unexpected response types.
    }

    // Update the segment in current context.
    context.segments.set(segment_id, segmentState)

    // Update current contexts.
    this.audioContexts.set(audio_context, context)

    // Log segment to console
    if (this.logSegments) {
      console.info(segmentState.toString())
    }

    // Fire segment change event.
    this.cbs.forEach(cb => cb.segmentChangeCbs.forEach(f => f(segmentState.toSegment())))
  }

  // eslint-disable-next-line @typescript-eslint/member-delimiter-style
  private readonly handleWebsocketClosure = (err: WebsocketError): void => {
    if (err.code === 1000) {
      if (this.debug) {
        console.log('[Decoder]', 'Websocket closed', err)
      }
    } else {
      console.error('[Decoder]', 'Websocket closed due to error', err)

      // If for some reason deviceId is missing, there's nothing else we can do but fail completely.
      if (this.deviceId === undefined) {
        this.setState(DecoderState.Failed)
        console.error('[Decoder]', 'No deviceId. Giving up reconnecting.')
        return
      }

      this.setState(DecoderState.Disconnected)
      this.activeContexts = 0
      this.audioContexts.clear()
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      this.reconnect()
    }
  }

  private async reconnect(): Promise<void> {
    console.log('Speechly reconnecting')

    this.connectPromise = null
    if (this.connectAttempt < this.maxReconnectAttemptCount) {
      await this.sleep(this.getReconnectDelayMs(this.connectAttempt++))
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      await this.connect()
    } else {
      console.error('[Decoder] Maximum reconnect count reached, giving up automatic reconnect.')
    }
  }

  private advanceState(newState: DecoderState): void {
    if (this.state >= newState) {
      return
    }
    this.setState(newState)
  }

  private setState(newState: DecoderState): void {
    if (this.state === newState) {
      return
    }

    if (this.debug) {
      console.log('[Decoder]', stateToString(this.state), '->', stateToString(newState))
    }

    this.state = newState
    this.cbs.forEach(cb => cb.stateChangeCbs?.forEach(f => f(newState)))
  }

  /**
   * @returns Array of Segments since last startStream if preserveSegment options was used
   */
  getSegments(): Segment[] {
    const result: Segment[] = []
    this.audioContexts.forEach((audioContext, _) => {
      audioContext.segments.forEach((segment, _) => {
        const deepCopy = JSON.parse(JSON.stringify(segment))
        result.push(deepCopy)
      })
    })
    return result
  }
}

function generateWsUrl(baseUrl: string, sampleRate: number): string {
  const params = new URLSearchParams()
  params.append('sampleRate', sampleRate.toString())

  return `${baseUrl}?${params.toString()}`
}
