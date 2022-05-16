import React, { useEffect } from 'react'
import { useSpring, animated, config } from 'react-spring'
import styled from 'styled-components'
import { SpeechlyUiEvents } from '../types'

type InfoProps = {
  visible: boolean
  color: string
  backgroundcolor: string
  children?: React.ReactNode
}

export const Info: React.FC<InfoProps> = props => {
  const [springProps, setSpringProps] = useSpring(() => ({
    to: {
      opacity: 0,
      maxHeight: '0rem',
      marginBottom: '0rem',
    },
  }))

  useEffect(() => {
    if (props.visible) {
      setSpringProps({
        to: async (next: any, cancel: any) => {
          await next({
            maxHeight: '10rem',
            marginBottom: '1.5rem',
            opacity: 1,
          })
        },
        config: config.stiff,
      })
    } else {
      setSpringProps({
        to: async (next: any, cancel: any) => {
          await next({
            opacity: 0,
          })
          await next({
            maxHeight: '0rem',
            marginBottom: '0rem',
          })
        },
        config: config.stiff,
      })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.visible])

  return (
    <InfoItemDiv onClick={() => PubSub.publish(SpeechlyUiEvents.DismissNotification)}
      className="Warning"
      style={springProps}
    >
      <InfoItemBgDiv backgroundcolor={props.backgroundcolor}/>
      <InfoItemContent color={props.color}>
        {props.children}
      </InfoItemContent>
    </InfoItemDiv>
  )
}

const InfoItemDiv = styled(animated.div)`
  user-select: none;
  pointer-events: auto;
  position: relative;
  display: inline-block;
`

const InfoItemContent = styled(animated.div)`
  z-index: 1;
  font-size: 1.2rem;
  line-height: 110%;
  // color: #000;
  display: flex;
  flex-direction: row;
  align-items: center;
`

const InfoItemBgDiv = styled(animated.div)<{backgroundcolor: string}>`
  position: absolute;
  box-sizing: content-box;
  width: 100%;
  height: 100%;
  top: -0.5rem;
  left: -0.8rem;
  margin: 0;
  padding: 0.5rem 0.8rem;
  background-color: ${(props) => props.backgroundcolor};
  z-index: -1;
`
