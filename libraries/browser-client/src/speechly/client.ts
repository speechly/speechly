import { v4 as uuidv4 } from 'uuid'

import { validateToken, fetchToken } from '../websocket/token'

import {
  Microphone,
  BrowserMicrophone,
  DefaultSampleRate,
  ErrNoAudioConsent,
  ErrDeviceNotSupported,
  ErrAppIdChangeWithoutProjectLogin,
} from '../microphone'

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

const deviceIdStorageKey = 'speechly-device-id'
const authTokenKey = 'speechly-auth-token'
const defaultApiUrl = 'wss://api.speechly.com/ws/v1'
const defaultLoginUrl = 'https://api.speechly.com/login'

declare global {
  interface Window {
    SpeechlyClient: Client
  }
}

/**
 * A client for Speechly Spoken Language Understanding (SLU) API. The client handles initializing the microphone
 * and websocket connection to Speechly API, passing control events and audio stream to the API, reading the responses
 * and dispatching them, as well as providing a high-level API for interacting with so-called speech segments.
 * @public
 */
export class Client {
  private readonly debug: boolean
  private readonly logSegments: boolean
  private readonly projectId?: string
  private readonly appId?: string
  private readonly storage: Storage
  private readonly microphone: Microphone
  private readonly apiClient: APIClient
  private readonly loginUrl: string
  private readonly isWebkit: boolean
  private readonly sampleRate: number
  private readonly nativeResamplingSupported: boolean
  private readonly autoGainControl: boolean

  private readonly activeContexts = new Map<string, Map<number, SegmentState>>()
  private readonly maxReconnectAttemptCount = 10
  private readonly contextStopDelay = 250
  private connectAttempt: number = 0
  private connectPromise: Promise<void> | null = null
  private initializePromise: Promise<void> | null = null
  private startTask: Promise<string> | null = null
  private stopTask: Promise<void> | null = null

  private readonly deviceId: string
  private authToken?: string
  private audioContext?: AudioContext
  private state: ClientState = ClientState.Disconnected
  private readonly apiUrl: string

  private stateChangeCb: StateChangeCallback = () => {}
  private segmentChangeCb: SegmentChangeCallback = () => {}
  private tentativeTranscriptCb: TentativeTranscriptCallback = () => {}
  private tentativeEntitiesCb: TentativeEntitiesCallback = () => {}
  private tentativeIntentCb: IntentCallback = () => {}
  private transcriptCb: TranscriptCallback = () => {}
  private entityCb: EntityCallback = () => {}
  private intentCb: IntentCallback = () => {}

  constructor(options: ClientOptions) {
    this.sampleRate = options.sampleRate ?? DefaultSampleRate

    try {
      const constraints = window.navigator.mediaDevices.getSupportedConstraints()
      this.nativeResamplingSupported = constraints.sampleRate === true
      if (options.autoGainControl != null && options.autoGainControl) {
        // @ts-ignore
        this.autoGainControl = constraints.autoGainControl === true
      } else {
        this.autoGainControl = false
      }
    } catch {
      this.nativeResamplingSupported = false
      this.autoGainControl = false
    }

    this.debug = options.debug ?? false
    this.logSegments = options.logSegments ?? false
    this.loginUrl = options.loginUrl ?? defaultLoginUrl
    this.appId = options.appId ?? undefined
    this.projectId = options.projectId ?? undefined
    this.apiClient = options.apiClient ?? new WebWorkerController()
    this.apiUrl = generateWsUrl(options.apiUrl ?? defaultApiUrl, options.sampleRate ?? DefaultSampleRate)

    if (this.appId !== undefined && this.projectId !== undefined) {
      throw Error('[SpeechlyClient] You cannot use both appId and projectId at the same time')
    }

    this.storage = options.storage ?? new LocalStorage()
    this.deviceId = this.storage.getOrSet(deviceIdStorageKey, uuidv4)

    if (window.AudioContext !== undefined) {
      this.isWebkit = false
    } else if (window.webkitAudioContext !== undefined) {
      this.isWebkit = true
    } else {
      throw ErrDeviceNotSupported
    }

    this.microphone =
      options.microphone ?? new BrowserMicrophone(this.isWebkit, this.sampleRate, this.apiClient, this.debug)

    this.apiClient.onResponse(this.handleWebsocketResponse)
    this.apiClient.onClose(this.handleWebsocketClosure)

    window.SpeechlyClient = this

    if (options.connect !== false) {
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
  public async connect(): Promise<void> {
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
            this.setState(ClientState.Failed)
            throw err
          }
        } else {
          this.authToken = storedToken
        }

        // Establish websocket connection
        try {
          await this.apiClient.initialize(this.apiUrl, this.authToken, this.sampleRate, this.debug)
        } catch (err) {
          this.setState(ClientState.Failed)
          throw err
        }
      })()
    }
    await this.connectPromise
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
    // Ensure we're connected. Returns immediately if we are
    await this.connect()
    this.advanceState(ClientState.Connecting)

    if (this.initializePromise === null) {
      this.initializePromise = (async () => {
        try {
          if (this.isWebkit) {
            if (window.webkitAudioContext !== undefined) {
              // eslint-disable-next-line new-cap
              this.audioContext = new window.webkitAudioContext()
            }
          } else {
            const opts: AudioContextOptions = {}
            if (this.nativeResamplingSupported) {
              opts.sampleRate = this.sampleRate
            }

            this.audioContext = new window.AudioContext(opts)
          }

          const mediaStreamConstraints: MediaStreamConstraints = {
            video: false,
          }

          if (this.nativeResamplingSupported || this.autoGainControl) {
            mediaStreamConstraints.audio = {
              sampleRate: this.sampleRate,
              // @ts-ignore
              autoGainControl: this.autoGainControl,
            }
          } else {
            mediaStreamConstraints.audio = true
          }

          if (this.audioContext != null) {
            // Start audio context if we are dealing with a WebKit browser.
            //
            // WebKit browsers (e.g. Safari) require to resume the context first,
            // before obtaining user media by calling `mediaDevices.getUserMedia`.
            //
            // If done in a different order, the audio context will resume successfully,
            // but will emit empty audio buffers.
            if (this.isWebkit) {
              await this.audioContext.resume()
            }
            await this.apiClient.setSourceSampleRate(this.audioContext.sampleRate)
            await this.microphone.initialize(this.audioContext, mediaStreamConstraints)
          } else {
            throw ErrDeviceNotSupported
          }
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
      })()
    }
    await this.initializePromise
    this.advanceState(ClientState.Connected)
  }

  /**
   * Closes the client by closing the API connection and disabling the microphone.
   */
  async close(): Promise<void> {
    const errs: string[] = []

    try {
      await this.microphone.close()
    } catch (err) {
      // @ts-ignore
      errs.push(err.message)
    }

    try {
      await this.apiClient.close()
    } catch (err) {
      // @ts-ignore
      errs.push(err.message)
    }

    this.activeContexts.clear()
    this.connectPromise = null
    this.initializePromise = null
    this.setState(ClientState.Disconnected)

    if (errs.length > 0) {
      throw Error(errs.join(','))
    }
  }

  /**
   * Stops current context and immediately starts a new SLU context
   * by sending a start context event to the API and unmuting the microphone.
   * @param appId - unique identifier of an app in the dashboard.
   */
  async switchContext(appId: string): Promise<void> {
    /*
    if (this.state === ClientState.Recording) {
      this.resolveStopContext = undefined
      const contextId = await this.apiClient.switchContext(appId)
      this.activeContexts.set(contextId, new Map<number, SegmentState>())
    }
*/
  }

  private hasUnrecoverableError(): boolean {
    return this.state === ClientState.Failed
  }

  /**
   * Starts a new SLU context by sending a start context event to the API and unmuting the microphone.
   * @param cb - the callback which is invoked when the context start was acknowledged by the API.
   */
  public async startContext(appId?: string): Promise<string> {
    if (!this.hasUnrecoverableError()) {
      // Cache stop task at invoke time in case of quick presses during init
      const stopTaskAtInvokeTime = this.stopTask
      this.startTask = (async () => {
        await this.initialize()
        await stopTaskAtInvokeTime
        if (this.state === ClientState.Connected) {
          this.setState(ClientState.Starting)

          this.microphone.unmute()

          // Fetch context id
          let contextId: string
          if (this.projectId != null) {
            contextId = await this.apiClient.startContext(appId)
          } else {
            if (appId != null && this.appId !== appId) {
              this.setState(ClientState.Failed)
              throw ErrAppIdChangeWithoutProjectLogin
            }
            contextId = await this.apiClient.startContext()
          }
          // Ensure state has not been changed by await apiClient.startContext() due to websocket errors.
          // Due to startContext implementation, they don't throw an error here, but call handleWebsocketClosure instead which changes to ClientState.Disconnected
          // @ts-ignore
          if (this.state === ClientState.Starting) {
            this.activeContexts.set(contextId, new Map<number, SegmentState>())
            this.setState(ClientState.Recording)
            return contextId
          } else {
            throw Error('[SpeechlyClient] Unable to start context. Problem acquiring contextId')
          }
        } else {
          throw Error('[SpeechlyClient] Unable to start context. The client was in an unexpected state: ' + stateToString(this.state))
        }
      })()
      return this.startTask
    }
    throw Error('[SpeechlyClient] Unable to start context due to an earlier error')
  }

  /**
   * Stops current SLU context by sending a stop context event to the API and muting the microphone
   * delayed by contextStopDelay = 250 ms
   */
  async stopContext(): Promise<string> {
    if (!this.hasUnrecoverableError()) {
      await this.startTask
      if (this.state === ClientState.Recording) {
        this.stopTask = (async () => {
          this.setState(ClientState.Stopping)
          await this.sleep(this.contextStopDelay)
          this.microphone.mute()
          this.setState(ClientState.Connected)
        })()
        await this.stopTask

        let contextId
        try {
          contextId = await this.apiClient.stopContext()
        } catch (err) {
          this.setState(ClientState.Failed)
          throw err
        }
        this.activeContexts.delete(contextId)

        return contextId
      } else {
        throw Error('[SpeechlyClient] Unable to start context. The client was in an unexpected state: ' + stateToString(this.state))
      }
    }
    throw Error('[SpeechlyClient] Unable to start context due to an earlier error')
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

    // Log segment to console
    if (this.logSegments) {
      console.info(segmentState.toString())
    }

    // Fire segment change event.
    this.segmentChangeCb(segmentState.toSegment())
  }

  private readonly handleWebsocketClosure = (err: { code: number, reason: string, wasClean: boolean }): void => {
    if (err.code === 1000) {
      if (this.debug) {
        console.log('[SpeechlyClient]', 'Websocket closed', err)
      }
    } else {
      if (this.debug) {
        console.error('[SpeechlyClient]', 'Websocket closed due to error', err)
      }

      // If for some reason deviceId is missing, there's nothing else we can do but fail completely.
      if (this.deviceId === undefined) {
        this.setState(ClientState.Failed)
        return
      }

      this.setState(ClientState.Disconnected)
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      this.reconnect()
    }
  }

  private async reconnect(): Promise<void> {
    if (this.debug) {
      console.log('[SpeechlyClient]', 'Reconnecting...', this.connectAttempt)
    }
    this.connectPromise = null
    if (this.state !== ClientState.Failed && this.connectAttempt < this.maxReconnectAttemptCount) {
      await this.sleep(this.getReconnectDelayMs(this.connectAttempt++))
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      await this.connect()
    } else {
      console.error('[SpeechlyClient] Maximum reconnect count reached, giving up automatic reconnect.')
    }
  }

  private advanceState(newState: ClientState): void {
    if (this.state >= newState) {
      return
    }
    this.setState(newState)
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

  /**
   * print statistics to console
   */
  public printStats(): void {
    this.microphone.printStats()
  }
}

function generateWsUrl(baseUrl: string, sampleRate: number): string {
  const params = new URLSearchParams()
  params.append('sampleRate', sampleRate.toString())

  return `${baseUrl}?${params.toString()}`
}
