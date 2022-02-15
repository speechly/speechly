import { SpeechlyState } from './types'

/**
 * Converts client state value to a string, which could be useful for debugging or metrics.
 * @param state - the state of the client
 * @public
 */
export function stateToString(state: SpeechlyState): string {
  return states.get(state) ?? unknown
}

// TODO: generate this from the enum.
const unknown = 'Unknown'
const states = new Map<SpeechlyState, string>([
  [SpeechlyState.Failed, 'Failed'],
  [SpeechlyState.NoBrowserSupport, 'NoBrowserSupport'],
  [SpeechlyState.NoAudioConsent, 'NoAudioConsent'],
  [SpeechlyState.Disconnecting, 'Disconnecting'],
  [SpeechlyState.Disconnected, 'Disconnected'],
  [SpeechlyState.Connecting, 'Connecting'],
  [SpeechlyState.Connected, 'Connected'],
  [SpeechlyState.Initializing, 'Initializing'],
  [SpeechlyState.Ready, 'Ready'],
  [SpeechlyState.Stopping, 'Stopping'],
  [SpeechlyState.Starting, 'Starting'],
  [SpeechlyState.Recording, 'Recording'],
])
