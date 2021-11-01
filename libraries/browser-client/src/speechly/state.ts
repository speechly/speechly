import { ClientState } from './types'

/**
 * Converts client state value to a string, which could be useful for debugging or metrics.
 * @param state - the state of the client
 * @public
 */
export function stateToString(state: ClientState): string {
  return states.get(state) ?? unknown
}

// TODO: generate this from the enum.
const unknown = 'Unknown'
const states = new Map<ClientState, string>([
  [ClientState.Failed, 'Failed'],
  [ClientState.NoBrowserSupport, 'NoBrowserSupport'],
  [ClientState.NoAudioConsent, 'NoAudioConsent'],
  [ClientState.Disconnecting, 'Disconnecting'],
  [ClientState.Disconnected, 'Disconnected'],
  [ClientState.Connecting, 'Connecting'],
  [ClientState.Connected, 'Connected'],
  [ClientState.Starting, 'Starting'],
  [ClientState.Stopping, 'Stopping'],
  [ClientState.Recording, 'Recording'],
])
