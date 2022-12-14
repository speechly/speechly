import React from 'react'
import { DecoderOptions, DecoderState, BrowserClient, BrowserMicrophone, AudioSourceState } from '@speechly/browser-client'

import {
  Word,
  Entity,
  Intent,
  TentativeSpeechTranscript,
  TentativeSpeechEntities,
  TentativeSpeechIntent,
  SpeechTranscript,
  SpeechEntity,
  SpeechIntent,
  SpeechSegment,
} from './types'

/**
 * The state of SpeechContext.
 *
 * Functions to initialise audio and recording as well as the state are always present,
 * however the values returned from the API will only be present when they are returned from the API.
 *
 * Individual values (transcripts, entities and intent) are reset back to undefined after current segment is finalised.
 * @public
 */
export interface SpeechContextState {
  /**
   * Connect to Speechly API.
   */
  connect: () => Promise<void>

  /**
   * Function that initialises Speechly client, including both the API connection and the audio initialisation.
   *
   * It is optional and you don't have to call it manually,
   * it will be called automatically upon the first call to toggleRecording.
   *
   * The idea is that it provides a more fine-grained control over how the audio is initialised,
   * in case you want to give the user more control over your app.
   */
  attachMicrophone: () => Promise<void>

  /**
   * Turns listening on. Automatically initialises the API connection and audio stack. Returns the context id for the stated utterance.
   */
  start: () => Promise<string>

  /**
   * Turns listening off. Returns the context id for the stopped utterance.
   */
  stop: () => Promise<string>

  /**
   * Current appId in multi-app project.
   */
  appId?: string

  /**
   * @returns true if startContext called and listening will start.
   * Speechly will normally be listening nearly instantly after startContext.
   * Check clientState for details about browser client's state.
   */
  listening: boolean

  /**
   * Current state of the context, whether it's idle, recording or failed, etc.
   * Use this to indicate to the user that recording is in progress or results are being fetched from the API.
   */
  clientState: DecoderState

  /**
   * Current state of the microphone
   */
  microphoneState: AudioSourceState

  /**
   * Last tentative transcript received from the API. Resets after current segment is finalised.
   */
  tentativeTranscript?: TentativeSpeechTranscript

  /**
   * Last tentative entities received from the API. Resets after current segment is finalised.
   */
  tentativeEntities?: TentativeSpeechEntities

  /**
   * Last tentative intent received from the API. Resets after current segment is finalised.
   */
  tentativeIntent?: TentativeSpeechIntent

  /**
   * Last final transcript received from the API. Resets after current segment is finalised.
   */
  transcript?: SpeechTranscript

  /**
   * Last final entity received from the API. Resets after current segment is finalised.
   */
  entity?: SpeechEntity

  /**
   * Last final intent received from the API. Resets after current segment is finalised.
   */
  intent?: SpeechIntent

  /**
   * Last segment received from the API.
   */
  segment?: SpeechSegment

  /**
   * Low-level access to underlying Speechly BrowserClient.
   */
  client?: BrowserClient

  /**
   * Low-level access to underlying Speechly BrowserMicrophone.
   */
  microphone?: BrowserMicrophone
}

/**
 * A React context that holds the state of Speechly SLU API client.
 * @public
 */
export const SpeechContext = React.createContext<SpeechContextState>({
  connect: async () => Promise.resolve(),
  attachMicrophone: async () => Promise.resolve(),
  start: async () => Promise.resolve('Unknown contextId'),
  stop: async () => Promise.resolve('Unknown contextId'),
  clientState: DecoderState.Disconnected,
  microphoneState: AudioSourceState.Stopped,
  listening: false,
})

/**
 * Props for SpeechContext provider, which are used to initialise API client.
 * @public
 */
export interface SpeechProviderProps extends DecoderOptions {
  /**
   * Whether to disable reacting to tentative items. Set this to true if you don't use them.
   */
  disableTentative?: boolean
  children?: React.ReactNode
}

interface SpeechProviderState {
  client?: BrowserClient
  microphone?: BrowserMicrophone
  clientState: DecoderState
  microphoneState: AudioSourceState
  listening: boolean
  appId?: string
  segment?: SpeechSegment
  tentativeTranscript?: TentativeSpeechTranscript
  transcript?: SpeechTranscript
  tentativeEntities?: TentativeSpeechEntities
  entity?: SpeechEntity
  tentativeIntent?: TentativeSpeechIntent
  intent?: SpeechIntent
}

/**
 * The provider for SpeechContext.
 *
 * Make sure you have only one SpeechProvider in your application,
 * because otherwise the audio will be mixed up and unusable.
 *
 * It is possible to switch the props on the fly, which will make provider stop current client if it's running
 * and start a new one.
 * @public
 */
export class SpeechProvider extends React.Component<SpeechProviderProps, SpeechProviderState> {
  // Client instance stored for immediate access - React 18 will mount, unmount and mount in rapid succession
  client?: BrowserClient = undefined

  constructor(props: SpeechProviderProps) {
    super(props)
    this.state = {
      client: undefined,
      microphone: undefined,
      listening: false,
      clientState: DecoderState.Disconnected,
      microphoneState: AudioSourceState.Stopped,
      appId: props.appId,
    }
  }

  // init at mount mount time for to play it nice with SSR
  readonly componentDidMount = async (): Promise<void> => {
    this.createClient(this.props)
  }

  readonly connect = async (): Promise<void> => {
    const { client } = this.state
    if (client == null) {
      throw Error('No Speechly client (are you calling connect in non-browser environment)')
    }
    await client.initialize()
  }

  readonly attachMicrophone = async (): Promise<void> => {
    const { client } = this.state
    if (client == null) {
      throw Error('No Speechly client (are you calling connect in non-browser environment)')
    }

    const microphone = new BrowserMicrophone()
    microphone.onStateChange((state: AudioSourceState) => {
      this.setState({
        microphoneState: state,
      })
    })

    await microphone.initialize()

    if (microphone.mediaStream) {
      await client.attach(microphone.mediaStream)
    } else {
      throw Error('Microphone contains no MediaStream to attach')
    }

    this.setState({
      microphone: microphone,
    })
  }

  readonly start = async (): Promise<string> => {
    const { client, appId } = this.state
    this.setState({ listening: true })
    if (client == null) {
      throw Error('No Speechly client (are you calling start in non-browser environment)')
    }
    if (appId !== undefined) {
      return client.start({ appId: appId })
    }
    return client.start()
  }

  readonly stop = async (): Promise<string> => {
    const { client } = this.state
    this.setState({ listening: false })
    if (client == null) {
      throw Error('No Speechly client (are you calling stop in non-browser environment)')
    }
    return client.stop()
  }

  render(): JSX.Element {
    return (
      <SpeechContext.Provider
        value={{
          connect: this.connect,
          attachMicrophone: this.attachMicrophone,
          start: this.start,
          stop: this.stop,
          appId: this.state.appId,
          listening: this.state.listening,
          clientState: this.state.clientState,
          microphoneState: this.state.microphoneState,
          segment: this.state.segment,
          tentativeTranscript: this.state.tentativeTranscript,
          transcript: this.state.transcript,
          tentativeEntities: this.state.tentativeEntities,
          entity: this.state.entity,
          tentativeIntent: this.state.tentativeIntent,
          intent: this.state.intent,
          client: this.state.client,
        }}
      >
        {this.props.children}
      </SpeechContext.Provider>
    )
  }

  async componentDidUpdate(prevProps: SpeechProviderProps): Promise<void> {
    const props = this.props

    // We cannot compare microphone / api client / storage implementations,
    // so changes in those will be ignored.
    // A better approach for those would be to use separate contexts.
    if (
      props.appId === prevProps.appId &&
      props.sampleRate === prevProps.sampleRate &&
      props.debug === prevProps.debug &&
      props.apiUrl === prevProps.apiUrl
    ) {
      return
    }

    const { client, microphone } = this.state

    try {
      await client?.close()
    } catch (e) {
      console.error('Error closing Speechly client:', e)
    }

    try {
      await microphone?.close()
    } catch (e) {
      console.error('Error closing microphone:', e)
    }

    this.createClient(props)
  }

  async componentWillUnmount(): Promise<void> {
    try {
      await this.client?.close()
    } catch {
      // Nothing to do with the error here, so ignoring it is fine.
    }
  }

  private readonly createClient = (clientOptions: SpeechProviderProps): void => {
    // Postpone connect
    const effectiveOpts = { ...clientOptions, connect: false }
    this.client = new BrowserClient(effectiveOpts)

    this.client.onStateChange(this.onClientStateChange)
    this.client.onSegmentChange(this.onSegmentChange)

    this.client.onTranscript(this.onTranscript)
    this.client.onEntity(this.onEntity)
    this.client.onIntent(this.onIntent)

    if (!(clientOptions.disableTentative ?? false)) {
      this.client.onTentativeIntent(this.onTentativeIntent)
      this.client.onTentativeTranscript(this.onTentativeTranscript)
      this.client.onTentativeEntities(this.onTentativeEntities)
    }

    // Connect now to pre-warm backend if not explicitely told not to
    if (clientOptions.connect !== false) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      this.client.initialize()
    }

    this.setState({
      client: this.client,
    })
  }

  private readonly onClientStateChange = (clientState: DecoderState): void => {
    if (clientState <= DecoderState.Disconnected) {
      this.setState({ listening: false })
    }
    this.setState({ clientState })
  }

  private readonly onSegmentChange = (segment: SpeechSegment): void => {
    if (!segment.isFinal) {
      this.setState({ segment: segment })
      return
    }

    // Reset individual values when a segment is finalised.
    this.setState({
      segment: segment,
      tentativeTranscript: undefined,
      transcript: undefined,
      tentativeEntities: undefined,
      entity: undefined,
      tentativeIntent: undefined,
      intent: undefined,
    })
  }

  private readonly onTentativeTranscript = (
    contextId: string,
    segmentId: number,
    words: Word[],
    text: string,
  ): void => {
    this.setState({
      tentativeTranscript: {
        contextId,
        segmentId,
        text,
        words,
      },
    })
  }

  private readonly onTranscript = (contextId: string, segmentId: number, word: Word): void => {
    this.setState({
      transcript: {
        contextId,
        segmentId,
        word,
      },
    })
  }

  private readonly onTentativeEntities = (contextId: string, segmentId: number, entities: Entity[]): void => {
    this.setState({
      tentativeEntities: {
        contextId,
        segmentId,
        entities,
      },
    })
  }

  private readonly onEntity = (contextId: string, segmentId: number, entity: Entity): void => {
    this.setState({
      entity: {
        contextId,
        segmentId,
        entity,
      },
    })
  }

  private readonly onTentativeIntent = (contextId: string, segmentId: number, intent: Intent): void => {
    this.setState({
      tentativeIntent: {
        contextId,
        segmentId,
        intent,
      },
    })
  }

  private readonly onIntent = (contextId: string, segmentId: number, intent: Intent): void => {
    this.setState({
      intent: {
        contextId,
        segmentId,
        intent,
      },
    })
  }
}
