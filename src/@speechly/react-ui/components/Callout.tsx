import React from 'react'
import styled from 'styled-components'
import { animated, useSpring } from 'react-spring'

const CalloutContainerDiv = styled(animated.div)<{ax: string, ay: string, halign: string, valign: string, arrowpad: string}>`
  position: absolute;
  left: ${props => `${props.ax}`};
  top: ${props => `${props.ay}`};
  transform: ${props => `translate(calc(-1 * ${props.halign}), calc(-1 * ${props.valign}));`};
  padding: ${props => `${props.arrowpad}`};
  z-index: 10;
  pointer-events: auto;
`

const CalloutDiv = styled.div<{useShadow: boolean, backgroundColor: string, borderRadius?: string}>`
  position: relative;
  box-sizing: border-box;
  min-width: 8rem;
  ${props => props.borderRadius !== undefined && `border-radius: ${props.borderRadius}`};
  padding: 0.75rem 1rem;
  ${props => `background-color: ${props.backgroundColor}`};
  ${props => props.useShadow && 'box-shadow: 0 0.2rem 0.5rem #00000040'};
  text-align: center;
  user-select: none;
  color:#fff;
  z-index: 10;
`

const ArrowDiv = styled.div<{size: string, backgroundColor: string, ax: string, ay: string, offsetX: string, offsetY: string}>`
  position: absolute;
  left: ${props => `calc(${props.ax} - ${props.offsetX})`};
  top: ${props => `calc(${props.ay} - ${props.offsetY})`};

  transform: translate(-50%, -50%) rotate(45deg);
  width: ${props => `${props.size}`};
  height: ${props => `${props.size}`};
  ${props => `background-color: ${props.backgroundColor}`};
  z-index: 10;
`

const ArrowShadowDiv = styled.div<{size: string, ax: string, ay: string, offsetX: string, offsetY: string}>`
  position: absolute;
  left: ${props => `calc(${props.ax} - ${props.offsetX})`};
  top: ${props => `calc(${props.ay} - ${props.offsetY})`};

  transform: translate(-50%, -50%) rotate(45deg);
  width: ${props => `${props.size}`};
  height: ${props => `${props.size}`};
  background-color: #00000000;
  box-shadow: 0 0.2rem 0.5rem #00000040;
  z-index: 9;
`

type CalloutProps = {
  visible?: boolean
  onClick?: () => void
  sourceAnchors?: string[]
  destAnchors?: string[]
  cssUnit?: string
  arrowSize?: number
  useShadow?: boolean
  backgroundColor?: string
  borderRadius?: string
}

export const Callout: React.FC<CalloutProps> = ({
  children,
  onClick = () => {},
  sourceAnchors = ['50%', '5%'],
  destAnchors = ['50%', '100%'],
  visible = true,
  cssUnit = 'rem',
  arrowSize = 0.5,
  useShadow = false,
  backgroundColor = '#000',
  borderRadius,
}) => {
  const springProps = useSpring({
    v: visible ? 1 : 0,
    config: { tension: 200 },
  })

  return (
    <CalloutContainerDiv ax={sourceAnchors[0]} ay={sourceAnchors[1]} halign={destAnchors[0]} valign={destAnchors[1]} arrowpad={`${arrowSize}${cssUnit}`} onClick={() => onClick()} style={{
      display: springProps.v.getValue() as number > 0 ? 'block' : 'hidden',
      clipPath: springProps.v.interpolate(x => `circle(${x as number * 100}% at center)`),
    }}>
      <CalloutDiv useShadow={useShadow} backgroundColor={backgroundColor} borderRadius={borderRadius}>{children}</CalloutDiv>
      <ArrowDiv backgroundColor={backgroundColor} size={`${arrowSize * Math.sqrt(2)}${cssUnit}`} ax="50%" ay="100%" offsetX="0rem" offsetY={`${arrowSize}${cssUnit}`}/>
      {useShadow && <ArrowShadowDiv size={`${arrowSize * Math.sqrt(2)}${cssUnit}`} ax="50%" ay="100%" offsetX="0rem" offsetY={`${arrowSize}${cssUnit}`}/>}
    </CalloutContainerDiv>
  )
}
