export type ITaggedWord = {
  word: string
  serialNumber: number
  entityType: string | null
  isFinal: boolean
}

export enum Behaviour {
  Poweron = "poweron",
  Connecting = "connecting",
  Mic = "mic",
  Loading = "loading",
  Failed = "failed",
  NoAudioConsent = "noaudioconsent"
}
