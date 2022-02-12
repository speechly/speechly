import { APIClient, ResponseCallback, CloseCallback, WebsocketResponse, WebsocketResponseType } from './types'
import worker from './worker'

type ContextCallback = (err?: Error, contextId?: string) => void

export class WebWorkerController implements APIClient {
  private readonly worker: Worker
  private resolveInitialization?: (value?: void) => void
  private resolveSourceSampleRateSet?: (value?: void) => void

  private startCbs: ContextCallback[] = []
  private stopCbs: ContextCallback[] = []
  private onResponseCb: ResponseCallback = () => {}
  private onCloseCb: CloseCallback = () => {}

  onResponse(cb: ResponseCallback): void {
    this.onResponseCb = cb
  }

  onClose(cb: CloseCallback): void {
    this.onCloseCb = cb
  }

  constructor() {
    const blob = new Blob([worker], { type: 'text/javascript' })
    const blobURL = window.URL.createObjectURL(blob)
    this.worker = new Worker(blobURL)
    this.worker.addEventListener('message', this.onWebsocketMessage)
  }

  async initialize(apiUrl: string, authToken: string, targetSampleRate: number, debug: boolean): Promise<void> {
    this.worker.postMessage({
      type: 'INIT',
      apiUrl,
      authToken,
      targetSampleRate,
      debug,
    })

    // Reset
    this.startCbs = []
    this.stopCbs = []

    return new Promise(resolve => {
      this.resolveInitialization = resolve
    })
  }

  async setSourceSampleRate(sourceSampleRate: number): Promise<void> {
    this.worker.postMessage({
      type: 'SET_SOURSE_SAMPLE_RATE',
      sourceSampleRate,
    })

    return new Promise(resolve => {
      this.resolveSourceSampleRateSet = resolve
    })
  }

  async close(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.worker.postMessage({
        type: 'CLOSE',
        code: 1000,
        message: 'Client has ended the session',
      })
      resolve()
    })
  }

  async startContext(appId?: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this.startCbs.push((err?, id?) => {
        if (err !== undefined) {
          reject(err)
        } else {
          resolve(id as string)
        }
      })
      if (appId != null) {
        this.worker.postMessage({ type: 'START_CONTEXT', appId })
      } else {
        this.worker.postMessage({ type: 'START_CONTEXT' })
      }
    })
  }

  async stopContext(): Promise<string> {
    return new Promise((resolve, reject) => {
      this.stopCbs.push((err?, id?) => {
        if (err !== undefined) {
          reject(err)
        } else {
          resolve(id as string)
        }
      })

      this.worker.postMessage({ type: 'STOP_CONTEXT' })
    })
  }

  async switchContext(appId: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this.startCbs.push((err?, id?) => {
        if (err !== undefined) {
          reject(err)
        } else {
          resolve(id as string)
        }
      })
      this.worker.postMessage({ type: 'SWITCH_CONTEXT', appId })
    })
  }

  postMessage(message: Object): void {
    this.worker.postMessage(message)
  }

  sendAudio(audioChunk: Float32Array): void {
    this.worker.postMessage({ type: 'AUDIO', payload: audioChunk })
  }

  private readonly onWebsocketMessage = (event: MessageEvent): void => {
    const response: WebsocketResponse = event.data
    switch (response.type) {
      case WebsocketResponseType.Opened:
        if (this.resolveInitialization != null) {
          this.resolveInitialization()
        }
        break
      case WebsocketResponseType.Closed:
        this.onCloseCb({
          code: event.data.code,
          reason: event.data.reason,
          wasClean: event.data.wasClean,
        })
        break
      case WebsocketResponseType.SourceSampleRateSetSuccess:
        if (this.resolveSourceSampleRateSet != null) {
          this.resolveSourceSampleRateSet()
        }
        break
      case WebsocketResponseType.Started:
        this.startCbs.forEach(cb => {
          try {
            cb(undefined, response.audio_context)
          } catch (e) {
            console.error('[SpeechlyClient] Error while invoking "onStart" callback:', e)
          }
        })
        this.startCbs.length = 0
        break
      case WebsocketResponseType.Stopped:
        this.stopCbs.forEach(cb => {
          try {
            cb(undefined, response.audio_context)
          } catch (e) {
            console.error('[SpeechlyClient] Error while invoking "onStop" callback:', e)
          }
        })
        this.stopCbs.length = 0
        break
      default:
        this.onResponseCb(response)
    }
  }
}
