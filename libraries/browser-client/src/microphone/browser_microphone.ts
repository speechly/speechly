import { ErrDeviceNotSupported, ErrNoAudioConsent, ErrNotInitialized, Microphone } from './types'
import { APIClient } from '../websocket'
import audioworklet from './audioworklet'

const audioProcessEvent = 'audioprocess'
const baseBufferSize = 4096

export class BrowserMicrophone implements Microphone {
  private readonly debug: boolean
  private readonly isWebkit: boolean
  private readonly apiClient: APIClient
  private readonly sampleRate: number

  private initialized: boolean = false
  private muted: boolean = false

  private audioContext?: AudioContext
  private resampleRatio?: number

  // The media stream and audio track are initialized during `initialize()` call.
  private audioTrack?: MediaStreamTrack
  private mediaStream?: MediaStream

  // Audio processing functionality is initialized lazily during first `unmute()` call.
  // The reason for that is that it's required for user to first interact with the page,
  // before it can capture or play audio and video, for privacy and user experience reasons.
  private audioProcessor?: ScriptProcessorNode

  private stats = {
    maxSignalEnergy: 0.0,
  }

  constructor(isWebkit: boolean, sampleRate: number, apiClient: APIClient, debug: boolean = false) {
    this.isWebkit = isWebkit
    this.apiClient = apiClient
    this.sampleRate = sampleRate
    this.debug = debug
  }

  async initialize(audioContext: AudioContext, mediaStreamConstraints: MediaStreamConstraints): Promise<void> {
    if (window.navigator?.mediaDevices === undefined) {
      throw ErrDeviceNotSupported
    }

    this.audioContext = audioContext
    this.resampleRatio = this.audioContext.sampleRate / this.sampleRate

    try {
      this.mediaStream = await window.navigator.mediaDevices.getUserMedia(mediaStreamConstraints)
    } catch {
      throw ErrNoAudioConsent
    }

    this.audioTrack = this.mediaStream.getAudioTracks()[0]

    // Start audio context if we are dealing with a non-WebKit browser.
    //
    // Non-webkit browsers (currently only Chrome on Android)
    // require that user media is obtained before resuming the audio context.
    //
    // If audio context is attempted to be resumed before `mediaDevices.getUserMedia`,
    // `audioContext.resume()` will hang indefinitely, without being resolved or rejected.
    if (!this.isWebkit) {
      await this.audioContext.resume()
    }

    if (window.AudioWorkletNode !== undefined) {
      const blob = new Blob([audioworklet], { type: 'text/javascript' })
      const blobURL = window.URL.createObjectURL(blob)
      await this.audioContext.audioWorklet.addModule(blobURL)
      const speechlyNode = new AudioWorkletNode(this.audioContext, 'speechly-worklet')
      this.audioContext.createMediaStreamSource(this.mediaStream).connect(speechlyNode)
      speechlyNode.connect(this.audioContext.destination)
      // @ts-ignore
      if (window.SharedArrayBuffer !== undefined) {
        // Chrome, Edge, Firefox, Firefox Android
        // @ts-ignore
        const controlSAB = new window.SharedArrayBuffer(4 * Int32Array.BYTES_PER_ELEMENT)
        // @ts-ignore
        const dataSAB = new window.SharedArrayBuffer(1024 * Float32Array.BYTES_PER_ELEMENT)
        this.apiClient.postMessage({
          type: 'SET_SHARED_ARRAY_BUFFERS',
          controlSAB,
          dataSAB,
        })
        speechlyNode.port.postMessage({
          type: 'SET_SHARED_ARRAY_BUFFERS',
          controlSAB,
          dataSAB,
          debug: this.debug,
        })
      } else {
        // Opera, Chrome Android, Webview Anroid
        if (this.debug) {
          console.log('[SpeechlyClient]', 'can not use SharedArrayBuffer')
        }
      }

      speechlyNode.port.onmessage = (event: MessageEvent) => {
        switch (event.data.type) {
          case 'STATS':
            if (event.data.signalEnergy > this.stats.maxSignalEnergy) {
              this.stats.maxSignalEnergy = event.data.signalEnergy
            }
            break
          case 'DATA':
            this.handleAudio(event.data.frames)
            break
          default:
        }
      }
    } else {
      if (this.debug) {
        console.log('[SpeechlyClient]', 'can not use AudioWorkletNode')
      }
      // Safari, iOS Safari and Internet Explorer
      if (this.isWebkit) {
        // Multiply base buffer size of 4 kB by the resample ratio rounded up to the next power of 2.
        // i.e. for 48 kHz to 16 kHz downsampling, this will be 4096 (base) * 4 = 16384.
        const bufSize = baseBufferSize * Math.pow(2, Math.ceil(Math.log(this.resampleRatio) / Math.log(2)))
        this.audioProcessor = this.audioContext.createScriptProcessor(bufSize, 1, 1)
      } else {
        this.audioProcessor = this.audioContext.createScriptProcessor(undefined, 1, 1)
      }
      this.audioContext.createMediaStreamSource(this.mediaStream).connect(this.audioProcessor)
      this.audioProcessor.connect(this.audioContext.destination)
      this.audioProcessor.addEventListener(audioProcessEvent, (event: AudioProcessingEvent) => {
        this.handleAudio(event.inputBuffer.getChannelData(0))
      })
    }

    this.initialized = true
    this.mute()
  }

  async close(): Promise<void> {
    this.mute()
    if (!this.initialized) {
      throw ErrNotInitialized
    }

    const t = this.audioTrack as MediaStreamTrack
    t.enabled = false

    // Stop all media tracks
    const stream = this.mediaStream as MediaStream
    stream.getTracks().forEach(t => t.stop())

    // Disconnect and stop ScriptProcessorNode
    if (this.audioProcessor != null) {
      const proc = this.audioProcessor
      proc.disconnect()
    }

    // Unset all audio infrastructure
    this.mediaStream = undefined
    this.audioTrack = undefined
    this.audioProcessor = undefined
    this.initialized = false
  }

  mute(): void {
    this.muted = true
  }

  unmute(): void {
    this.muted = false
  }

  private readonly handleAudio = (array: Float32Array): void => {
    if (this.muted) {
      return
    }
    if (array.length > 0) {
      this.apiClient.sendAudio(array)
    }
  }

  /**
   * print statistics to console
   */
  public printStats(): void {
    if (this.audioTrack != null) {
      const settings: MediaTrackSettings = this.audioTrack.getSettings()
      console.log(this.audioTrack.label, this.audioTrack.readyState)
      // @ts-ignore
      console.log('channelCount', settings.channelCount)
      // @ts-ignore
      console.log('latency', settings.latency)
      // @ts-ignore
      console.log('autoGainControl', settings.autoGainControl)
    }
    console.log('maxSignalEnergy', this.stats.maxSignalEnergy)
  }
}
