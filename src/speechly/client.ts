import { getByTag as getLocaleByTag } from 'locale-codes'

import { ErrorCallback, ContextCallback } from '../types'
import { Microphone, DefaultSampleRate, ErrNoAudioConsent, ErrNoBrowserSupport } from '../microphone/microphone'
import {
  Websocket,
  WebsocketClient,
  WebsocketResponse,
  WebsocketResponseType,
  TentativeTranscriptResponse,
  TranscriptResponse,
  TentativeEntitiesResponse,
  EntityResponse,
  IntentResponse
} from '../websocket'

import { stateToString } from './state'
import { SegmentState } from './segment'
import { parseTentativeTranscript, parseIntent, parseTranscript, parseTentativeEntities, parseEntity } from './parsers'
import {
  ClientOptions,
  ClientState,
  StateChangeCallback,
  SegmentChangeCallback,
  TentativeTranscriptCallback,
  TranscriptCallback,
  TentativeEntitiesCallback,
  EntityCallback,
  IntentCallback
} from './types'

/**
 * A client for Speechly Spoken Language Understanding (SLU) API. The client handles initializing the microphone
 * and websocket connection to Speechly API, passing control events and audio stream to the API, reading the responses
 * and dispatching them, as well as providing a high-level API for interacting with so-called speech segments.
 * @public
 */
export class Client {
  private readonly debug: boolean
  private readonly microphone: Microphone
  private readonly websocket: WebsocketClient
  private readonly activeContexts = new Map<string, SegmentState>()

  private state: ClientState = ClientState.Disconnected
  private reconnectAttemptCount = initialReconnectCount
  private nextReconnectDelay = initialReconnectDelay

  private stateChangeCb: StateChangeCallback = () => {}
  private segmentChangeCb: SegmentChangeCallback = () => {}
  private tentativeTranscriptCb: TentativeTranscriptCallback = () => {}
  private tentativeEntitiesCb: TentativeEntitiesCallback = () => {}
  private tentativeIntentCb: IntentCallback = () => {}
  private transcriptCb: TranscriptCallback = () => {}
  private entityCb: EntityCallback = () => {}
  private intentCb: IntentCallback = () => {}

  constructor(options: ClientOptions) {
    if (getLocaleByTag(options.language) === undefined) {
      throw Error(`[SpeechlyClient] Invalid language "${options.language}"`)
    }

    this.debug = options.debug ?? false
    this.microphone = new Microphone(options.sampleRate ?? DefaultSampleRate)
    this.websocket = new Websocket(
      options.url ?? defaultSpeechlyURL,
      options.appId,
      options.language,
      options.deviceId ?? uuidv4(),
      options.sampleRate ?? DefaultSampleRate
    )

    this.microphone.onAudio(this.handleMicrophoneAudio)
    this.websocket.onResponse(this.handleWebsocketResponse)
    this.websocket.onClose(this.handleWebsocketClosure)
  }

  /**
   * Initializes the client, by initializing the microphone and establishing connection to the API.
   * @param cb - the callback which is invoked when the initialization is complete.
   */
  initialize(cb: ErrorCallback = () => {}): void {
    if (this.state !== ClientState.Disconnected) {
      return cb(new Error('Cannot initialize client - client is not in Disconnected state'))
    }

    this.setState(ClientState.Connecting)
    this.microphone.initialize((err?: Error) => {
      if (err !== undefined) {
        switch (err) {
          case ErrNoBrowserSupport:
            this.setState(ClientState.NoBrowserSupport)
            break
          case ErrNoAudioConsent:
            this.setState(ClientState.NoAudioConsent)
            break
          default:
            this.setState(ClientState.Failed)
        }

        return cb(err)
      }

      this.websocket.initialize((err?: Error) => {
        if (err !== undefined) {
          this.reconnectWebsocket()
          // TODO: I think this can be confusing for the end user.
          // We should only invoke callback when initialization is finished, either successfully or with an error.
          // We can instead pass the callback to reconnect and let that invoke it.
          return cb()
        }

        this.setState(ClientState.Connected)
        return cb()
      })
    })
  }

  /**
   * Closes the client by closing the API connection and disabling the microphone.
   * @param cb - the callback which is invoked when closure is complete.
   */
  close(cb: ErrorCallback = () => {}): void {
    this.microphone.close((err?: Error) => {
      const errs = []
      if (err !== undefined) {
        errs.push(err.message)
      }

      const wsErr = this.websocket.close(1000, 'client disconnecting')
      if (wsErr !== undefined) {
        errs.push(wsErr.message)
      }

      this.activeContexts.clear()

      return errs.length > 0 ? cb(Error(errs.join(','))) : cb()
    })
  }

  /**
   * Starts a new SLU context by sending a start context event to the API and unmuting the microphone.
   * @param cb - the callback which is invoked when the context start was acknowledged by the API.
   */
  startContext(cb: ContextCallback = () => {}): void {
    if (this.state !== ClientState.Connected) {
      return cb(Error('Cannot start context - client is not connected'))
    }

    // Re-set reconnection settings here, so that we avoid flip-flopping in `_reconnectWebsocket`.
    this.reconnectAttemptCount = initialReconnectCount
    this.nextReconnectDelay = initialReconnectDelay

    this.setState(ClientState.Starting)
    this.websocket.start((err?: Error, contextId?: string) => {
      if (err !== undefined) {
        this.setState(ClientState.Connected)
        return cb(err)
      }

      const ctxId = contextId as string

      this.setState(ClientState.Recording)
      this.microphone.unmute()
      this.activeContexts.set(ctxId, new SegmentState(ctxId, 1))

      return cb(undefined, contextId)
    })
  }

  /**
   * Stops current SLU context by sending a stop context event to the API and muting the microphone.
   * @param cb - the callback which is invoked when the context stop was acknowledged by the API.
   */
  stopContext(cb: ContextCallback = () => {}): void {
    if (this.state !== ClientState.Recording) {
      return cb(new Error('Cannot stop context - client is not recording'))
    }

    this.setState(ClientState.Stopping)
    this.microphone.mute()
    this.websocket.stop((err?: Error, contextId?: string) => {
      if (err !== undefined) {
        // Sending stop event failed, which means recovering from this isn't viable.
        // Developers should react to this state by reloading the app.
        this.setState(ClientState.Failed)
        return cb(err)
      }

      const ctxId = contextId as string

      this.setState(ClientState.Connected)
      if (!this.activeContexts.delete(ctxId)) {
        console.warn('[SpeechlyClient]', 'Attempted to remove non-existent context', ctxId)
      }

      return cb()
    })
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

    let segmentState = this.activeContexts.get(audio_context)
    if (segmentState === undefined) {
      console.warn('[SpeechlyClient]', 'Received response for non-existent context', audio_context)
      return
    }

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
        let intent = parseIntent(data, false)
        this.tentativeIntentCb(audio_context, segment_id, intent)
        segmentState = segmentState.updateIntent(intent)
        break
      case WebsocketResponseType.Intent:
        data = data as IntentResponse
        intent = parseIntent(data, true)
        this.intentCb(audio_context, segment_id, intent)
        segmentState = segmentState.updateIntent(intent)
        break
      case WebsocketResponseType.SegmentEnd:
        segmentState = segmentState.finalize()
        break
      default:
      // TODO: handle unexpected response types.
    }

    this.segmentChangeCb(segmentState.toSegment())

    if (segmentState.isFinalized) {
      // If previous segment was finalized, replace it with an empty one.
      this.activeContexts.set(audio_context, new SegmentState(audio_context, segmentState.id + 1))
    } else {
      // If the segment was not yet finalized, update it in the state.
      this.activeContexts.set(audio_context, segmentState)
    }
  }

  private readonly handleWebsocketClosure = (err: Error): void => {
    if (this.debug) {
      console.error('[SpeechlyClient]', 'Server connection closed', err)
    }

    this.reconnectWebsocket()
  }

  private reconnectWebsocket(): void {
    if (this.reconnectAttemptCount < 1) {
      return this.setState(ClientState.Disconnected)
    }

    if (this.state !== ClientState.Connecting) {
      this.setState(ClientState.Connecting)
    }

    if (this.debug) {
      console.log(
        '[SpeechlyClient]',
        `Attempting to re-connect to the server in ${this.nextReconnectDelay.toString()}ms`
      )
    }

    // TODO: extract this as a "re-trier" (check existing libraries first).
    setTimeout(() => {
      this.reconnectAttemptCount = this.reconnectAttemptCount - 1
      this.nextReconnectDelay = this.nextReconnectDelay * 2

      this.websocket.initialize((err?: Error) => {
        if (err !== undefined) {
          return this.reconnectWebsocket()
        }

        this.setState(ClientState.Connected)
      })
    }, this.nextReconnectDelay)
  }

  private readonly handleMicrophoneAudio = (audio: ArrayBuffer): void => {
    if (this.state === ClientState.Recording) {
      if (this.debug) {
        console.log('[SpeechlyClient]', 'Sending audio data', audio)
      }

      this.websocket.send(audio)
    }
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

const defaultSpeechlyURL = 'wss://api.speechly.com/ws'
const initialReconnectDelay = 1000
const initialReconnectCount = 5

function uuidv4(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    // eslint-disable-next-line one-var
    const r = (Math.random() * 16) | 0,
      v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}
