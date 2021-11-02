import { useContext } from 'react'

import { SpeechContextState, SpeechContext } from './context'

/**
 * React hook that exposes SpeechContext.
 * This is just an alias for useContext(SpeechContext).
 * @public
 */
export function useSpeechContext(): SpeechContextState {
  return useContext(SpeechContext)
}
