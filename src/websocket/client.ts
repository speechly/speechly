import { APIClient, ResponseCallback, CloseCallback, WebsocketResponse, WebsocketResponseType } from './types'
import { validateToken, fetchToken } from './token'

const StartEventJSON = JSON.stringify({ event: 'start' })
const StopEventJSON = JSON.stringify({ event: 'stop' })

type ContextCallback = (err?: Error, contextId?: string) => void

export class WebsocketClient implements APIClient {
  private readonly loginUrl: string
  private readonly apiUrl: string

  private authToken?: string
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

  constructor(loginUrl: string, apiUrl: string, languageCode: string, sampleRate: number) {
    this.loginUrl = loginUrl
    this.apiUrl = generateWsUrl(apiUrl, languageCode, sampleRate)
  }

  async initialize(appId: string, deviceId: string, token?: string): Promise<string> {
    if (this.websocket !== undefined) {
      throw Error('Cannot initialize an already initialized websocket client')
    }

    if (token !== undefined && validateToken(token, appId, deviceId)) {
      // If the token is still valid, don't refresh it.
      this.authToken = token
    } else {
      this.authToken = await fetchToken(this.loginUrl, appId, deviceId)
    }

    this.websocket = await initializeWebsocket(this.apiUrl, this.authToken)

    this.websocket.addEventListener('message', this.onWebsocketMessage)
    this.websocket.addEventListener('error', this.onWebsocketError)
    this.websocket.addEventListener('close', this.onWebsocketClose)

    return this.authToken
  }

  async close(): Promise<void> {
    return this.closeWebsocket(1000, 'Client has ended the session')
  }

  async startContext(): Promise<string> {
    if (!this.isOpen()) {
      throw Error('Websocket is not ready')
    }

    const ws = this.websocket as WebSocket

    return new Promise((resolve, reject) => {
      this.startCbs.push((err?, id?) => {
        if (err !== undefined) {
          reject(err)
        } else {
          resolve(id as string)
        }
      })

      ws.send(StartEventJSON)
    })
  }

  async stopContext(): Promise<string> {
    if (!this.isOpen()) {
      throw Error('Websocket is not ready')
    }

    const ws = this.websocket as WebSocket

    return new Promise((resolve, reject) => {
      this.stopCbs.push((err?, id?) => {
        if (err !== undefined) {
          reject(err)
        } else {
          resolve(id as string)
        }
      })

      ws.send(StopEventJSON)
    })
  }

  sendAudio(audioChunk: Int16Array): Error | void {
    if (!this.isOpen()) {
      return Error('Cannot send data through inactive websocket')
    }

    const ws = this.websocket as WebSocket
    ws.send(audioChunk)
  }

  private isOpen(): boolean {
    return this.websocket !== undefined && this.websocket.readyState === this.websocket.OPEN
  }

  private closeWebsocket(code: number, message: string): void {
    if (this.websocket === undefined) {
      throw Error('Websocket is not open')
    }

    this.websocket.removeEventListener('message', this.onWebsocketMessage)
    this.websocket.removeEventListener('error', this.onWebsocketError)
    this.websocket.removeEventListener('close', this.onWebsocketClose)

    this.websocket.close(code, message)
    this.websocket = undefined
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
    this.websocket = undefined
    this.onCloseCb(Error(`Websocket was closed with code "${event.code}" and reason "${event.reason}"`))
  }

  private readonly onWebsocketError = (_event: Event): void => {
    this.closeWebsocket(1000, 'Client disconnecting due to an error')
    this.onCloseCb(Error('Websocket was closed because of error'))
  }
}

function generateWsUrl(baseUrl: string, languageCode: string, sampleRate: number): string {
  const params = new URLSearchParams()
  params.append('languageCode', languageCode)
  params.append('sampleRate', sampleRate.toString())

  return `${baseUrl}?${params.toString()}`
}

async function initializeWebsocket(url: string, protocol: string): Promise<WebSocket> {
  const ws = new WebSocket(url, protocol)

  return new Promise((resolve, reject) => {
    const errhandler = (): void => {
      ws.removeEventListener('close', errhandler)
      ws.removeEventListener('error', errhandler)
      ws.removeEventListener('open', openhandler)

      reject(Error('Connection failed'))
    }

    const openhandler = (): void => {
      ws.removeEventListener('close', errhandler)
      ws.removeEventListener('error', errhandler)
      ws.removeEventListener('open', openhandler)

      resolve(ws)
    }

    ws.addEventListener('close', errhandler)
    ws.addEventListener('error', errhandler)
    ws.addEventListener('open', openhandler)
  })
}
