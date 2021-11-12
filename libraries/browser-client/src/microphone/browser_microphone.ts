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
  private mediaStreamNode?: MediaStreamAudioSourceNode

  // Audio processing functionality is initialized lazily during first `unmute()` call.
  // The reason for that is that it's required for user to first interact with the page,
  // before it can capture or play audio and video, for privacy and user experience reasons.
  private audioProcessor?: ScriptProcessorNode
  private audioWorkletNode?: AudioWorkletNode

  private mediaStreamConstraints?: MediaStreamConstraints

  private stats = {
    maxSignalEnergy: 0.0,
  }

  constructor(isWebkit: boolean, sampleRate: number, apiClient: APIClient, debug: boolean = false) {
    this.isWebkit = isWebkit
    this.apiClient = apiClient
    this.sampleRate = sampleRate
    this.debug = debug
  }

  async foo(): Promise<void> {
    // console.log(this)
    // console.log(event)
    // const devices = await window.navigator.mediaDevices.enumerateDevices()
    // console.log(devices)
    // console.log(this.mediaStreamConstraints)
    // this.mediaStream = await window.navigator.mediaDevices.getUserMedia(this.mediaStreamConstraints)
    // console.log(this.mediaStream.getAudioTracks())
    await this.close()
    console.log('closed microphone')
    if (this.audioContext && this.mediaStreamConstraints) {
      await this.initialize(this.audioContext, this.mediaStreamConstraints)
      console.log('re-initilised microphone')
    }
  }

  async initialize(audioContext: AudioContext, mediaStreamConstraints: MediaStreamConstraints): Promise<void> {
    console.log(this)
    this.mediaStreamConstraints = mediaStreamConstraints
    if (window.navigator?.mediaDevices === undefined) {
      throw ErrDeviceNotSupported
    }

    this.audioContext = audioContext
    this.resampleRatio = this.audioContext.sampleRate / this.sampleRate

    window.navigator.mediaDevices.ondevicechange = () => {
      this.foo().then(() => { console.log('fulfilled') }, () => { console.log('rejected') })
    }

    try {
      this.mediaStream = await window.navigator.mediaDevices.getUserMedia(mediaStreamConstraints)
      const devices = await window.navigator.mediaDevices.enumerateDevices()
      console.log(devices)
    } catch {
      throw ErrNoAudioConsent
    }

    this.audioTrack = this.mediaStream.getAudioTracks()[0]
    console.log('this.audioTrack.getSettings()', this.audioTrack.getSettings())

    // Start audio context if we are dealing with a non-WebKit browser.
    //
    // Non-webkit browsers (currently only Chrome on Android)
    // require that user media is obtained before resuming the audio context.
    //
    // If audio context is attempted to be resumed before `mediaDevices.getUserMedia`,
    // `audioContext.resume()` will hang indefinitely, without being resolved or rejected.
    if (!this.isWebkit) {
      console.log('calling resume when not webkit')
      await this.audioContext.resume()
    }

    this.mediaStreamNode = this.audioContext.createMediaStreamSource(this.mediaStream)

    if (window.AudioWorkletNode !== undefined) {
      this.audioWorkletNode = await this.initialiseWithAudioWorklet(this.audioContext)
      this.mediaStreamNode.connect(this.audioWorkletNode)
    } else {
      this.audioProcessor = this.initialiseWithScriptProcessor(this.audioContext, this.resampleRatio)
      this.mediaStreamNode.connect(this.audioProcessor)
    }

    this.initialized = true
    this.mute()
  }

  private async initialiseWithAudioWorklet(
    audioContext: AudioContext,
    audioWorkletNode?: AudioWorkletNode,
  ): Promise<AudioWorkletNode> {
    if (audioWorkletNode === undefined) {
      const blob = new Blob([audioworklet], { type: 'text/javascript' })
      const blobURL = window.URL.createObjectURL(blob)
      await audioContext.audioWorklet.addModule(blobURL)
      audioWorkletNode = new AudioWorkletNode(audioContext, 'speechly-worklet')
      console.log('set up audioworkletnode', audioContext)
    }

    // this.audioWorkletNode.connect(this.audioContext.destination)

    // @ts-ignore
    if (window.SharedArrayBuffer !== undefined) {
      this.setupSharedBuffer(audioWorkletNode)
    } else {
      // Opera, Chrome Android, Webview Anroid
      if (this.debug) {
        console.log('[SpeechlyClient]', 'can not use SharedArrayBuffer')
      }
    }

    audioWorkletNode.port.onmessage = (event: MessageEvent) => {
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

    return audioWorkletNode
  }

  private setupSharedBuffer(audioWorkletNode: AudioWorkletNode): void {
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
    audioWorkletNode.port.postMessage({
      type: 'SET_SHARED_ARRAY_BUFFERS',
      controlSAB,
      dataSAB,
      debug: this.debug,
    })
  }

  private initialiseWithScriptProcessor(
    audioContext: AudioContext,
    resampleRatio: number,
  ): ScriptProcessorNode {
    let audioProcessor: ScriptProcessorNode
    if (this.debug) {
      console.log('[SpeechlyClient]', 'can not use AudioWorkletNode')
    }
    // Safari, iOS Safari and Internet Explorer
    if (this.isWebkit) {
      // Multiply base buffer size of 4 kB by the resample ratio rounded up to the next power of 2.
      // i.e. for 48 kHz to 16 kHz downsampling, this will be 4096 (base) * 4 = 16384.
      const bufSize = baseBufferSize * Math.pow(2, Math.ceil(Math.log(resampleRatio) / Math.log(2)))
      console.log('bufSize', bufSize)
      audioProcessor = audioContext.createScriptProcessor(bufSize, 1, 1)
    } else {
      audioProcessor = audioContext.createScriptProcessor(undefined, 1, 1)
    }
    // this.audioProcessor.connect(this.audioContext.destination)
    audioProcessor.addEventListener(audioProcessEvent, (event: AudioProcessingEvent) => {
      this.handleAudio(event.inputBuffer.getChannelData(0))
    })
    return audioProcessor
  }

  async close(): Promise<void> {
    this.mute()
    if (!this.initialized) {
      throw ErrNotInitialized
    }

    // const t = this.audioTrack as MediaStreamTrack
    // t.enabled = false

    // Stop all media tracks
    const stream = this.mediaStream as MediaStream
    stream.getTracks().forEach(t => t.stop())

    // Disconnect and stop ScriptProcessorNode
    // if (this.audioProcessor != null) {
    //   const proc = this.audioProcessor
    //   proc.disconnect()
    // }

    this.mediaStreamNode?.disconnect()

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
