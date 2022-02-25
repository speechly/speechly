import React from 'react'
import { ClientOptions, ClientState, Client } from '@speechly/browser-client'

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
  initialize: () => Promise<void>

  /**
   * @deprecated Use client.isListening(), startContext() and stopContext() instead
   * Toggles listening on or off. Automatically initialises the API connection and audio stack.
   */
  toggleRecording: () => Promise<string>

  /**
   * Turns listening on. Automatically initialises the API connection and audio stack.
   */
  startContext: () => Promise<string>

  /**
   * Turns listening off.
   */
  stopContext: () => Promise<string>

  /**
   * Switch appId in multi-app project.
   */
  switchApp: (appId: string) => void

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
  clientState: ClientState

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
   * Low-level access to underlying Speechly browser client.
   */
  client?: Client
}

/**
 * A React context that holds the state of Speechly SLU API client.
 * @public
 */
export const SpeechContext = React.createContext<SpeechContextState>({
  connect: async () => Promise.resolve(),
  initialize: async () => Promise.resolve(),
  toggleRecording: async () => Promise.resolve('Unknown contextId'),
  startContext: async () => Promise.resolve('Unknown contextId'),
  stopContext: async () => Promise.resolve('Unknown contextId'),
  switchApp: (): void => {},
  clientState: ClientState.Disconnected,
  listening: false,
})

/**
 * Props for SpeechContext provider, which are used to initialise API client.
 * @public
 */
export interface SpeechProviderProps extends ClientOptions {
  /**
   * Whether to disable reacting to tentative items. Set this to true if you don't use them.
   */
  disableTentative?: boolean
}

interface SpeechProviderState {
  client?: Client
  clientState: ClientState
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
  constructor(props: SpeechProviderProps) {
    super(props)
    this.state = {
      client: undefined,
      listening: false,
      clientState: ClientState.Disconnected,
      appId: props.appId,
    }
  }

  // init at mount mount time for to play it nice with SSR
  readonly componentDidMount = async (): Promise<void> => {
    this.setState({
      ...this.state,
      client: this.createClient(this.props),
    })
  }

  readonly connect = async (): Promise<void> => {
    const { client } = this.state
    if (client == null) {
      throw Error('No Speechly client (are you calling connect in non-browser environment)')
    }
    await client.connect()
  }

  readonly initialize = async (): Promise<void> => {
    const { client } = this.state
    if (client == null) {
      throw Error('No Speechly client (are you calling initialize in non-browser environment)')
    }
    await client.initialize()
  }

  readonly startContext = async (): Promise<string> => {
    const { client, appId } = this.state
    this.setState({ listening: true })
    if (client == null) {
      throw Error('No Speechly client (are you calling startContext in non-browser environment)')
    }
    if (appId !== undefined) {
      return client.startContext(appId)
    }
    return client.startContext()
  }

  readonly stopContext = async (): Promise<string> => {
    const { client } = this.state
    this.setState({ listening: false })
    if (client == null) {
      throw Error('No Speechly client (are you calling stopContext in non-browser environment)')
    }
    return client.stopContext()
  }

  readonly toggleRecording = async (): Promise<string> => {
    const { client } = this.state
    if (client == null) {
      throw Error('No Speechly client (are you calling toggleRecording in non-browser environment)')
    }
    if (!client.isListening()) {
      return this.startContext()
    } else {
      return this.stopContext()
    }
  }

  readonly switchApp = async (appId: string): Promise<void> => {
    const { client } = this.state
    if (client == null) {
      throw Error('No Speechly client (are you calling toggleRecording in non-browser environment)')
    }
    return client.switchContext(appId)
  }

  render(): JSX.Element {
    const {
      appId,
      clientState,
      segment,
      tentativeTranscript,
      transcript,
      tentativeEntities,
      entity,
      tentativeIntent,
      intent,
      client,
      listening,
    } = this.state

    return (
      <SpeechContext.Provider
        value={{
          connect: this.connect,
          initialize: this.initialize,
          startContext: this.startContext,
          stopContext: this.stopContext,
          toggleRecording: this.toggleRecording,
          switchApp: async(appId: string) => this.switchApp(appId),
          appId,
          listening,
          clientState,
          segment,
          tentativeTranscript,
          transcript,
          tentativeEntities,
          entity,
          tentativeIntent,
          intent,
          client,
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
      props.loginUrl === prevProps.loginUrl &&
      props.apiUrl === prevProps.apiUrl
    ) {
      return
    }

    const { client } = this.state

    try {
      await client?.close()
    } catch (e) {
      console.error('Error closing Speechly client:', e)
    }

    this.setState({ client: this.createClient(props) })
  }

  async componentWillUnmount(): Promise<void> {
    try {
      await this.state.client?.close()
    } catch {
      // Nothing to do with the error here, so ignoring it is fine.
    }
  }

  private readonly createClient = (clientOptions: SpeechProviderProps): Client => {
    // Postpone connect
    const effectiveOpts = { ...clientOptions, connect: false }
    const client = new Client(effectiveOpts)

    client.onStateChange(this.onClientStateChange)
    client.onSegmentChange(this.onSegmentChange)

    client.onTranscript(this.onTranscript)
    client.onEntity(this.onEntity)
    client.onIntent(this.onIntent)

    if (!(clientOptions.disableTentative ?? false)) {
      client.onTentativeIntent(this.onTentativeIntent)
      client.onTentativeTranscript(this.onTentativeTranscript)
      client.onTentativeEntities(this.onTentativeEntities)
    }

    // Connect now to pre-warm backend if not explicitely told not to
    if (clientOptions.connect !== false) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      client.connect()
    }
    return client
  }

  private readonly onClientStateChange = (clientState: ClientState): void => {
    if (clientState <= ClientState.Disconnected) {
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
