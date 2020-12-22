import { SpeechState } from '@speechly/react-client'
import React, { useEffect, useRef, useState } from 'react'
import { SpeechlyUiEvents } from '../types'
import { Callout } from './Callout'

export const HintCallout: React.FC = props => {
  const [visible, setVisible] = useState<boolean>(false)
  const timeout = useRef<number | null>(null)

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
        if (payload.state === SpeechState.Recording && payload.timeMs < 350) {
          if (timeout.current === null) {
            timeout.current = window.setTimeout(() => {
              setVisible(true)
              timeout.current = window.setTimeout(() => {
                setVisible(false)
                timeout.current = null
              }, 3000)
            }, 500)
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

  return <Callout sourceAnchors={['50%', '6%']} visible={visible} onClick={() => hideHints()}>Hold to talk</Callout>
}
