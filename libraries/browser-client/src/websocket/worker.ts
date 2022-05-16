import SpeechProcessor from '../audioprocessing/SpeechProcessor'
import EnergyTresholdVAD from '../audioprocessing/EnergyTresholdVAD'
import AudioTools from '../audioprocessing/AudioTools'
import { WebsocketResponseType, WorkerSignal } from './types'

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
  private apiUrl?: string
  private authToken?: string
  private websocket?: WebSocket
  private targetSampleRate: number = 16000
  private sourceSampleRate: number = 16000
  private readonly frameMillis = 30
  private resampleRatio: number = 1
  private isContextStarted: boolean = false
  private isStartContextConfirmed: boolean = false
  private controlSAB?: Int32Array
  private dataSAB?: Float32Array
  private speechProcessor?: SpeechProcessor

  private debug: boolean = false
  private readonly audioFrame: Int16Array = new Int16Array(this.frameMillis * this.targetSampleRate / 1000)

  constructor(ctx: Worker) {
    this.workerCtx = ctx
    this.initSpeechProcessor()
  }

  init(apiUrl: string, authToken: string, targetSampleRate: number, debug: boolean): void {
    this.debug = debug
    if (this.debug) {
      console.log('[WebSocketClient]', 'initialize worker')
    }
    this.apiUrl = apiUrl
    this.authToken = authToken
    this.targetSampleRate = targetSampleRate
    this.isContextStarted = false
    this.connect(0)
  }

  initSpeechProcessor(): void {
    this.speechProcessor = new SpeechProcessor(this.sourceSampleRate)
    const vad = new EnergyTresholdVAD()
    this.speechProcessor.Vad = vad

    this.speechProcessor.onSignalHigh = () => {
      console.log('onSignalHigh')
      this.workerCtx.postMessage({ type: WorkerSignal.VadSignalHigh })
    }
    this.speechProcessor.onSignalLow = () => {
      console.log('onSignalLow')
      this.workerCtx.postMessage({ type: WorkerSignal.VadSignalLow })
    }
    this.speechProcessor.SendAudio = (s, startIndex, length) => {
      AudioTools.ConvertFloatToInt16(s, this.audioFrame, startIndex, length)
      this.send(this.audioFrame)
    }
  }

  setSourceSampleRate(sourceSampleRate: number): void {
    if (this.sourceSampleRate !== sourceSampleRate) {
      this.sourceSampleRate = sourceSampleRate
      this.initSpeechProcessor()

      this.resampleRatio = this.sourceSampleRate / this.targetSampleRate
      if (this.debug) {
        console.log('[SpeechlyClient]', 'resampleRatio', this.resampleRatio)
      }

      if (isNaN(this.resampleRatio)) {
        throw Error(
          `resampleRatio is NaN source rate is ${this.sourceSampleRate} and target rate is ${this.targetSampleRate}`,
        )
      }
    }
    this.workerCtx.postMessage({ type: WorkerSignal.SourceSampleRateSetSuccess })
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

  connect(timeout: number = 1000): void {
    if (this.debug) {
      console.log('[WebSocketClient]', 'connect in ', timeout / 1000, 'sec')
    }
    setTimeout(this.initializeWebsocket.bind(this), timeout)
  }

  initializeWebsocket(): void {
    if (this.debug) {
      console.log('[WebSocketClient]', 'connecting to ', this.apiUrl)
    }
    this.websocket = new WebSocket(this.apiUrl, this.authToken)
    this.websocket.addEventListener('open', this.onWebsocketOpen)
    this.websocket.addEventListener('message', this.onWebsocketMessage)
    this.websocket.addEventListener('error', this.onWebsocketError)
    this.websocket.addEventListener('close', this.onWebsocketClose)
  }

  private isOpen(): boolean {
    return this.websocket !== undefined && this.websocket.readyState === this.websocket.OPEN
  }

  sendAudio(audioChunk: Float32Array): void {
    this.speechProcessor.ProcessAudio(audioChunk)
    /*
    if (!this.isContextStarted) {
      return
    }

    if (audioChunk.length > 0) {
      if (this.resampleRatio > 1) {
        // Downsampling
        this.send(this.downsample(audioChunk))
      } else {
        this.send(float32ToInt16(audioChunk))
      }
    }
    */
  }

  sendAudioFromSAB(): void {
    if (!this.controlSAB || !this.dataSAB) {
      return
    }

    if (!this.isContextStarted) {
      this.controlSAB[CONTROL.FRAMES_AVAILABLE] = 0
      this.controlSAB[CONTROL.WRITE_INDEX] = 0
      return
    }

    const framesAvailable = this.controlSAB[CONTROL.FRAMES_AVAILABLE]
    const lock = this.controlSAB[CONTROL.LOCK]

    if (lock === 0 && framesAvailable > 0) {
      const data = this.dataSAB.subarray(0, framesAvailable)
      this.controlSAB[CONTROL.FRAMES_AVAILABLE] = 0
      this.controlSAB[CONTROL.WRITE_INDEX] = 0
      if (data.length > 0) {
        this.speechProcessor.ProcessAudio(data)
        /*
        let frames: Int16Array
        if (this.resampleRatio > 1) {
          frames = this.downsample(data)
        } else {
          frames = float32ToInt16(data)
        }
        this.send(frames)

        // 16000 per second, 1000 in 100 ms
        // save last 250 ms
        if (this.lastFramesSent.length > 1024 * 4) {
          this.lastFramesSent = frames
        } else {
          const concat = new Int16Array(this.lastFramesSent.length + frames.length)
          concat.set(this.lastFramesSent)
          concat.set(frames, this.lastFramesSent.length)
          this.lastFramesSent = concat
        }
        */
      }
    }
  }

  startContext(appId?: string): void {
    if (this.isContextStarted) {
      console.error('[WebSocketClient]', "can't start context: active context exists")
      return
    }

    this.speechProcessor.StartContext()
    this.isContextStarted = true
    this.isStartContextConfirmed = false

    if (appId !== undefined) {
      this.send(JSON.stringify({ event: 'start', appId }))
    } else {
      this.send(JSON.stringify({ event: 'start' }))
    }
  }

  stopContext(): void {
    if (!this.websocket) {
      throw Error('WebSocket is undefined')
    }

    if (!this.isContextStarted) {
      console.error('[WebSocketClient]', "can't stop context: no active context")
      return
    }

    this.speechProcessor.StopContext()
    this.isContextStarted = false
    this.isStartContextConfirmed = false
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

    this.isStartContextConfirmed = false
    const StopEventJSON = JSON.stringify({ event: 'stop' })
    this.send(StopEventJSON)
    // @TODO this.shouldResendLastFramesSent = true // Indicates some history buffer should be re-sent
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

    if (response.type === WebsocketResponseType.Started) {
      this.isStartContextConfirmed = true
    }

    this.workerCtx.postMessage(response)
  }

  send(data: string | Int16Array): void {
    if (this.isOpen()) {
      try {
        this.websocket.send(data)
      } catch (error) {
        console.log('[WebSocketClient]', 'server connection error', error)
      }
    }
  }
}

const ctx: Worker = self as any
const websocketClient = new WebsocketClient(ctx)

ctx.onmessage = function (e) {
  switch (e.data.type) {
    case 'INIT':
      websocketClient.init(e.data.apiUrl, e.data.authToken, e.data.targetSampleRate, e.data.debug)
      break
    case 'SET_SOURCE_SAMPLE_RATE':
      websocketClient.setSourceSampleRate(e.data.sourceSampleRate)
      break
    case 'SET_SHARED_ARRAY_BUFFERS':
      websocketClient.setSharedArrayBuffers(e.data.controlSAB, e.data.dataSAB)
      break
    case 'CLOSE':
      websocketClient.closeWebsocket(1000, 'Close requested by client')
      break
    case 'START_CONTEXT':
      websocketClient.startContext(e.data.appId)
      break
    case 'SWITCH_CONTEXT':
      websocketClient.switchContext(e.data.appId)
      break
    case 'STOP_CONTEXT':
      websocketClient.stopContext()
      break
    case 'AUDIO':
      websocketClient.sendAudio(e.data.payload)
      break
    default:
      console.log('WORKER', e)
  }
}

export default WebsocketClient
