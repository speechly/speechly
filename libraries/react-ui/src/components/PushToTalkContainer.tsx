import React from 'react'
import styled from 'styled-components'

/**
 * Properties for BigTranscriptContainer component.
 *
 * @public
 */
export type PushToTalkContainerProps = {
  /**
   * Optional string (CSS). Defines the button frame width and height. Default: "6rem"
   */
  size?: string

  /**
   * Optional CSS string. Vertical distance from viewport edge. Default: "3rem"
   */
  voffset?: string
}

const PushToTalkContainerDiv = styled.div<{
  size: string
  voffset: string
}>`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: calc(${(props) => props.size} + ${(props) => props.voffset});
  max-height: 100vh;
  pointer-events: none;

  display: flex;
  flex-direction: row;
  justify-content: center;
  z-index: 50;
`

/**
 * A React component that can be used for wrapping and positioning PushToTalkButton components.
 *
 * The intended usage is as follows:
 *
 * <PushToTalkButtonContainer>
 *   <PushToTalkButton />
 * </PushToTalkButtonContainer>
 *
 * And then you can use CSS for styling the layout.
 *
 * @public
 */
export const PushToTalkButtonContainer: React.FC<PushToTalkContainerProps> = ({
  size = '6rem',
  voffset = '3rem',
  children,
}) => {
  return <PushToTalkContainerDiv size={size} voffset={voffset}>{children}</PushToTalkContainerDiv>
}
