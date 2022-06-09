import { MessageType } from '@speechly/browser-ui'
import { useSpeechContext } from '@speechly/react-client'
import React, { useEffect, useState } from 'react'

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      'intro-popup': any
    }
  }
}

/**
 * Properties for IntroPopup component.
 *
 * @public
 */
export type IntroPopupProps = {
  appId?: string
  children?: React.ReactNode
}

/**
 *
 * @public
 */
export const IntroPopup: React.FC<IntroPopupProps> = ({
  appId,
  children,
}) => {
  const { clientState, microphoneState, attachMicrophone } = useSpeechContext()
  const [loaded, setLoaded] = useState(false)
  let refElement: HTMLElement | null = null

  const initMic = (): void => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    (async() => {
      await attachMicrophone()
    })()
  }

  const setRef = (el: HTMLElement): void => {
    if (el !== null) {
      refElement = el
      refElement.addEventListener(MessageType.requeststartmicrophone, initMic)
    } else if (refElement !== null) {
      refElement.removeEventListener(MessageType.requeststartmicrophone, initMic)
    }
  }

  // Dynamic import of HTML custom element to play nice with Next.js SSR
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    (async () => {
      await import('@speechly/browser-ui/core/intro-popup')
      setLoaded(true)
    })()
  }, [])

  if (!loaded) return null

  return (
    <intro-popup ref={setRef} clientstate={clientState} microphonestate={microphoneState} appid={appId}>
      {children}
    </intro-popup>
  )
}
