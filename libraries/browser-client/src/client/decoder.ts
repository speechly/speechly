import { v4 as uuidv4 } from 'uuid'

import { validateToken, fetchToken } from '../websocket/token'

import { SegmentState, DefaultSampleRate, ErrAppIdChangeWithoutProjectLogin } from '../speechly'

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

import { DecoderOptions, DecoderState, EventCallbacks, ContextOptions } from './types'
import { stateToString } from './state'

import { parseTentativeTranscript, parseIntent, parseTranscript, parseTentativeEntities, parseEntity } from './parsers'

const deviceIdStorageKey = 'speechly-device-id'
const authTokenKey = 'speechly-auth-token'
const defaultApiUrl = 'https://api.speechly.com'

/**
 * A client for Speechly Spoken Language Understanding (SLU) API. The client handles initializing the websocket
 * connection to Speechly API, sending control events and audio stream. It reads and dispatches the responses
 * through a high-level API for interacting with so-called speech segments.
 * @public
 */
export class CloudDecoder {
  private readonly debug: boolean
  private readonly logSegments: boolean
  private readonly projectId?: string
  private readonly appId?: string
  private readonly storage: Storage
  private readonly apiClient: APIClient
  private readonly loginUrl: string
  private readonly deviceId: string
  private readonly apiUrl: string

  private readonly activeContexts = new Map<string, Map<number, SegmentState>>()
  private readonly maxReconnectAttemptCount = 10
  private readonly contextStopDelay = 250

  private connectAttempt: number = 0
  private connectPromise: Promise<void> | null = null
  private listeningPromise: Promise<any> | null = null

  private authToken?: string
  private readonly cbs: EventCallbacks[] = []

  private sampleRate: number
  state: DecoderState = DecoderState.Disconnected

  constructor(options: DecoderOptions) {
    this.logSegments = options.logSegments ?? false

    this.appId = options.appId ?? undefined
    this.projectId = options.projectId ?? undefined
    this.sampleRate = options.sampleRate ?? DefaultSampleRate
    this.debug = options.debug ?? false

    if (this.appId !== undefined && this.projectId !== undefined) {
      throw Error('[Decoder] You cannot use both appId and projectId at the same time')
    } else if (this.appId === undefined && this.projectId === undefined) {
      throw Error('[Decoder] Either an appId or a projectId is required')
    }

    const apiUrl = options.apiUrl ?? defaultApiUrl
    this.apiUrl = generateWsUrl(apiUrl.replace('http', 'ws') + '/ws/v1', this.sampleRate)
    this.loginUrl = `${apiUrl}/login`
    this.storage = options.storage ?? new LocalStorage()
    this.deviceId = this.storage.getOrSet(deviceIdStorageKey, uuidv4)

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
        // Get auth token from cache or renew it
        const storedToken = this.storage.get(authTokenKey)
        if (storedToken == null || !validateToken(storedToken, this.projectId, this.appId, this.deviceId)) {
          try {
            this.authToken = await fetchToken(this.loginUrl, this.projectId, this.appId, this.deviceId)
            // Cache the auth token in local storage for future use.
            this.storage.set(authTokenKey, this.authToken)
          } catch (err) {
            this.setState(DecoderState.Failed)
            throw err
          }
        } else {
          this.authToken = storedToken
        }

        // Establish websocket connection
        await this.apiClient.initialize(this.apiUrl, this.authToken, this.sampleRate, this.debug)
        this.advanceState(DecoderState.Connected)
      })()
    }
    await this.connectPromise
  }

  /**
   * Closes the client by closing the API connection and disabling the microphone.
   */
  async close(): Promise<void> {
    let error: string | undefined

    try {
      await this.apiClient.close()
    } catch (err) {
      // @ts-ignore
      error = err.message
    }

    this.activeContexts.clear()
    this.connectPromise = null
    this.setState(DecoderState.Disconnected)

    if (error !== undefined) {
      throw Error(error)
    }
  }

  private async queueTask(task: () => Promise<any>): Promise<any> {
    const prevTask = this.listeningPromise
    this.listeningPromise = (async () => {
      await prevTask
      return task()
    })()
    return this.listeningPromise
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

    return this.queueTask(async () => {
      this.setState(DecoderState.Active)
      let contextId: string
      if (this.projectId != null) {
        contextId = await this.apiClient.startContext(options?.appId)
      } else {
        if (options?.appId != null && this.appId !== options?.appId) {
          this.setState(DecoderState.Failed)
          throw ErrAppIdChangeWithoutProjectLogin
        }
        contextId = await this.apiClient.startContext()
      }

      // Ensure state has not been changed by await apiClient.startContext() due to websocket errors.
      // Due to apiClient.startContext implementation, they don't throw an error here, but call handleWebsocketClosure instead which changes to DecoderState.Disconnected
      if (this.state < DecoderState.Active) {
        throw Error('[Decoder] Unable to complete startContext: Problem acquiring contextId')
      }

      this.activeContexts.set(contextId, new Map<number, SegmentState>())
      this.cbs.forEach(cb => cb.contextStartedCbs.forEach(f => f(contextId)))
      return contextId
    })
  }

  /**
   * Send audio array.
   */
  sendAudio(audio: Float32Array): void {
    /*
    if (this.state !== DecoderState.Active) {
      throw Error(
        '[Decoder] Unable to complete startContext: Expected Active state, but was in ' +
          stateToString(this.state) +
          '.',
      )
    }
    */
    this.apiClient.sendAudio(audio)
  }

  /**
   * Stops current SLU context by sending a stop context event to the API and muting the microphone
   * delayed by contextStopDelay = 250 ms
   */
  async stopContext(): Promise<string> {
    if (this.state === DecoderState.Failed) {
      throw Error('[Decoder] stopContext cannot be run in unrecovable error state.')
    } else if (this.state !== DecoderState.Active) {
      throw Error(
        '[Decoder] Unable to complete stopContext: Expected Active state, but was in ' +
          stateToString(this.state) +
          '.',
      )
    }
    this.setState(DecoderState.Connected)

    const contextId = await this.queueTask(async () => {
      await this.sleep(this.contextStopDelay)
      try {
        const contextId = await this.apiClient.stopContext()
        this.activeContexts.delete(contextId)
        return contextId
      } catch (err) {
        this.setState(DecoderState.Failed)
        throw err
      }
    })

    this.cbs.forEach(cb => cb.contextStoppedCbs.forEach(f => f(contextId)))
    return contextId
  }

  /**
   * Stops current context and immediately starts a new SLU context
   * by sending a start context event to the API and unmuting the microphone.
   * @param appId - unique identifier of an app in the dashboard.
   */
  async switchContext(appId: string): Promise<void> {
    if (this.state !== DecoderState.Active) {
      throw Error(
        '[Decoder] Unable to complete switchContext: Expected Active state, but was in ' +
          stateToString(this.state) +
          '.',
      )
    }
    await this.queueTask(async () => {
      const contextId = await this.apiClient.switchContext(appId)
      this.activeContexts.set(contextId, new Map<number, SegmentState>())
    })
  }

  registerListener(listener: EventCallbacks): void {
    this.cbs.push(listener)
  }

  async setSampleRate(sr: number): Promise<void> {
    this.sampleRate = sr
    await this.apiClient.setSourceSampleRate(sr)
  }

  useSharedArrayBuffers(controlSAB: any, dataSAB: any): void {
    this.apiClient.postMessage({
      type: 'SET_SHARED_ARRAY_BUFFERS',
      controlSAB,
      dataSAB,
    })
  }

  private readonly handleWebsocketResponse = (response: WebsocketResponse): void => {
    if (this.debug) {
      console.log('[Decoder]', 'Received response', response)
    }

    switch (response.type) {
      case WorkerSignal.VadSignalHigh:
        this.cbs.forEach(cb => cb.onVadStateChange.forEach(f => f(true)))
        return
      case WorkerSignal.VadSignalLow:
        this.cbs.forEach(cb => cb.onVadStateChange.forEach(f => f(false)))
        return
    }

    const { audio_context, segment_id, type } = response
    let { data } = response

    const context = this.activeContexts.get(audio_context)
    if (context === undefined) {
      console.warn('[Decoder]', 'Received response for non-existent context', audio_context)
      return
    }

    let segmentState = context.get(segment_id) ?? new SegmentState(audio_context, segment_id)

    switch (type) {
      case WebsocketResponseType.TentativeTranscript:
        data = data as TentativeTranscriptResponse
        const words = parseTentativeTranscript(data)
        const transcript = data.transcript
        this.cbs.forEach(cb => cb.tentativeTranscriptCbs.forEach(f => f(audio_context, segment_id, words, transcript)))
        segmentState = segmentState.updateTranscript(words)
        break
      case WebsocketResponseType.Transcript:
        data = data as TranscriptResponse
        const word = parseTranscript(data)
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
    context.set(segment_id, segmentState)

    // Update current contexts.
    this.activeContexts.set(audio_context, context)

    // Log segment to console
    if (this.logSegments) {
      console.info(segmentState.toString())
    }

    // Fire segment change event.
    this.cbs.forEach(cb => cb.segmentChangeCbs.forEach(f => f(segmentState.toSegment())))
  }

  // eslint-disable-next-line @typescript-eslint/member-delimiter-style
  private readonly handleWebsocketClosure = (err: { code: number; reason: string; wasClean: boolean }): void => {
    if (err.code === 1000) {
      if (this.debug) {
        console.log('[Decoder]', 'Websocket closed', err)
      }
    } else {
      console.error('[Decoder]', 'Websocket closed due to error', err)

      // If for some reason deviceId is missing, there's nothing else we can do but fail completely.
      if (this.deviceId === undefined) {
        this.setState(DecoderState.Failed)
        return
      }

      // Reset
      this.listeningPromise = null

      this.setState(DecoderState.Disconnected)
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      this.reconnect()
    }
  }

  private async reconnect(): Promise<void> {
    if (this.debug) {
      console.log('[Decoder]', 'Reconnecting...', this.connectAttempt)
    }
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
}

function generateWsUrl(baseUrl: string, sampleRate: number): string {
  const params = new URLSearchParams()
  params.append('sampleRate', sampleRate.toString())

  return `${baseUrl}?${params.toString()}`
}
