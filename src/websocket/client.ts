import { ContextCallback, ErrorCallback } from '../types'
import { WebsocketClient, ResponseCallback, CloseCallback, WebsocketResponse, WebsocketResponseType } from './types'

export class Websocket implements WebsocketClient {
  private readonly baseUrl: string
  private readonly languageCode: string
  private readonly sampleRate: number
  private readonly appId: string
  private websocket?: WebSocket

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

  constructor(baseUrl: string, appId: string, language: string, sampleRate: number) {
    this.baseUrl = baseUrl
    this.languageCode = language
    this.sampleRate = sampleRate
    this.appId = appId
  }

  initialize(deviceId: string, cb: ErrorCallback): void {
    if (this.websocket !== undefined) {
      return cb(Error('Cannot initialize an already initialized websocket client'))
    }

    const url = generateWsUrl(this.baseUrl, deviceId, this.languageCode, this.sampleRate)
    initializeWebsocket(url, this.appId, (err, ws) => {
      if (err !== undefined) {
        return cb(err)
      }

      this.websocket = ws as WebSocket
      this.websocket.addEventListener('message', this.onWebsocketMessage)
      this.websocket.addEventListener('error', this.onWebsocketError)
      this.websocket.addEventListener('close', this.onWebsocketClose)

      return cb()
    })
  }

  close(closeCode: number, closeReason: string): Error | void {
    if (this.websocket === undefined) {
      return Error('Websocket is not open')
    }

    this.websocket.removeEventListener('message', this.onWebsocketMessage)
    this.websocket.removeEventListener('error', this.onWebsocketError)
    this.websocket.removeEventListener('close', this.onWebsocketClose)

    this.websocket.close(closeCode, closeReason)
    this.websocket = undefined
  }

  start(cb: ContextCallback): void {
    if (!this.isOpen()) {
      return cb(Error('Websocket is not ready'))
    }

    this.startCbs.push(cb)
    const ws = this.websocket as WebSocket
    ws.send(StartEventJSON)
  }

  stop(cb: ContextCallback): void {
    if (!this.isOpen()) {
      return cb(new Error('websocket is not ready'))
    }

    this.stopCbs.push(cb)
    const ws = this.websocket as WebSocket
    ws.send(StopEventJSON)
  }

  send(data: ArrayBuffer): Error | void {
    if (!this.isOpen()) {
      return Error('Cannot send data through inactive websocket')
    }

    const ws = this.websocket as WebSocket
    ws.send(data)
  }

  private isOpen(): boolean {
    return this.websocket !== undefined && this.websocket.readyState === this.websocket.OPEN
  }

  private readonly onWebsocketMessage = (event: MessageEvent): void => {
    let response: WebsocketResponse
    try {
      response = JSON.parse(event.data)
    } catch (e) {
      console.error('[SpeechlyClient] Error parsing response from the server:', e)
      return
    }

    switch (response.type) {
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

  private readonly onWebsocketClose = (event: CloseEvent): void => {
    this.onCloseCb(Error(`Websocket was closed: ${event.reason}`))
  }

  private readonly onWebsocketError = (event: Event): void => {
    this.close(1000, 'Client disconnecting due to an error')
    this.onCloseCb(Error('Websocket was closed because of error'))
  }
}

const StartEventJSON = JSON.stringify({ event: 'start' })
const StopEventJSON = JSON.stringify({ event: 'stop' })

function generateWsUrl(baseUrl: string, deviceId: string, languageCode: string, sampleRate: number): string {
  const params = new URLSearchParams()
  params.append('deviceId', deviceId)
  params.append('languageCode', languageCode)
  params.append('sampleRate', sampleRate.toString())

  return `${baseUrl}?${params.toString()}`
}

function initializeWebsocket(url: string, protocol: string, cb: (err?: Error, ws?: WebSocket) => void): void {
  const ws = new WebSocket(url, protocol)

  const errhandler = (): void => {
    ws.removeEventListener('close', errhandler)
    ws.removeEventListener('error', errhandler)
    ws.removeEventListener('open', openhandler)

    cb(Error('Connection failed'))
  }

  const openhandler = (): void => {
    ws.removeEventListener('close', errhandler)
    ws.removeEventListener('error', errhandler)
    ws.removeEventListener('open', openhandler)

    cb(undefined, ws)
  }

  ws.addEventListener('close', errhandler)
  ws.addEventListener('error', errhandler)
  ws.addEventListener('open', openhandler)
}
