import type { Behaviour, Effect, Icon } from "./constants"

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
