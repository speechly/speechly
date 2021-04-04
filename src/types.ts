import { ClientState } from "@speechly/browser-client"; 

export type ITaggedWord = {
  word: string
  serialNumber: number
  entityType: string | null
  isFinal: boolean
}

export type IAppearance = {
  icon: Icon,
  behaviour: Behaviour,
  effect: Effect,
}

export enum SpeechlyState {
  Poweron = "poweron",
  Connecting = "connecting",
  Ready = "ready",
  Listening = "listening",
  Loading = "loading",
  Failed = "failed",
  NoBrowserSupport = "nobrowsersupport",
  NoAudioConsent = "noaudioconsent",
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

  [SpeechlyState.Poweron]: { icon: Icon.Poweron, behaviour: Behaviour.Click, effect: Effect.None},
  [SpeechlyState.Connecting]: { icon: Icon.Poweron, behaviour: Behaviour.Noninteractive, effect: Effect.Connecting},
  [SpeechlyState.Ready]: { icon: Icon.Mic, behaviour: Behaviour.Hold, effect: Effect.None},
  [SpeechlyState.Listening]: { icon: Icon.Mic, behaviour: Behaviour.Hold, effect: Effect.None},
  [SpeechlyState.Loading]: { icon: Icon.Mic, behaviour: Behaviour.Noninteractive, effect: Effect.Busy},
  [SpeechlyState.Failed]: { icon: Icon.Error, behaviour: Behaviour.Click, effect: Effect.None},
  [SpeechlyState.NoBrowserSupport]: { icon: Icon.Error, behaviour: Behaviour.Click, effect: Effect.None},
  [SpeechlyState.NoAudioConsent]: { icon: Icon.Denied, behaviour: Behaviour.Click, effect: Effect.None},
}
