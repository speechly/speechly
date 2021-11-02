import React from 'react'
import '@speechly/browser-ui/error-panel'

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
  return (
    <error-panel placement={placement}></error-panel>
  )
}
