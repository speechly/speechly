import { SpeechState } from '@speechly/react-client'
import React, { useEffect, useRef, useState } from 'react'
import { SpeechlyUiEvents } from '../types'
import { Callout } from './Callout'

export const HintCallout: React.FC = props => {
  const [visible, setVisible] = useState<boolean>(false)
  const timeout = useRef<number | null>(null)

  const SHORT_PRESS_TRESHOLD_MS = 600
  const INSTRUCTION_PREROLL_MS = 500
  const INSTRUCTION_SHOW_TIME_MS = 3000

  useEffect(() => {
    const subTangentPress = PubSub.subscribe(
      SpeechlyUiEvents.TangentPress,
      (message: string, payload: { state: SpeechState }) => {
        // console.log('TangentPress', payload.state)
        hideHints()
      },
    )
    const subTangentClick = PubSub.subscribe(
      SpeechlyUiEvents.TangentRelease,
      (message: string, payload: { state: SpeechState, timeMs: number }) => {
        // console.log('TangentRelease ', payload.state, payload.timeMs)
        // Detect short record button presses
        if (payload.timeMs < SHORT_PRESS_TRESHOLD_MS) {
          switch (payload.state) {
            case SpeechState.Ready:
            case SpeechState.Recording:
            case SpeechState.Loading:
              if (timeout.current === null) {
                timeout.current = window.setTimeout(() => {
                  setVisible(true)
                  timeout.current = window.setTimeout(() => {
                    setVisible(false)
                    timeout.current = null
                  }, INSTRUCTION_SHOW_TIME_MS)
                }, INSTRUCTION_PREROLL_MS)
              }
          }
        }
      },
    )
    return () => {
      PubSub.unsubscribe(subTangentPress)
      PubSub.unsubscribe(subTangentClick)
    }
  }, [])

  const hideHints = (): void => {
    setVisible(false)
    if (timeout.current !== null) {
      clearTimeout(timeout.current)
      timeout.current = null
    }
  }

  return <Callout sourceAnchors={{ x: '50%', y: '6%' }} visible={visible} onClick={() => hideHints()}>Hold to talk</Callout>
}
