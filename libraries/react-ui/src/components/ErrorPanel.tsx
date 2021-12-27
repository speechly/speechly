import React, { useEffect, useState } from 'react'

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      'error-panel': any
    }
  }
}

/**
 * Properties for BigTranscript component.
 *
 * @public
 */
export type ErrorPanelProps = {
  /**
   * Optional "bottom" string turns on internal placement without any CSS positioning.
   */
  placement?: string
}

/**
 * An optional dismissable React component that renders an error message if something
 * prevents Speechly SDK from functioning. It also provides recovery instructions.
 * <ErrorPanel> responds to <PushToTalkButton> presses so it needs to exist somewhere in the component hierarchy.
 *
 * It is intented to be displayed at the lower part of the screen like so:
 * <ErrorPanel placement="bottom"/>
 *
 * @public
 */
export const ErrorPanel: React.FC<ErrorPanelProps> = ({
  placement = 'bottom',
}) => {
  const [loaded, setLoaded] = useState(false)

  // Dynamic import of HTML custom element to play nice with Next.js SSR
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    (async () => {
      await import('@speechly/browser-ui/core/error-panel')
      setLoaded(true)
    })()
  }, [])

  if (!loaded) return null

  return (
    <error-panel placement={placement}></error-panel>
  )
}
