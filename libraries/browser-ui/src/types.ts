import type { Behaviour, Effect, Icon, TriggerFx } from "./constants"

export type { Segment, Intent, Word, Entity } from "@speechly/browser-client";

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
  triggerFx?: TriggerFx,
}

export type IHoldEvent = {
  timeMs: number;
}
