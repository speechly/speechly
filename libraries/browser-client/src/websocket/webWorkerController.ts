import { APIClient, ResponseCallback, CloseCallback, WebsocketResponse, WebsocketResponseType, WorkerSignal, ControllerSignal } from './types'
import WebsocketClient from 'web-worker:./worker'
import { AudioProcessorParameters, ContextOptions, StreamOptions, VadOptions } from '../client'
import { WebsocketError } from '../speechly/types'

type ContextCallback = (err?: Error, contextId?: string) => void

/**
 * Controller to communicate with the web worker
 * @internal
 */
export class WebWorkerController implements APIClient {
  private readonly worker: Worker
  private onInitResolve?: () => void
  private onInitReject?: (result: WebsocketError) => void
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
    this.worker = new WebsocketClient()
    this.worker.addEventListener('message', this.onWebsocketMessage)
  }

  async initialize(apiUrl: string, authToken: string, targetSampleRate: number, debug: boolean): Promise<void> {
    this.worker.postMessage({
      type: ControllerSignal.connect,
      apiUrl,
      authToken,
      targetSampleRate,
      debug,
    })

    // Reset
    this.startCbs = []
    this.stopCbs = []

    return new Promise((resolve, reject) => {
      this.onInitResolve = () => {
        this.onInitResolve = undefined
        this.onInitReject = undefined
        resolve()
      }
      this.onInitReject = (err: WebsocketError) => {
        this.onInitResolve = undefined
        this.onInitReject = undefined
        reject(err) // Will throw WebsocketError in `await initialize()`
      }
    })
  }

  async initAudioProcessor(sourceSampleRate: number, frameMillis: number, historyFrames: number, vadOptions?: VadOptions): Promise<void> {
    this.worker.postMessage({
      type: ControllerSignal.initAudioProcessor,
      sourceSampleRate: sourceSampleRate,
      frameMillis: frameMillis,
      historyFrames: historyFrames,
      vadOptions: vadOptions,
    })

    return new Promise(resolve => {
      this.resolveSourceSampleRateSet = resolve
    })
  }

  /**
   * Control audio processor parameters
   * @param ap - Audio processor parameters to adjust
   */
  adjustAudioProcessor(ap: AudioProcessorParameters): void {
    this.worker.postMessage({
      type: ControllerSignal.adjustAudioProcessor,
      params: ap,
    })
  }

  async close(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.worker.postMessage({
        type: ControllerSignal.CLOSE,
        code: 1000,
        message: 'Client has ended the session',
      })
      resolve()
    })
  }

  async startStream(streamOptions: StreamOptions): Promise<void> {
    this.worker.postMessage({ type: ControllerSignal.startStream, streamOptions: streamOptions })
  }

  async stopStream(): Promise<void> {
    this.worker.postMessage({ type: ControllerSignal.stopStream })
  }

  async startContext(options?: ContextOptions): Promise<string> {
    return new Promise((resolve, reject) => {
      this.startCbs.push((err?, id?) => {
        if (err !== undefined) {
          reject(err)
        } else {
          resolve(id as string)
        }
      })

      this.worker.postMessage({ type: ControllerSignal.START_CONTEXT, options })
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

      this.worker.postMessage({ type: ControllerSignal.STOP_CONTEXT })
    })
  }

  async switchContext(options: ContextOptions): Promise<string> {
    return new Promise((resolve, reject) => {
      this.startCbs.push((err?, id?) => {
        if (err !== undefined) {
          reject(err)
        } else {
          resolve(id as string)
        }
      })
      this.worker.postMessage({ type: ControllerSignal.SWITCH_CONTEXT, options })
    })
  }

  postMessage(message: Object): void {
    this.worker.postMessage(message)
  }

  sendAudio(audioChunk: Float32Array): void {
    this.worker.postMessage({ type: ControllerSignal.AUDIO, payload: audioChunk })
  }

  async setContextOptions(options: ContextOptions): Promise<void> {
    this.worker.postMessage({ type: ControllerSignal.setContextOptions, options })
  }

  private readonly onWebsocketMessage = (event: MessageEvent): void => {
    const response: WebsocketResponse = event.data
    switch (response.type) {
      case WorkerSignal.Opened:
        if (this.onInitResolve) {
          this.onInitResolve()
        }
        break
      case WorkerSignal.Closed:
        const e = new WebsocketError(
          event.data.reason,
          event.data.code,
          event.data.wasClean,
        )
        if (this.onInitReject) {
          this.onInitReject(e)
        } else {
          this.onCloseCb(e)
        }
        break
      case WorkerSignal.AudioProcessorReady:
        if (this.resolveSourceSampleRateSet != null) {
          this.resolveSourceSampleRateSet()
        }
        break
      case WebsocketResponseType.Started:
        this.onResponseCb(response)
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
        this.onResponseCb(response)
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
