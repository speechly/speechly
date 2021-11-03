import React from 'react'
import styled from 'styled-components'
import { Notifications } from './Notifications'

/**
 * Properties for BigTranscriptContainer component.
 *
 * @public
 */
export type BigTranscriptContainerProps = {
  /**
   * The override value for CSS position (default: `"fixed"`).
   */
  position?: string

  /**
   * The override value for CSS margin(default: `"3rem 2rem 0 2rem"`).
   */
  margin?: string
}

const BigTranscriptContainerDiv = styled.div<{
  position: string
  margin: string
}>`
  position: ${(props) => props.position};
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: ${(props) => props.margin};
  z-index: 50;
  pointer-events: none;
  display: flex;
  flex-direction: column;
  align-items: start;

  color: #fff;
  font-size: 1.4rem;
`

/**
 * A React component that can be used for wrapping and positioning BigTranscript components.
 *
 * The intended usage is as follows:
 *
 * <BigTranscriptContainer>
 *   <BigTranscript />
 * </BigTranscriptContainer>
 *
 * And then you can use CSS for styling the layout.
 *
 * @public
 */

export const BigTranscriptContainer: React.FC<BigTranscriptContainerProps> = ({
  position = 'fixed',
  margin = '3rem 2rem 0 2rem',
  children,
}) => {
  return (
    <BigTranscriptContainerDiv position={position} margin={margin}>
      <Notifications />
      {children}
    </BigTranscriptContainerDiv>
  )
}
