import { ClientState } from '@speechly/browser-client'
import { SpeechState } from '@speechly/react-client'

export enum SpeechlyUiEvents {
  TangentRelease = 'TangentRelease',
  TangentPress = 'TangentPress',
  Notification = 'Notification',
  WarningNotification = 'WarningNotification',
  DismissNotification = 'DismissNotification',
};

export const mapSpeechStateToClientState = (s: SpeechState): ClientState => {
  switch (s) {
    case SpeechState.Failed:
      return ClientState.Failed
    case SpeechState.NoBrowserSupport:
      return ClientState.NoBrowserSupport
    case SpeechState.NoAudioConsent:
      return ClientState.NoAudioConsent
    case SpeechState.Idle:
      return ClientState.Disconnected
      // return ClientState.Disconnecting:
    case SpeechState.Connecting:
      return ClientState.Connecting
    case SpeechState.Ready:
      return ClientState.Connected
    case SpeechState.Recording:
      // return ClientState.Starting:
      return ClientState.Recording
    case SpeechState.Loading:
      return ClientState.Stopping
    default:
      return ClientState.Failed
  }
}
