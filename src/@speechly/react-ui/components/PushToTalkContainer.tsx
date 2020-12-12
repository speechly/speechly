import React from 'react'
import styled from 'styled-components'

const PushToTalkContainerDiv = styled.div`
  width: 100vw;
  height: 9.2rem;
  position: fixed;
  bottom: 0;
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
export const PushToTalkButtonContainer: React.FC = props => {
  return <PushToTalkContainerDiv>{props.children}</PushToTalkContainerDiv>
}
