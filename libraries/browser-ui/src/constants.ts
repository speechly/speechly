import type { IAppearance } from "./types";
import { ClientState } from "../node_modules/@speechly/browser-client/src/speechly/types";

// Copy of ClientState. If used directly from browser-client, rollup includes the whole of
// browser-client in big-transcript, resulting in a 90kb filesize instead of ~20kb
export { ClientState }

export const enum LocalStorageKeys {
  SpeechlyFirstConnect = "SpeechlyFirstConnect",
}

export const enum MessageType {
  speechlypoweron = "speechlypoweron",
  holdstart = "holdstart",
  holdend = "holdend",
  speechstate = "speechstate",
  speechsegment = "speechsegment",
  speechhandled = "speechhandled",
  showhint = "showhint",
  transcriptdrawerhint = "hint",
  speechlyintroready = "speechlyintroready",
  speechlyintroclosed = "speechlyintroclosed",
}

export const enum Icon {
  Mic = "mic",
  MicActive = "micactive",
  Error = "error",
  Denied = "denied",
}

export const enum Behaviour {
  Hold = "hold",
  Click = "click",
  Noninteractive = "noninteractive",
}

export const enum Effect {
  None = "none",
  Connecting = "connecting",
  Busy = "busy",
}

export const enum TriggerFx {
  None = "none",
  Whirl = "whirl",
}

export const clientStateToAppearance: {[state: string]: IAppearance} = {
  [ClientState.Disconnected]: { icon: Icon.Mic, behaviour: Behaviour.Click, effect: Effect.None, triggerFx: TriggerFx.Whirl},
  [ClientState.Disconnecting]: { icon: Icon.Mic, behaviour: Behaviour.Noninteractive, effect: Effect.Connecting},
  [ClientState.Connecting]: { icon: Icon.Mic, behaviour: Behaviour.Noninteractive, effect: Effect.Connecting},
  [ClientState.Preinitialized]: { icon: Icon.Mic, behaviour: Behaviour.Hold, effect: Effect.None, triggerFx: TriggerFx.Whirl},
  [ClientState.Initializing]: { icon: Icon.Mic, behaviour: Behaviour.Noninteractive, effect: Effect.Connecting},
  [ClientState.Connected]: { icon: Icon.Mic, behaviour: Behaviour.Hold, effect: Effect.None, triggerFx: TriggerFx.Whirl},
  [ClientState.Starting]: { icon: Icon.Mic, behaviour: Behaviour.Hold, effect: Effect.Connecting},
  [ClientState.Recording]: { icon: Icon.MicActive, behaviour: Behaviour.Hold, effect: Effect.None},
  [ClientState.Stopping]: { icon: Icon.Mic, behaviour: Behaviour.Noninteractive, effect: Effect.Busy},
  [ClientState.Failed]: { icon: Icon.Error, behaviour: Behaviour.Click, effect: Effect.None},
  [ClientState.NoBrowserSupport]: { icon: Icon.Error, behaviour: Behaviour.Click, effect: Effect.None},
  [ClientState.NoAudioConsent]: { icon: Icon.Denied, behaviour: Behaviour.Click, effect: Effect.None},
}
