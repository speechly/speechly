import AudioProcessor from '../audioprocessing/AudioProcessor'
import EnergyThresholdVAD from '../audioprocessing/EnergyThresholdVAD'
import AudioTools from '../audioprocessing/AudioTools'
import { ControllerSignal, WebsocketResponse, WebsocketResponseType, WorkerSignal, StartContextParams } from './types'
import { AudioProcessorParameters, ContextOptions, StreamOptions, VadOptions } from '../client'

const CONTROL = {
  WRITE_INDEX: 0,
  FRAMES_AVAILABLE: 1,
  LOCK: 2,
}

/**
 * Web worker to handle streaming audio to cloud and receiving speech processing results.
 * Also handles audio processing like maintaining history ringbuffer and running the VAD
 * @internal
 */
class WebsocketClient {
  private readonly workerCtx: Worker
  private targetSampleRate: number = 16000
  private isContextStarted: boolean = false
  private audioContextStartTimes: number[] = []
  private websocket?: WebSocket
  private audioProcessor?: AudioProcessor
  private controlSAB?: Int32Array
  private dataSAB?: Float32Array

  private immediateMode = false
  private readonly frameMillis = 30
  private readonly outputAudioFrame: Int16Array = new Int16Array(this.frameMillis * this.targetSampleRate / 1000)

  private debug: boolean = false

  private defaultContextOptions?: ContextOptions

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

  initAudioProcessor(sourceSampleRate: number, frameMillis: number, historyFrames: number, vadOptions?: VadOptions): void {
    this.audioProcessor = new AudioProcessor(sourceSampleRate, this.targetSampleRate, frameMillis, historyFrames)

    if (vadOptions) {
      this.audioProcessor.vad = new EnergyThresholdVAD(frameMillis, vadOptions)

      this.audioProcessor.onVadStateChange = (isSignalDetected: boolean) => {
        const currentVadOptions = this.audioProcessor?.vad?.vadOptions
        if (!currentVadOptions) return

        if (isSignalDetected) {
          if (!this.immediateMode) {
            this.workerCtx.postMessage({ type: WorkerSignal.VadSignalHigh })
          } else if (currentVadOptions.controlListening) {
            this.startContext(this.defaultContextOptions)
          }
        }

        if (!isSignalDetected) {
          if (!this.immediateMode) {
            this.workerCtx.postMessage({ type: WorkerSignal.VadSignalLow })
          } else if (currentVadOptions.controlListening) {
            this.stopContext()
          }
        }
      }
    }

    this.audioProcessor.onSendAudio = (floats: Float32Array, startIndex: number, length: number) => {
      AudioTools.convertFloatToInt16(floats, this.outputAudioFrame, startIndex, length)
      this.send(this.outputAudioFrame)
    }

    if (this.workerCtx === undefined) return
    this.workerCtx.postMessage({ type: WorkerSignal.AudioProcessorReady })
  }

  /**
   * Control audio processor parameters
   * @param ap - Audio processor parameters to adjust
   */
  adjustAudioProcessor(ap: AudioProcessorParameters): void {
    if (this.audioProcessor && ap.vad) {
      if (!this.audioProcessor.vad) {
        throw new Error('No VAD in AudioProcessor. Did you define `vad` in BrowserClient constructor parameters?')
      }
      this.audioProcessor.vad.adjustVadOptions(ap.vad)
    }
  }

  setSharedArrayBuffers(controlSAB: number, dataSAB: number): void {
    this.controlSAB = new Int32Array(controlSAB)
    this.dataSAB = new Float32Array(dataSAB)
    const audioHandleInterval = this.dataSAB.length / 32 // ms
    if (this.debug) {
      console.log('[WebSocketClient]', 'Audio handle interval', audioHandleInterval, 'ms')
    }
    setInterval(this.processAudioSAB.bind(this), audioHandleInterval)
  }

  startStream(streamOptions: StreamOptions): void {
    if (!this.audioProcessor) {
      throw new Error('No AudioProcessor')
    }

    this.immediateMode = streamOptions.immediate
    this.audioProcessor.reset(streamOptions.sampleRate)
    this.audioContextStartTimes = []
  }

  stopStream(): void {
    if (!this.audioProcessor) {
      throw new Error('No AudioProcessor')
    }

    // Send EOS. Ensure VAD will go off at end of stream and stopContext is called in immediate mode
    this.audioProcessor.eos()
  }

  /**
   * Processes and sends audio
   * @param audioChunk - audio data to process
   */
  processAudio(audioChunk: Float32Array): void {
    if (!this.audioProcessor) {
      throw new Error('No AudioProcessor')
    }

    this.audioProcessor.processAudio(audioChunk)
  }

  processAudioSAB(): void {
    if (!this.controlSAB || !this.dataSAB) {
      throw new Error('No SharedArrayBuffers')
    }

    const framesAvailable = this.controlSAB[CONTROL.FRAMES_AVAILABLE]
    const lock = this.controlSAB[CONTROL.LOCK]

    if (lock === 0 && framesAvailable > 0) {
      const data = this.dataSAB.subarray(0, framesAvailable)
      this.controlSAB[CONTROL.FRAMES_AVAILABLE] = 0
      this.controlSAB[CONTROL.WRITE_INDEX] = 0
      if (data.length > 0) {
        this.processAudio(data)
      }
    }
  }

  startContext(contextOptions?: ContextOptions): void {
    if (!this.audioProcessor) {
      throw Error('No AudioProcessor')
    }

    if (this.isContextStarted) {
      console.error('[WebSocketClient]', "can't start context: active context exists")
      return
    }

    this.audioProcessor.setSendAudio(true)
    this.isContextStarted = true
    this.audioContextStartTimes.push(this.audioProcessor.getStreamPosition())

    this.workerCtx.postMessage({ type: WorkerSignal.RequestContextStart })

    let options: ContextOptions = this.defaultContextOptions ?? {}
    if (contextOptions !== undefined) {
      options = { ...options, ...contextOptions }
    }
    const message = contextOptionsToMsg(options)
    message.event = 'start'
    this.send(JSON.stringify(message))
  }

  stopContext(): void {
    if (!this.audioProcessor) {
      throw Error('No AudioProcessor')
    }

    if (!this.isContextStarted) {
      console.error('[WebSocketClient]', "can't stop context: no active context")
      return
    }

    this.audioProcessor.setSendAudio(false)
    this.isContextStarted = false

    const StopEventJSON = JSON.stringify({ event: 'stop' })
    this.send(StopEventJSON)
  }

  switchContext(contextOptions?: ContextOptions): void {
    if (!this.websocket) {
      throw Error('WebSocket is undefined')
    }

    if (!this.isContextStarted) {
      console.error('[WebSocketClient]', "can't switch context: no active context")
      return
    }

    if (contextOptions?.appId === undefined) {
      console.error('[WebSocketClient]', "can't switch context: new app id is undefined")
      return
    }

    const StopEventJSON = JSON.stringify({ event: 'stop' })
    this.send(StopEventJSON)
    const message = contextOptionsToMsg(contextOptions)
    message.event = 'start'
    this.send(JSON.stringify(message))
  }

  closeWebsocket(code: number = 1005, reason: string = 'No Status Received', wasClean: boolean = true, userInitiated: boolean = true): void {
    if (!this.websocket) {
      console.warn('WebSocket already closed')
      return
    } else if (this.debug) {
      console.log('[WebSocketClient]', userInitiated ? 'Websocket close requested' : 'Websocket closed')
    }

    // Reset audioprocessor so it won't try to send audio the first thing when reconnect happens. This will lead to a reconnect loop.
    this.audioProcessor?.reset()

    // We don't want any more messages from the closing websocket
    this.websocket.removeEventListener('open', this.onWebsocketOpen)
    this.websocket.removeEventListener('message', this.onWebsocketMessage)
    this.websocket.removeEventListener('error', this.onWebsocketError)
    this.websocket.removeEventListener('close', this.onWebsocketClose)

    // If we're here due to a call to onWebSocket
    if (userInitiated) {
      this.websocket.close(code, reason)
    }

    this.websocket = undefined

    this.workerCtx.postMessage({
      type: WorkerSignal.Closed,
      code,
      reason,
      wasClean,
    })
  }

  // WebSocket's close handler, called when encountering a non user-initiated close, e.g.
  // - network unreachable or unable to (re)connect (code 1006)
  // List of CloseEvent.code values: https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent/code
  private readonly onWebsocketClose = (event: CloseEvent): void => {
    if (this.debug) {
      console.log('[WebSocketClient]', 'onWebsocketClose')
    }

    this.closeWebsocket(event.code, event.reason, event.wasClean, false)
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
      // Append client-side metadata to the backend message
      let audioContextStartTime = this.audioContextStartTimes.shift()
      if (audioContextStartTime === undefined) {
        console.warn('No valid value for contextStartMillis')
        audioContextStartTime = 0
      }
      const startContextParams: StartContextParams = {
        audioStartTimeMillis: audioContextStartTime,
      }
      response.params = startContextParams
    }

    this.workerCtx.postMessage(response)
  }

  send(data: string | Int16Array): void {
    if (!this.websocket) {
      throw new Error('No Websocket')
    }

    if (this.websocket.readyState !== this.websocket.OPEN) {
      console.warn(`Expected OPEN Websocket state, but got ${this.websocket.readyState}`)
      return
    }

    try {
      this.websocket.send(data)
    } catch (error) {
      console.log('[WebSocketClient]', 'server connection error', error)
    }
  }

  setContextOptions(options: ContextOptions): void {
    this.defaultContextOptions = options
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
      websocketClient.initAudioProcessor(e.data.sourceSampleRate, e.data.frameMillis, e.data.historyFrames, e.data.vadOptions)
      break
    case ControllerSignal.adjustAudioProcessor:
      websocketClient.adjustAudioProcessor(e.data.params)
      break
    case ControllerSignal.SET_SHARED_ARRAY_BUFFERS:
      websocketClient.setSharedArrayBuffers(e.data.controlSAB, e.data.dataSAB)
      break
    case ControllerSignal.CLOSE:
      websocketClient.closeWebsocket(1000, 'Close requested by client', true, true)
      break
    case ControllerSignal.startStream:
      websocketClient.startStream(e.data.streamOptions)
      break
    case ControllerSignal.stopStream:
      websocketClient.stopStream()
      break
    case ControllerSignal.START_CONTEXT:
      websocketClient.startContext(e.data.options)
      break
    case ControllerSignal.SWITCH_CONTEXT:
      websocketClient.switchContext(e.data.options)
      break
    case ControllerSignal.STOP_CONTEXT:
      websocketClient.stopContext()
      break
    case ControllerSignal.AUDIO:
      websocketClient.processAudio(e.data.payload)
      break
    case ControllerSignal.setContextOptions:
      websocketClient.setContextOptions(e.data.options)
      break
    default:
      console.log('WORKER', e)
  }
}

export function contextOptionsToMsg(contextOptions?: ContextOptions): Record<string, any> {
  const message: Record<string, any> = {
    options: {
      timezone: [Intl.DateTimeFormat().resolvedOptions().timeZone],
    },
  }
  if (contextOptions === undefined) return message
  message.options.vocabulary = contextOptions.vocabulary
  message.options.vocabulary_bias = contextOptions.vocabularyBias
  message.options.silence_triggered_segmentation = contextOptions.silenceTriggeredSegmentation

  if (contextOptions.nonStreamingNlu) {
    message.options.non_streaming_nlu = ['yes']
  } else {
    message.options.non_streaming_nlu = ['no']
  }

  if (contextOptions?.timezone !== undefined) {
    message.options.timezone = contextOptions?.timezone // override browser timezone
  }
  if (contextOptions.appId !== undefined) {
    message.appId = contextOptions.appId
  }
  return message
}

export default WebsocketClient
