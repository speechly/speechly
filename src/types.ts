import { ClientState } from "@speechly/browser-client/speechly/types.js"; 

// Re-exporting ClientState. If used directly from browser-client, rollup includes the whole of
// browser-client in big-transcript, resulting in a 90kb filesize instead of ~20kb
export { ClientState } from "@speechly/browser-client/speechly/types.js"; 

export type ITaggedWord = {
  word: string
  serialNumber: number
  entityType: string | null
  isFinal: boolean
  hide: boolean
}

export type IAppearance = {
  icon: Icon,
  behaviour: Behaviour,
  effect: Effect,
}

export type IHoldEvent = {
  timeMs: number;
}

export enum SpeechState {
  /**
   * The context is in a state of unrecoverable error.
   * It is only possible to fix this by destroying and creating it from scratch.
   */
  Failed = "Failed",
  /**
   * Current browser is not supported by Speechly - it's not possible to use speech functionality.
   */
  NoBrowserSupport = "NoBrowserSupport",
  /**
   * The user did not provide permissions to use the microphone - it is not possible to use speech functionality.
   */
  NoAudioConsent = "NoAudioConsent",
  /**
   * The context has been created but not initialised. The audio and API connection are not enabled.
   */
  Idle = "Idle",
  /**
   * The context is connecting to the API.
   */
  Connecting = "Connecting",
  /**
   * The context is ready to use.
   */
  Ready = "Ready",
  /**
   * The context is current recording audio and sending it to the API for recognition.
   * The results are also being fetched.
   */
  Recording = "Recording",
  /**
   * The context is waiting for the API to finish sending trailing responses.
   * No audio is being sent anymore.
   */
  Loading = "Loading"
}

export enum Icon {
  Poweron = "poweron",
  Mic = "mic",
  Error = "error",
  Denied = "denied",
}

export enum Behaviour {
  Hold = "hold",
  Click = "click",
  Noninteractive = "noninteractive",
}

export enum Effect {
  None = "none",
  Connecting = "connecting",
  Busy = "busy",
}

export const stateToAppearance: {[state: string]: IAppearance} = {
  [ClientState.Disconnected]: { icon: Icon.Poweron, behaviour: Behaviour.Click, effect: Effect.None},
  [ClientState.Disconnecting]: { icon: Icon.Poweron, behaviour: Behaviour.Noninteractive, effect: Effect.Connecting},
  [ClientState.Connecting]: { icon: Icon.Poweron, behaviour: Behaviour.Noninteractive, effect: Effect.Connecting},
  [ClientState.Connected]: { icon: Icon.Mic, behaviour: Behaviour.Hold, effect: Effect.None},
  [ClientState.Starting]: { icon: Icon.Mic, behaviour: Behaviour.Hold, effect: Effect.Connecting},
  [ClientState.Recording]: { icon: Icon.Mic, behaviour: Behaviour.Hold, effect: Effect.None},
  [ClientState.Stopping]: { icon: Icon.Mic, behaviour: Behaviour.Noninteractive, effect: Effect.Busy},
  [ClientState.Failed]: { icon: Icon.Error, behaviour: Behaviour.Click, effect: Effect.None},
  [ClientState.NoBrowserSupport]: { icon: Icon.Error, behaviour: Behaviour.Click, effect: Effect.None},
  [ClientState.NoAudioConsent]: { icon: Icon.Denied, behaviour: Behaviour.Click, effect: Effect.None},

  [SpeechState.Idle]: { icon: Icon.Poweron, behaviour: Behaviour.Click, effect: Effect.None},
  [SpeechState.Connecting]: { icon: Icon.Poweron, behaviour: Behaviour.Noninteractive, effect: Effect.Connecting},
  [SpeechState.Ready]: { icon: Icon.Mic, behaviour: Behaviour.Hold, effect: Effect.None},
  [SpeechState.Recording]: { icon: Icon.Mic, behaviour: Behaviour.Hold, effect: Effect.None},
  [SpeechState.Loading]: { icon: Icon.Mic, behaviour: Behaviour.Noninteractive, effect: Effect.Busy},
  [SpeechState.Failed]: { icon: Icon.Error, behaviour: Behaviour.Click, effect: Effect.None},
  [SpeechState.NoBrowserSupport]: { icon: Icon.Error, behaviour: Behaviour.Click, effect: Effect.None},
  [SpeechState.NoAudioConsent]: { icon: Icon.Denied, behaviour: Behaviour.Click, effect: Effect.None},
}
