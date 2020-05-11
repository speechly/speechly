import localeCode from 'locale-code'
import { v4 as uuidv4 } from 'uuid'

import {
  Microphone,
  BrowserMicrophone,
  DefaultSampleRate,
  ErrNoAudioConsent,
  ErrDeviceNotSupported,
} from '../microphone'

import {
  APIClient,
  WebsocketClient,
  WebsocketResponse,
  WebsocketResponseType,
  TentativeTranscriptResponse,
  TranscriptResponse,
  TentativeEntitiesResponse,
  EntityResponse,
  IntentResponse,
} from '../websocket'

import { Storage, LocalStorage } from '../storage'

import {
  ClientOptions,
  ClientState,
  StateChangeCallback,
  SegmentChangeCallback,
  TentativeTranscriptCallback,
  TranscriptCallback,
  TentativeEntitiesCallback,
  EntityCallback,
  IntentCallback,
} from './types'
import { stateToString } from './state'
import { SegmentState } from './segment'
import { parseTentativeTranscript, parseIntent, parseTranscript, parseTentativeEntities, parseEntity } from './parsers'
import AsyncRetry from 'async-retry'

const deviceIdStorageKey = 'speechly-device-id'
const defaultSpeechlyURL = 'wss://api.speechly.com/ws'

/**
 * A client for Speechly Spoken Language Understanding (SLU) API. The client handles initializing the microphone
 * and websocket connection to Speechly API, passing control events and audio stream to the API, reading the responses
 * and dispatching them, as well as providing a high-level API for interacting with so-called speech segments.
 * @public
 */
export class Client {
  private readonly debug: boolean
  private readonly storage: Storage
  private readonly microphone: Microphone
  private readonly websocket: APIClient

  private readonly activeContexts = new Map<string, Map<number, SegmentState>>()
  private readonly reconnectAttemptCount = 5
  private readonly reconnectMinDelay = 1000

  private deviceId?: string
  private state: ClientState = ClientState.Disconnected

  private stateChangeCb: StateChangeCallback = () => {}
  private segmentChangeCb: SegmentChangeCallback = () => {}
  private tentativeTranscriptCb: TentativeTranscriptCallback = () => {}
  private tentativeEntitiesCb: TentativeEntitiesCallback = () => {}
  private tentativeIntentCb: IntentCallback = () => {}
  private transcriptCb: TranscriptCallback = () => {}
  private entityCb: EntityCallback = () => {}
  private intentCb: IntentCallback = () => {}

  constructor(options: ClientOptions) {
    if (!localeCode.validate(options.language)) {
      throw Error(`[SpeechlyClient] Invalid language "${options.language}"`)
    }

    this.debug = options.debug ?? false
    this.microphone = options.microphone ?? new BrowserMicrophone(options.sampleRate ?? DefaultSampleRate)
    this.websocket =
      options.apiClient ??
      new WebsocketClient(
        options.url ?? defaultSpeechlyURL,
        options.appId,
        options.language,
        options.sampleRate ?? DefaultSampleRate,
      )
    this.storage = options.storage ?? new LocalStorage()

    this.microphone.onAudio(this.handleMicrophoneAudio)
    this.websocket.onResponse(this.handleWebsocketResponse)
    this.websocket.onClose(this.handleWebsocketClosure)
  }

  /**
   * Initializes the client, by initializing the microphone and establishing connection to the API.
   *
   * This function HAS to be invoked by a user by e.g. binding it to a button press,
   * or some other user-performed action.
   *
   * If this function is invoked without a user interaction,
   * the microphone functionality will not work due to security restrictions by the browser.
   */
  async initialize(): Promise<void> {
    if (this.state !== ClientState.Disconnected) {
      throw Error('Cannot initialize client - client is not in Disconnected state')
    }

    this.setState(ClientState.Connecting)

    // 1. Initialise the storage and fetch deviceId (or generate new one and store it).
    await this.storage.initialize()
    this.deviceId = await this.storage.getOrSet(deviceIdStorageKey, uuidv4)

    // 2. Initialise the microphone stack.
    try {
      await this.microphone.initialize()
    } catch (err) {
      switch (err) {
        case ErrDeviceNotSupported:
          this.setState(ClientState.NoBrowserSupport)
          break
        case ErrNoAudioConsent:
          this.setState(ClientState.NoAudioConsent)
          break
        default:
          this.setState(ClientState.Failed)
      }

      throw err
    }

    // 3. Initialise websocket.
    // Do not attempt to re-connect, to make sure we don't block the client.
    await this.websocket.initialize(this.deviceId)

    this.setState(ClientState.Connected)
  }

  /**
   * Closes the client by closing the API connection and disabling the microphone.
   */
  async close(): Promise<void> {
    const errs: string[] = []

    try {
      await this.storage.close()
    } catch (err) {
      errs.push(err.message)
    }

    try {
      await this.microphone.close()
    } catch (err) {
      errs.push(err.message)
    }

    try {
      await this.websocket.close()
    } catch (err) {
      errs.push(err.message)
    }

    this.activeContexts.clear()
    this.setState(ClientState.Disconnected)

    if (errs.length > 0) {
      throw Error(errs.join(','))
    }
  }

  /**
   * Starts a new SLU context by sending a start context event to the API and unmuting the microphone.
   * @param cb - the callback which is invoked when the context start was acknowledged by the API.
   */
  async startContext(): Promise<string> {
    if (this.state !== ClientState.Connected) {
      throw Error('Cannot start context - client is not connected')
    }

    this.setState(ClientState.Starting)

    let contextId: string
    try {
      contextId = await this.websocket.startContext()
    } catch (err) {
      this.setState(ClientState.Connected)
      throw err
    }

    this.setState(ClientState.Recording)
    this.microphone.unmute()
    this.activeContexts.set(contextId, new Map<number, SegmentState>())

    return contextId
  }

  /**
   * Stops current SLU context by sending a stop context event to the API and muting the microphone.
   */
  async stopContext(): Promise<string> {
    if (this.state !== ClientState.Recording) {
      throw Error('Cannot stop context - client is not recording')
    }

    this.setState(ClientState.Stopping)
    this.microphone.mute()

    let contextId: string
    try {
      contextId = await this.websocket.stopContext()
    } catch (err) {
      this.setState(ClientState.Failed)
      throw err
    }

    this.setState(ClientState.Connected)
    this.activeContexts.delete(contextId)

    return contextId
  }

  /**
   * Adds a listener for client state change events.
   * @param cb - the callback to invoke on state change events.
   */
  onStateChange(cb: StateChangeCallback): void {
    this.stateChangeCb = cb
  }

  /**
   * Adds a listener for current segment change events.
   * @param cb - the callback to invoke on segment change events.
   */
  onSegmentChange(cb: SegmentChangeCallback): void {
    this.segmentChangeCb = cb
  }

  /**
   * Adds a listener for tentative transcript responses from the API.
   * @param cb - the callback to invoke on a tentative transcript response.
   */
  onTentativeTranscript(cb: TentativeTranscriptCallback): void {
    this.tentativeTranscriptCb = cb
  }

  /**
   * Adds a listener for transcript responses from the API.
   * @param cb - the callback to invoke on a transcript response.
   */
  onTranscript(cb: TranscriptCallback): void {
    this.transcriptCb = cb
  }

  /**
   * Adds a listener for tentative entities responses from the API.
   * @param cb - the callback to invoke on a tentative entities response.
   */
  onTentativeEntities(cb: TentativeEntitiesCallback): void {
    this.tentativeEntitiesCb = cb
  }

  /**
   * Adds a listener for entity responses from the API.
   * @param cb - the callback to invoke on an entity response.
   */
  onEntity(cb: EntityCallback): void {
    this.entityCb = cb
  }

  /**
   * Adds a listener for tentative intent responses from the API.
   * @param cb - the callback to invoke on a tentative intent response.
   */
  onTentativeIntent(cb: IntentCallback): void {
    this.tentativeIntentCb = cb
  }

  /**
   * Adds a listener for intent responses from the API.
   * @param cb - the callback to invoke on an intent response.
   */
  onIntent(cb: IntentCallback): void {
    this.intentCb = cb
  }

  private readonly handleWebsocketResponse = (response: WebsocketResponse): void => {
    if (this.debug) {
      console.log('[SpeechlyClient]', 'Received response', response)
    }

    // eslint-disable-next-line @typescript-eslint/camelcase
    const { audio_context, segment_id, type } = response
    let { data } = response

    const context = this.activeContexts.get(audio_context)
    if (context === undefined) {
      console.warn('[SpeechlyClient]', 'Received response for non-existent context', audio_context)
      return
    }

    let segmentState = context.get(segment_id) ?? new SegmentState(audio_context, segment_id)

    switch (type) {
      case WebsocketResponseType.TentativeTranscript:
        data = data as TentativeTranscriptResponse
        const words = parseTentativeTranscript(data)
        this.tentativeTranscriptCb(audio_context, segment_id, words, data.transcript)
        segmentState = segmentState.updateTranscript(words)
        break
      case WebsocketResponseType.Transcript:
        data = data as TranscriptResponse
        const word = parseTranscript(data)
        this.transcriptCb(audio_context, segment_id, word)
        segmentState = segmentState.updateTranscript([word])
        break
      case WebsocketResponseType.TentativeEntities:
        data = data as TentativeEntitiesResponse
        const entities = parseTentativeEntities(data)
        this.tentativeEntitiesCb(audio_context, segment_id, entities)
        segmentState = segmentState.updateEntities(entities)
        break
      case WebsocketResponseType.Entity:
        data = data as EntityResponse
        const entity = parseEntity(data)
        this.entityCb(audio_context, segment_id, entity)
        segmentState = segmentState.updateEntities([entity])
        break
      case WebsocketResponseType.TentativeIntent:
        data = data as IntentResponse
        const tentativeIntent = parseIntent(data, false)
        this.tentativeIntentCb(audio_context, segment_id, tentativeIntent)
        segmentState = segmentState.updateIntent(tentativeIntent)
        break
      case WebsocketResponseType.Intent:
        data = data as IntentResponse
        const intent = parseIntent(data, true)
        this.intentCb(audio_context, segment_id, intent)
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

    // Fire segment change event.
    this.segmentChangeCb(segmentState.toSegment())
  }

  private readonly handleWebsocketClosure = (err: Error): void => {
    if (this.debug) {
      console.error('[SpeechlyClient]', 'Server connection closed', err)
    }

    // If for some reason deviceId is missing, there's nothing else we can do but fail completely.
    if (this.deviceId === undefined) {
      this.setState(ClientState.Failed)
      return
    }

    // Make sure we don't have concurrent reconnection procedures or attempt to reconnect from a failed state.
    if (this.state === ClientState.Connecting || this.state === ClientState.Failed) {
      return
    }
    this.setState(ClientState.Connecting)

    this.reconnectWebsocket(this.deviceId)
      .then(() => this.setState(ClientState.Connected))
      .catch(() => this.setState(ClientState.Failed))
  }

  private async reconnectWebsocket(deviceId: string): Promise<void> {
    return AsyncRetry(
      async (_, attempt: number): Promise<void> => {
        if (this.debug) {
          console.log('[SpeechlyClient]', 'WebSocket reconnection attempt number:', attempt)
        }

        await this.websocket.initialize(deviceId)
      },
      {
        retries: this.reconnectAttemptCount,
        minTimeout: this.reconnectMinDelay,
      },
    )
  }

  private readonly handleMicrophoneAudio = (audioChunk: ArrayBuffer): void => {
    if (this.state !== ClientState.Recording) {
      return
    }

    this.websocket.sendAudio(audioChunk)
  }

  private setState(newState: ClientState): void {
    if (this.state === newState) {
      return
    }

    if (this.debug) {
      console.log('[SpeechlyClient]', 'State transition', stateToString(this.state), stateToString(newState))
    }

    this.state = newState
    this.stateChangeCb(newState)
  }
}
