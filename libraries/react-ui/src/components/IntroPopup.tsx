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
}

/**
 *
 * @public
 */
export const IntroPopup: React.FC<IntroPopupProps> = ({
  appId,
  children,
}) => {
  const { clientState } = useSpeechContext()
  const [loaded, setLoaded] = useState(false)

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
    <intro-popup clientstate={clientState} appid={appId}>
      {children}
    </intro-popup>
  )
}
