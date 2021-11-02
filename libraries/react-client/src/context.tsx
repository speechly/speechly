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
  SpeechState,
} from './types'
import { mapClientState } from './state'

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
   * Function that initialises Speechly client, including both the API connection and the audio initialisation.
   *
   * It is optional and you don't have to call it manually,
   * it will be called automatically upon the first call to toggleRecording.
   *
   * The idea is that it provides a more fine-grained control over how the audio is initialised,
   * in case you want to give the user more control over your app.
   */
  initialise: ContextFunc

  /**
   * Toggles recording on or off. Automatically initialises the API connection and audio stack.
   */
  toggleRecording: ContextFunc

  /**
   * Switch appId in multi-app project.
   */
  switchApp: (appId: string) => void

  /**
   * Current appId in multi-app project.
   */
  appId?: string

  /**
   * Current state of the context, whether it's idle, recording or failed, etc.
   * It's advised to react to this to enable / disable voice functionality in your app
   * as well as inidicate to the user that recording is in progress or results are being fetched from the API.
   */
  speechState: SpeechState

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
}

/**
 * Signature for initialise and toggleRecording functions.
 * @public
 */
export type ContextFunc = () => Promise<void>

/**
 * A React context that holds the state of Speechly SLU API client.
 * @public
 */
export const SpeechContext = React.createContext<SpeechContextState>({
  initialise: async (): Promise<void> => Promise.resolve(),
  toggleRecording: async (): Promise<void> => Promise.resolve(),
  switchApp: (): void => {},
  speechState: SpeechState.Idle,
})

/**
 * Props for SpeechContext provider, which are used to initialise API client.
 * @public
 */
export interface SpeechProviderProps extends ClientOptions {
  /**
   * Whether to disable reacting to tentative items. Set this to true if you don't use them.
   */
  disableTenative?: boolean
}

interface SpeechProviderState {
  client: Client
  clientState: ClientState
  recordingState: SpeechState
  toggleIsOn: boolean
  appId?: string
  startedContextPromise?: Promise<string>
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
      client: this.initialiseClient(props),
      recordingState: SpeechState.Idle,
      clientState: ClientState.Disconnected,
      toggleIsOn: false,
      appId: props.appId,
      startedContextPromise: undefined,
    }
  }

  readonly initialiseAudio = async (): Promise<void> => {
    const { client, clientState } = this.state

    if (clientState === ClientState.Disconnected) {
      await client.initialize()
    }

    return Promise.resolve()
  }

  readonly startContext = async (): Promise<void> => {
    const { client, clientState, appId } = this.state

    let startedContextPromise
    switch (clientState) {
      case ClientState.Disconnected:
        await client.initialize()
        // falls through
      case ClientState.Connected:
        // falls through
      case ClientState.Stopping:
        if (appId !== undefined) {
          startedContextPromise = client.startContext(appId)
        } else {
          startedContextPromise = client.startContext()
        }
        break
      default:
        console.warn('Cannot start context - client is not connected')
    }

    this.setState({ startedContextPromise })
    if (startedContextPromise !== undefined) {
      await startedContextPromise
    }
  }

  readonly stopContext = async (): Promise<void> => {
    const { client, startedContextPromise } = this.state

    if (startedContextPromise !== undefined) {
      await startedContextPromise
    }

    await client.stopContext()
    return Promise.resolve()
  }

  readonly toggleRecording = async (): Promise<void> => {
    const { toggleIsOn } = this.state
    this.setState({ toggleIsOn: !toggleIsOn })
    if (!toggleIsOn) {
      return this.startContext()
    }
    return this.stopContext()
  }

  readonly switchApp = async (appId: string): Promise<void> => {
    const { client, clientState } = this.state
    this.setState({ appId })
    if (clientState === ClientState.Recording) {
      return client.switchContext(appId)
    }
  }

  render(): JSX.Element {
    const {
      appId,
      recordingState,
      segment,
      tentativeTranscript,
      transcript,
      tentativeEntities,
      entity,
      tentativeIntent,
      intent,
    } = this.state

    return (
      <SpeechContext.Provider
        value={{
          initialise: this.initialiseAudio,
          toggleRecording: this.toggleRecording,
          switchApp: async(appId: string) => this.switchApp(appId),
          appId,
          speechState: recordingState,
          segment,
          tentativeTranscript,
          transcript,
          tentativeEntities,
          entity,
          tentativeIntent,
          intent,
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
      props.language === prevProps.language &&
      props.sampleRate === prevProps.sampleRate &&
      props.debug === prevProps.debug &&
      props.loginUrl === prevProps.loginUrl &&
      props.apiUrl === prevProps.apiUrl
    ) {
      return
    }

    const { client } = this.state

    try {
      await client.close()
    } catch (e) {
      console.error('Error closing Speechly client:', e)
    }

    this.setState({ client: this.initialiseClient(props) })
  }

  async componentWillUnmount(): Promise<void> {
    try {
      await this.state.client.close()
    } catch {
      // Nothing to do with the error here, so ignoring it is fine.
    }
  }

  private readonly initialiseClient = (opts: SpeechProviderProps): Client => {
    const client = new Client(opts)

    client.onStateChange(this.onClientStateChange)
    client.onSegmentChange(this.onSegmentChange)

    client.onTranscript(this.onTranscript)
    client.onEntity(this.onEntity)
    client.onIntent(this.onIntent)

    if (!(opts.disableTenative ?? false)) {
      client.onTentativeIntent(this.onTentativeIntent)
      client.onTentativeTranscript(this.onTentativeTranscript)
      client.onTentativeEntities(this.onTentativeEntities)
    }

    return client
  }

  private readonly onClientStateChange = (clientState: ClientState): void => {
    this.setState({ clientState, recordingState: mapClientState(clientState) })
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
