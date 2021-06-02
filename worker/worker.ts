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

/**
 * Known WebSocket response types.
 * @public
 */
enum WebsocketResponseType {
  Opened = 'WEBSOCKET_OPEN',
  SourceSampleRateSetSuccess = 'SOURSE_SAMPLE_RATE_SET_SUCCESS',
  Started = 'started',
  Stopped = 'stopped',
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
  private targetSampleRate?: number
  private sourceSampleRate?: number
  private resampleRatio?: number
  private filter?: Float32Array
  private isContextStarted: boolean = false
  private isStartContextConfirmed: boolean = false
  private shouldResendLastFramesSent: boolean = false
  private controlSAB?: Int32Array
  private dataSAB?: Float32Array

  private buffer: Float32Array = new Float32Array(0)
  private lastFramesSent: Int16Array = new Int16Array(0) // to re-send after switch context

  private debug: boolean = false
  private initialized: boolean = false

  constructor(ctx: Worker) {
    this.workerCtx = ctx
  }

  init(apiUrl: string, authToken: string, targetSampleRate: number, debug: boolean): void {
    if (this.initialized) {
      console.log('[SpeechlyClient]', 'already initialized')
      return 
    }

    this.debug = debug
    if (this.debug) {
      console.log('[SpeechlyClient]', 'initialize worker')
    }
    this.apiUrl = apiUrl
    this.authToken = authToken
    this.targetSampleRate = targetSampleRate
    this.initialized = true
    this.connect(0)
  }

  setSourceSampleRate(sourceSampleRate: number): void {
    this.sourceSampleRate = sourceSampleRate
    this.resampleRatio = this.sourceSampleRate / this.targetSampleRate
    if (this.debug) {
      console.log('[SpeechlyClient]', 'resampleRatio', this.resampleRatio)
    }
    if (this.resampleRatio > 1) {
      this.filter = generateFilter(this.sourceSampleRate, this.targetSampleRate, 127)
    }
    this.workerCtx.postMessage({ type: 'SOURSE_SAMPLE_RATE_SET_SUCCESS' })

    if (isNaN(this.resampleRatio)) {
      throw Error('resampleRatio is NaN')
    }
  }

  setSharedArrayBuffers(controlSAB, dataSAB): void {
    this.controlSAB = new Int32Array(controlSAB)
    this.dataSAB = new Float32Array(dataSAB)
    const audioHandleInterval = this.dataSAB.length / 32 // ms
    if (this.debug) {
      console.log('[SpeechlyClient]', 'Audio handle interval', audioHandleInterval, 'ms')
    }
    setInterval(this.sendAudioFromSAB.bind(this), audioHandleInterval)
  }

  connect(timeout: number = 1000) {
    if (this.debug) {
      console.log('[SpeechlyClient]', 'connect in ', timeout / 1000, 'sec')
    }
    setTimeout(this.initializeWebsocket.bind(this), timeout)
  }

  initializeWebsocket() {
    if (this.debug) {
      console.log('[SpeechlyClient]', 'connecting to ', this.apiUrl)
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

  private resendLastFrames(): void | Error {
    if (!this.isOpen()) {
      return Error('Cannot resend data through inactive websocket')
    }

    if (this.lastFramesSent.length > 0) {
      this.websocket.send(this.lastFramesSent)
      this.lastFramesSent = new Int16Array(0)
    }
  }

  sendAudio(audioChunk: Float32Array) {
    if (!this.isContextStarted) {
      return
    }

    if (!this.isOpen()) {
      return Error('Cannot send data through inactive websocket')
    }

    if (audioChunk.length > 0) {
      if (this.resampleRatio > 1) {
        // Downsampling
        this.websocket.send(this.downsample(audioChunk))
      } else {
        this.websocket.send(float32ToInt16(audioChunk))
      }
    }
  }

  sendAudioFromSAB() {
    if (!this.isContextStarted) {
      this.controlSAB[CONTROL.FRAMES_AVAILABLE] = 0
      this.controlSAB[CONTROL.WRITE_INDEX] = 0
      return
    }

    if (this.controlSAB == undefined) {
      return
    }

    let framesAvailable = this.controlSAB[CONTROL.FRAMES_AVAILABLE]
    let lock = this.controlSAB[CONTROL.LOCK]

    if (lock == 0 && framesAvailable > 0) {
      const data = this.dataSAB.subarray(0, framesAvailable)
      this.controlSAB[CONTROL.FRAMES_AVAILABLE] = 0
      this.controlSAB[CONTROL.WRITE_INDEX] = 0
      if (data.length > 0) {
        let frames: Int16Array
        if (this.resampleRatio > 1) {
          frames = this.downsample(data)
        } else {
          frames = float32ToInt16(data)
        }
        this.websocket.send(frames)
  
        // 16000 per second, 1000 in 100 ms
        // save last 250 ms
        if (this.lastFramesSent.length > 1024 * 4) {
          this.lastFramesSent = frames
        } else {
          let concat = new Int16Array(this.lastFramesSent.length + frames.length)
          concat.set(this.lastFramesSent)
          concat.set(frames, this.lastFramesSent.length)
          this.lastFramesSent = concat
        }
      }
    }
  }

  startContext(appId?: string) {
    if (!this.isOpen()) {
      throw Error('Cant start context: websocket is inactive')
    }
    if (this.isContextStarted) {
      console.log('Cant start context: it has been already started')
      return
    }

    this.isContextStarted = true
    this.isStartContextConfirmed = false

    if (appId !== undefined) {
      this.websocket.send(JSON.stringify({ event: 'start', appId }))
    } else {
      this.websocket.send(JSON.stringify({ event: 'start' }))
    }
  }

  stopContext() {
    if (this.websocket == undefined) {
      throw Error('Cant start context: websocket is undefined')
    }

    if (!this.isContextStarted) {
      console.log('Cant stop context: it is not started')
      return
    }

    this.isContextStarted = false
    this.isStartContextConfirmed = false
    const StopEventJSON = JSON.stringify({ event: 'stop' })
    this.websocket.send(StopEventJSON)
  }

  switchContext(newAppId: string) {
    if (this.websocket == undefined) {
      throw Error('Cant switch context: websocket is undefined')
    }

    if (!this.isContextStarted) {
      console.log('Cant switch context: it is not started')
      return
    }

    if (newAppId == undefined) {
      console.log('Cant switch context: new app id is undefined')
      return
    }

    this.isStartContextConfirmed = false
    const StopEventJSON = JSON.stringify({ event: 'stop' })
    this.websocket.send(StopEventJSON)
    this.shouldResendLastFramesSent = true
    this.websocket.send(JSON.stringify({ event: 'start', appId: newAppId }))
  }

  closeWebsocket() {
    if (this.websocket == null) {
      throw Error('Websocket is not open')
    }
  
    this.websocket.removeEventListener('open', this.onWebsocketOpen)
    this.websocket.removeEventListener('message', this.onWebsocketMessage)
    this.websocket.removeEventListener('error', this.onWebsocketError)
    this.websocket.removeEventListener('close', this.onWebsocketClose)
  
    this.websocket.close()
  }

  private readonly onWebsocketClose = (event: CloseEvent): void => {
    this.websocket = undefined
    this.connect(0)
  }

  private readonly onWebsocketOpen = (_event: Event): void => {
    if (this.debug) {
      console.log('[SpeechlyClient]', 'websocket opened')
    }
    this.workerCtx.postMessage({ type: 'WEBSOCKET_OPEN' })
  }

  private readonly onWebsocketError = (_event: Event): void => {
    if (this.debug) {
      console.log('[SpeechlyClient]', 'websocket error')
    }
    this.closeWebsocket()
  }

  private readonly onWebsocketMessage = (event: MessageEvent): void => {
    let response: WebsocketResponse
    try {
      response = JSON.parse(event.data)
    } catch (e) {
      console.error('[SpeechlyClient] Error parsing response from the server:', e)
      return
    }

    if (response.type === WebsocketResponseType.Started) {
      this.isStartContextConfirmed = true
      if (this.shouldResendLastFramesSent) {
        this.resendLastFrames()
        this.shouldResendLastFramesSent = false
      }
    }
  
    this.workerCtx.postMessage(response)
  }

  downsample(input: Float32Array): Int16Array {
    const inputBuffer = new Float32Array(this.buffer.length + input.length)
    inputBuffer.set(this.buffer, 0)
    inputBuffer.set(input, this.buffer.length)
  
    const outputLength = Math.ceil((inputBuffer.length - this.filter.length) / this.resampleRatio)
    const outputBuffer = new Int16Array(outputLength)
  
    for (let i = 0; i < outputLength; i++) {
      const offset = Math.round(this.resampleRatio * i)
      let val = 0.0
  
      for (let j = 0; j < this.filter.length; j++) {
        val += inputBuffer[offset + j] * this.filter[j]
      }
  
      outputBuffer[i] = val * (val < 0 ? 0x8000 : 0x7fff)
    }
  
    const remainingOffset = Math.round(this.resampleRatio * outputLength)
    if (remainingOffset < inputBuffer.length) {
      this.buffer = inputBuffer.subarray(remainingOffset)
    } else {
      this.buffer = new Float32Array(0)
    }
  
    return outputBuffer
  }

}

const ctx: Worker = self as any
const websocketClient = new WebsocketClient(ctx)

ctx.onmessage = function(e) {
  switch (e.data.type) {
    case 'INIT':
      websocketClient.init(e.data.apiUrl, e.data.authToken, e.data.targetSampleRate, e.data.debug)
      break
    case 'SET_SOURSE_SAMPLE_RATE':
      websocketClient.setSourceSampleRate(e.data.sourceSampleRate)
      break
    case 'SET_SHARED_ARRAY_BUFFERS':
      websocketClient.setSharedArrayBuffers(e.data.controlSAB, e.data.dataSAB)
      break
    case 'CLOSE':
      websocketClient.closeWebsocket()
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

function float32ToInt16(buffer) {
  const buf = new Int16Array(buffer.length)

  for (let l = 0; l < buffer.length; l++) {
    buf[l] = buffer[l] * (buffer[l] < 0 ? 0x8000 : 0x7fff)
  }

  return buf
}

function generateFilter(sourceSampleRate: number, targetSampleRate: number, length: number): Float32Array {
  if (length % 2 === 0) {
    throw Error('Filter length must be odd')
  }

  const cutoff = targetSampleRate / 2
  const filter = new Float32Array(length)
  let sum = 0

  for (let i = 0; i < length; i++) {
    const x = sinc(((2 * cutoff) / sourceSampleRate) * (i - (length - 1) / 2))

    sum += x
    filter[i] = x
  }

  for (let i = 0; i < length; i++) {
    filter[i] = filter[i] / sum
  }

  return filter
}

function sinc(x: number): number {
  if (x === 0.0) {
    return 1.0
  }

  const piX = Math.PI * x
  return Math.sin(piX) / piX
}
