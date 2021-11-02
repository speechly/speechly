import { ClientState } from '@speechly/browser-client'
import { SpeechState } from './types'

export function mapClientState(s: ClientState): SpeechState {
  switch (s) {
    case ClientState.Failed:
      return SpeechState.Failed
    case ClientState.NoBrowserSupport:
      return SpeechState.NoBrowserSupport
    case ClientState.NoAudioConsent:
      return SpeechState.NoAudioConsent
    case ClientState.Disconnecting:
    case ClientState.Disconnected:
      return SpeechState.Idle
    case ClientState.Connecting:
      return SpeechState.Connecting
    case ClientState.Connected:
      return SpeechState.Ready
    case ClientState.Starting:
    case ClientState.Recording:
      return SpeechState.Recording
    case ClientState.Stopping:
      return SpeechState.Loading
    default:
      return SpeechState.Failed
  }
}
