import { DecoderState } from './types'

/**
 * Converts client state value to a string, which could be useful for debugging or metrics.
 * @param state - the state of the client
 * @public
 */
export function stateToString(state: DecoderState): string {
  return states.get(state) ?? 'unknown'
}

// TODO: generate this from the enum.
const states = new Map<DecoderState, string>([
  [DecoderState.Failed, 'Failed'],
  [DecoderState.Disconnected, 'Disconnected'],
  [DecoderState.Connected, 'Connected'],
  [DecoderState.Active, 'Active'],
])
