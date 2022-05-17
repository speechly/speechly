import AudioProcessor from '../audioprocessing/AudioProcessor'
import EnergyTresholdVAD from '../audioprocessing/EnergyTresholdVAD'
import AudioTools from '../audioprocessing/AudioTools'
import { ControllerSignal, WebsocketResponseType, WorkerSignal } from './types'
import { VadOptions } from '../client'

/**
 * The interface for response returned by WebSocket client.
 * @public
 */
interface WebsocketResponse {
  /**
   * Response type.
   */
  type: WebsocketResponseType

  /**
   * Audio context ID.
   */
  audio_context: string

  /**
   * Segment ID.
   */
  segment_id: number

  /**
   * Response payload.
   *
   * The payload value should match the response type (i.e. TranscriptResponse should have Transcript type).
   * Not all response types have payloads - Started, Stopped and SegmentEnd don't have payloads.
   * TentativeIntent and Intent share the same payload interface (IntentResponse).
   */
  data: any
}

const CONTROL = {
  WRITE_INDEX: 0,
  FRAMES_AVAILABLE: 1,
  LOCK: 2,
}

class WebsocketClient {
  private readonly workerCtx: Worker
  private targetSampleRate: number = 16000
  private isContextStarted: boolean = false
  private websocket?: WebSocket
  private audioProcessor?: AudioProcessor
  private controlSAB?: Int32Array
  private dataSAB?: Float32Array

  private readonly frameMillis = 30
  private readonly outputAudioFrame: Int16Array = new Int16Array(this.frameMillis * this.targetSampleRate / 1000)

  private debug: boolean = false

  constructor(ctx: Worker) {
    this.workerCtx = ctx
  }

  connect(apiUrl: string, authToken: string, targetSampleRate: number, debug: boolean): void {
    this.debug = debug
    if (this.debug) {
      console.log('[WebSocketClient]', 'connecting to ', apiUrl)
    }
    this.targetSampleRate = targetSampleRate
    this.isContextStarted = false
    this.websocket = new WebSocket(apiUrl, authToken)
    this.websocket.addEventListener('open', this.onWebsocketOpen)
    this.websocket.addEventListener('message', this.onWebsocketMessage)
    this.websocket.addEventListener('error', this.onWebsocketError)
    this.websocket.addEventListener('close', this.onWebsocketClose)
  }

  initAudioProcessor(sourceSampleRate: number, vadOptions?: VadOptions): void {
    console.log('got vad options', vadOptions)
    this.audioProcessor = new AudioProcessor(sourceSampleRate, this.targetSampleRate, 5)

    if (vadOptions) {
      this.audioProcessor.Vad = new EnergyTresholdVAD(vadOptions)

      this.audioProcessor.onVadSignalHigh = () => {
        console.log('onSignalHigh')
        this.workerCtx.postMessage({ type: WorkerSignal.VadSignalHigh })
      }
      this.audioProcessor.onVadSignalLow = () => {
        console.log('onSignalLow')
        this.workerCtx.postMessage({ type: WorkerSignal.VadSignalLow })
      }
    }

    this.audioProcessor.SendAudio = (s, startIndex, length) => {
      AudioTools.ConvertFloatToInt16(s, this.outputAudioFrame, startIndex, length)
      this.send(this.outputAudioFrame)
    }

    this.workerCtx.postMessage({ type: WorkerSignal.AudioProcessorReady })
  }

  setSharedArrayBuffers(controlSAB: number, dataSAB: number): void {
    this.controlSAB = new Int32Array(controlSAB)
    this.dataSAB = new Float32Array(dataSAB)
    const audioHandleInterval = this.dataSAB.length / 32 // ms
    if (this.debug) {
      console.log('[WebSocketClient]', 'Audio handle interval', audioHandleInterval, 'ms')
    }
    setInterval(this.sendAudioFromSAB.bind(this), audioHandleInterval)
  }

  /**
   * Processes and sends audio
   * @param audioChunk - audio data to process
   */
  processAudio(audioChunk: Float32Array): void {
    if (!this.audioProcessor) {
      throw new Error('No AudioProcessor')
    }
    this.audioProcessor.ProcessAudio(audioChunk)
  }

  sendAudioFromSAB(): void {
    if (!this.controlSAB || !this.dataSAB) {
      throw new Error('No SharedArrayBuffers')
    }

    if (!this.audioProcessor) {
      throw new Error('No AudioProcessor')
    }

    /*
    if (!this.isContextStarted) {
      this.controlSAB[CONTROL.FRAMES_AVAILABLE] = 0
      this.controlSAB[CONTROL.WRITE_INDEX] = 0
      return
    }
    */

    const framesAvailable = this.controlSAB[CONTROL.FRAMES_AVAILABLE]
    const lock = this.controlSAB[CONTROL.LOCK]

    if (lock === 0 && framesAvailable > 0) {
      const data = this.dataSAB.subarray(0, framesAvailable)
      this.controlSAB[CONTROL.FRAMES_AVAILABLE] = 0
      this.controlSAB[CONTROL.WRITE_INDEX] = 0
      if (data.length > 0) {
        this.audioProcessor.ProcessAudio(data)
      }
    }
  }

  startContext(appId?: string): void {
    if (!this.audioProcessor) {
      throw Error('No AudioProcessor')
    }

    if (this.isContextStarted) {
      console.error('[WebSocketClient]', "can't start context: active context exists")
      return
    }

    this.audioProcessor.StartContext()
    this.isContextStarted = true

    if (appId !== undefined) {
      this.send(JSON.stringify({ event: 'start', appId }))
    } else {
      this.send(JSON.stringify({ event: 'start' }))
    }
  }

  stopContext(): void {
    if (!this.audioProcessor) {
      throw Error('No AudioProcessor')
    }

    if (!this.isContextStarted) {
      console.error('[WebSocketClient]', "can't stop context: no active context")
      return
    }

    this.audioProcessor.StopContext()
    this.isContextStarted = false
    const StopEventJSON = JSON.stringify({ event: 'stop' })
    this.send(StopEventJSON)
  }

  switchContext(newAppId: string): void {
    if (!this.websocket) {
      throw Error('WebSocket is undefined')
    }

    if (!this.isContextStarted) {
      console.error('[WebSocketClient]', "can't switch context: no active context")
      return
    }

    if (newAppId === undefined) {
      console.error('[WebSocketClient]', "can't switch context: new app id is undefined")
      return
    }

    const StopEventJSON = JSON.stringify({ event: 'stop' })
    this.send(StopEventJSON)
    this.send(JSON.stringify({ event: 'start', appId: newAppId }))
  }

  closeWebsocket(websocketCode: number = 1005, reason: string = 'No Status Received'): void {
    if (this.debug) {
      console.log('[WebSocketClient]', 'Websocket closing')
    }

    if (!this.websocket) {
      throw Error('WebSocket is undefined')
    }

    this.websocket.close(websocketCode, reason)
  }

  // WebSocket's close handler, called e.g. when
  // - normal close (code 1000)
  // - network unreachable or unable to (re)connect (code 1006)
  // List of CloseEvent.code values: https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent/code
  private readonly onWebsocketClose = (event: CloseEvent): void => {
    if (!this.websocket) {
      throw Error('WebSocket is undefined')
    }

    if (this.debug) {
      console.log('[WebSocketClient]', 'onWebsocketClose')
    }

    this.websocket.removeEventListener('open', this.onWebsocketOpen)
    this.websocket.removeEventListener('message', this.onWebsocketMessage)
    this.websocket.removeEventListener('error', this.onWebsocketError)
    this.websocket.removeEventListener('close', this.onWebsocketClose)
    this.websocket = undefined

    this.workerCtx.postMessage({
      type: WorkerSignal.Closed,
      code: event.code,
      reason: event.reason,
      wasClean: event.wasClean,
    })
  }

  private readonly onWebsocketOpen = (_event: Event): void => {
    if (this.debug) {
      console.log('[WebSocketClient]', 'websocket opened')
    }

    this.workerCtx.postMessage({ type: WorkerSignal.Opened })
  }

  private readonly onWebsocketError = (_event: Event): void => {
    if (this.debug) {
      console.log('[WebSocketClient]', 'websocket error')
    }
  }

  private readonly onWebsocketMessage = (event: MessageEvent): void => {
    let response: WebsocketResponse
    try {
      response = JSON.parse(event.data)
    } catch (e) {
      console.error('[WebSocketClient]', 'error parsing response from the server:', e)
      return
    }

    this.workerCtx.postMessage(response)
  }

  send(data: string | Int16Array): void {
    if (!this.websocket) {
      throw new Error('No Websocket')
    }

    if (this.websocket.readyState !== this.websocket.OPEN) {
      throw new Error(`Expected OPEN Websocket state, but got ${this.websocket.readyState}`)
    }

    try {
      this.websocket.send(data)
    } catch (error) {
      console.log('[WebSocketClient]', 'server connection error', error)
    }
  }
}

const ctx: Worker = self as any
const websocketClient = new WebsocketClient(ctx)

ctx.onmessage = function (e) {
  switch (e.data.type) {
    case ControllerSignal.connect:
      websocketClient.connect(e.data.apiUrl, e.data.authToken, e.data.targetSampleRate, e.data.debug)
      break
    case ControllerSignal.initAudioProcessor:
      websocketClient.initAudioProcessor(e.data.sourceSampleRate, e.data.vadOptions)
      break
    case ControllerSignal.SET_SHARED_ARRAY_BUFFERS:
      websocketClient.setSharedArrayBuffers(e.data.controlSAB, e.data.dataSAB)
      break
    case ControllerSignal.CLOSE:
      websocketClient.closeWebsocket(1000, 'Close requested by client')
      break
    case ControllerSignal.START_CONTEXT:
      websocketClient.startContext(e.data.appId)
      break
    case ControllerSignal.SWITCH_CONTEXT:
      websocketClient.switchContext(e.data.appId)
      break
    case ControllerSignal.STOP_CONTEXT:
      websocketClient.stopContext()
      break
    case ControllerSignal.AUDIO:
      websocketClient.processAudio(e.data.payload)
      break
    default:
      console.log('WORKER', e)
  }
}

export default WebsocketClient
