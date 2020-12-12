import React from 'react'
import styled from 'styled-components'

const BigTranscriptContainerDiv = styled.div`
  position: absolute;
  top: 3rem;
  left: 2rem;
  right: 2rem;
  z-index: 10;

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
export const BigTranscriptContainer: React.FC = props => {
  return <BigTranscriptContainerDiv>{props.children}</BigTranscriptContainerDiv>
}
