import type { IAppearance } from "./types";
import { DecoderState } from "@speechly/browser-client";
import { AudioSourceState } from "@speechly/browser-client";

// Copy of ClientState. If used directly from browser-client, rollup includes the whole of
// browser-client in big-transcript, resulting in a 90kb filesize instead of ~20kb
export { DecoderState, AudioSourceState }

export const enum LocalStorageKeys {
  SpeechlyFirstConnect = "SpeechlyFirstConnect",
}

export const enum MessageType {
  speechlypoweron = "speechlypoweron",
  holdstart = "holdstart",
  holdend = "holdend",
  speechstate = "speechstate",
  audiosourcestate = "audiosourcestate",
  speechsegment = "speechsegment",
  speechhandled = "speechhandled",
  showhint = "showhint",
  transcriptdrawerhint = "hint",
  speechlyintroready = "speechlyintroready",
  speechlyintroclosed = "speechlyintroclosed",
  startcontext = "startcontext",
  stopcontext = "stopcontext",
  requeststartmicrophone = "requeststartmicrophone"
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
  [DecoderState.Disconnected]: { icon: Icon.Mic, behaviour: Behaviour.Click, effect: Effect.None, triggerFx: TriggerFx.Whirl},
  [DecoderState.Connected]: { icon: Icon.Mic, behaviour: Behaviour.Hold, effect: Effect.None, triggerFx: TriggerFx.Whirl},
  [DecoderState.Active]: { icon: Icon.MicActive, behaviour: Behaviour.Hold, effect: Effect.None},
  [DecoderState.Failed]: { icon: Icon.Error, behaviour: Behaviour.Click, effect: Effect.None},
  [AudioSourceState.NoBrowserSupport]: { icon: Icon.Error, behaviour: Behaviour.Click, effect: Effect.None},
  [AudioSourceState.NoAudioConsent]: { icon: Icon.Denied, behaviour: Behaviour.Click, effect: Effect.None},
}
