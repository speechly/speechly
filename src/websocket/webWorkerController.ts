import { APIClient, ResponseCallback, CloseCallback, WebsocketResponse, WebsocketResponseType } from './types'
import worker from './worker'

type ContextCallback = (err?: Error, contextId?: string) => void

export class WebWorkerController implements APIClient {
  private readonly apiUrl: string

  private authToken?: string
  private worker?: Worker
  private resolveInitialization?: (value?: void) => void

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

  constructor(apiUrl: string) {
    this.apiUrl = apiUrl
  }

  async initialize(token: string, sourceSampleRate: number, targetSampleRate: number): Promise<void> {
    this.authToken = token
    if (this.worker !== undefined) {
      throw Error('Cannot initialize an already initialized worker')
    }

    const blob = new Blob([worker], { type: 'text/javascript' })
    const blobURL = window.URL.createObjectURL(blob)
    this.worker = new Worker(blobURL)
    this.worker.postMessage({
      type: 'INIT',
      apiUrl: this.apiUrl,
      authToken: this.authToken,
      sourceSampleRate,
      targetSampleRate,
    })

    if (this.worker != null) {
      this.worker.addEventListener('message', this.onWebsocketMessage)
    }

    return new Promise((resolve) => {
      this.resolveInitialization = resolve
    })
  }

  async close(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.worker != null) {
        this.worker.postMessage({
          type: 'CLOSE',
          code: 1000,
          message: 'Client has ended the session',
        })
        resolve()
      }
    })
  }

  async startContext(): Promise<string> {
    return new Promise((resolve, reject) => {
      this.startCbs.push((err?, id?) => {
        if (err !== undefined) {
          reject(err)
        } else {
          resolve(id as string)
        }
      })

      this.worker?.postMessage({ type: 'START_CONTEXT' })
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

      this.worker?.postMessage({ type: 'STOP_CONTEXT' })
    })
  }

  postMessage(message: Object): void {
    this.worker?.postMessage(message)
  }

  sendAudio(audioChunk: Float32Array): void {
    this.worker?.postMessage({ type: 'AUDIO', payload: audioChunk })
  }

  private readonly onWebsocketMessage = (event: MessageEvent): void => {
    const response: WebsocketResponse = event.data
    switch (response.type) {
      case WebsocketResponseType.Opened:
        if (this.resolveInitialization != null) {
          this.resolveInitialization()
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
