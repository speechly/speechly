import React, {
  useEffect,
  useCallback,
  SyntheticEvent,
  useReducer,
} from 'react'
import {
  useSpring,
  animated,
  interpolate,
  OpaqueInterpolation,
} from 'react-spring'
import { useKeyboardEvent } from '../hooks/useKeyboardEvent'
import { SpeechState, useSpeechContext } from '@speechly/react-client'
import PubSub from 'pubsub-js'
import styled, { keyframes, css } from 'styled-components'
import { SpeechlyUiEvents } from '../types'

/**
 * Properties for PushToTalkButton component.
 *
 * @public
 */
export type PushToTalkButtonProps = {
  /**
   * Keyboard key to use for controlling the button.
   * Passing e.g. ` ` (a spacebar) will mean that holding down the spacebar key will key the button pressed.
   */
  captureKey?: string

  /**
   * The size of the button, as CSS (e.g. `5rem`).
   */
  size?: string

  /**
   * Colours of the gradient around the button.
   * Valid input is an array of two hex colour codes, e.g. `['#fff', '#000']`.
   */
  gradientStops?: string[]

  /**
   * Drag start event
   */
  onDragStart?: () => void
}

/**
 * A React component that renders a push-to-talk microphone button.
 *
 * Make sure to place this component inside your `SpeechProvider` component imported from `@speechly/react-client`.
 *
 * @public
 */
export const PushToTalkButton: React.FC<PushToTalkButtonProps> = ({
  captureKey,
  size = '6.0rem',
  gradientStops = ['#15e8b5', '#4fa1f9'],
  onDragStart = () => {},
}) => {
  const { speechState, toggleRecording, initialise } = useSpeechContext()
  const [tangentButtonState, buttonDispatch] = useReducer(
    buttonReducer,
    ButtonDefaultState,
  )

  const [springProps, setSpringProps] = useSpring(() => ({
    holdScale: 1,
    effectOpacity: 0,
  }))

  useKeyboardEvent(
    async (event: KeyboardEvent) => {
      try {
        await onKeyPress(event)
      } catch (err) {
        console.error('Error handling onKeyPress', err)
      }
    },
    (event: KeyboardEvent) => onKeyRelease(event),
    [captureKey, speechState], // useState dependencies used in the callback, or in the functions used by the callback
  )

  const tangentPressAction = async (): Promise<void> => {
    // Speechly & Mic initialise needs to be here (a function triggered by event handler), otherwise it won't work reliably on Safari iOS as of 11/2020
    vibrate()

    if (isStartButtonVisible(speechState)) {
      setSpringProps({ holdScale: 1.35, config: { tension: 500 } })

      try {
        await initialise()
      } catch (err) {
        console.error('Error initiasing Speechly', err)
      }
    } else {
      setSpringProps({
        reset: false,
        effectOpacity: 1,
        holdScale: 1.35,
        config: { tension: 500 },
      })
      onDragStart()

      await micStart()
    }

    buttonDispatch({ type: TangentEvents.Hold })
  }

  const onTangentButtonPress = async (event: SyntheticEvent): Promise<void> => {
    event.preventDefault()
    event.stopPropagation()

    await tangentPressAction()
  }

  const onKeyPress = async (event: KeyboardEvent): Promise<void> => {
    if (captureKey !== undefined) {
      if (event.key === captureKey) {
        if (!event.repeat) {
          await tangentPressAction()
        }

        event.preventDefault()
        event.stopPropagation()
      }
    }
  }

  const onTangentButtonRelease = (event: SyntheticEvent): void => {
    buttonDispatch({ type: TangentEvents.Release })
  }

  const onKeyRelease = (event: KeyboardEvent): void => {
    if (event.key === captureKey) {
      buttonDispatch({ type: TangentEvents.Release })
    }
  }

  const micStart = useCallback(async () => {
    switch (speechState) {
      case SpeechState.Idle:
      case SpeechState.Recording:
      case SpeechState.Loading:
        return
    }

    await toggleRecording()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [speechState])

  const micStop = useCallback(async () => {
    switch (speechState) {
      case SpeechState.Idle:
      case SpeechState.Connecting:
      case SpeechState.Ready:
        return
    }

    await toggleRecording()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [speechState])

  // Handle tangent release (via button, keyboard hotkey)
  useEffect(() => {
    async function handle(): Promise<void> {
      let animateButtonToReleaseState = false

      if (tangentButtonState.processEvent) {
        PubSub.publish(SpeechlyUiEvents.TangentClick, { state: speechState })
        if (!tangentButtonState.mouseDrag) {
          vibrate()
          animateButtonToReleaseState = true

          if (!isStartButtonVisible(speechState)) {
            await micStop()
          }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
        buttonDispatch({ type: TangentEvents.Handled })
      }

      // Put button in resting state. Also do this on SpeechState.Ready as we may not get the keyboard up press due to permission prompt
      if (animateButtonToReleaseState || speechState === SpeechState.Ready) {
        setSpringProps({
          reset: false,
          effectOpacity: 0,
          holdScale: 1.0,
          config: { tension: 170 },
        })
      }
    }

    handle().catch((err) =>
      console.error('Error handling tangent release', err),
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tangentButtonState, speechState])

  const isStartButtonVisible = (state: SpeechState): boolean => {
    switch (state) {
      case SpeechState.Idle:
      case SpeechState.Connecting:
        return true
    }
    return false
  }

  // Track document mouseup to reliably release the mic if user drags outside button area.
  React.useEffect(() => {
    const handleMouseUp = (): void =>
      buttonDispatch({ type: TangentEvents.Cancel })
    document.addEventListener('mouseup', handleMouseUp)

    return () => {
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [])

  return (
    <MicWidgetDiv
      size={size}
      style={{
        transform: interpolate(
          [springProps.holdScale as OpaqueInterpolation<number>],
          (h) => {
            return `scale(${h})`
          },
        ),
      }}
    >
      <animated.div
        style={{
          opacity: springProps.effectOpacity as OpaqueInterpolation<number>,
        }}
      >
        <MicFx gradientStops={gradientStops} />
      </animated.div>
      {!isStartButtonVisible(speechState) && (
        <MicButton
          onMouseDown={onTangentButtonPress}
          onMouseUp={onTangentButtonRelease}
          gradientStops={gradientStops}
        >
          <MicIcon state={speechState} />
        </MicButton>
      )}
      {isStartButtonVisible(speechState) && (
        <MicButton
          onMouseDown={onTangentButtonPress}
          onMouseUp={onTangentButtonRelease}
          gradientStops={gradientStops}
        >
          <PowerIcon state={speechState} />
        </MicButton>
      )}
    </MicWidgetDiv>
  )
}

const MicFx: React.FC<{ gradientStops: string[] }> = (props) => {
  return (
    <MicFxSvg viewBox="0 0 246 246" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient x1="50%" y1="10%" x2="50%" y2="100%" id="a">
          <stop stopColor={props.gradientStops[0]} offset="0%" />
          <stop stopColor={props.gradientStops[1]} offset="100%" />
        </linearGradient>
        <filter
          x="-35%"
          y="-35%"
          width="170%"
          height="170%"
          filterUnits="objectBoundingBox"
          id="b"
        >
          <feGaussianBlur stdDeviation="18" in="SourceGraphic" />
        </filter>
      </defs>
      <circle
        filter="url(#b)"
        cx="124"
        cy="124"
        r="79"
        fill="url(#a)"
        fillRule="evenodd"
      />
    </MicFxSvg>
  )
}

const MicButton: React.FC<{
  onClick?: (e: SyntheticEvent) => void
  onMouseDown?: (e: SyntheticEvent) => void
  onMouseUp?: (e: SyntheticEvent) => void
  gradientStops: string[]
}> = (props) => {
  return (
    <StyledMicButton
      onClick={props.onClick}
      onMouseDown={props.onMouseDown}
      onMouseUp={props.onMouseUp}
      onTouchStart={props.onMouseDown}
      onTouchEnd={props.onMouseUp}
      onDragStart={props.onMouseDown}
      onDragEnd={props.onMouseUp}
    >
      <StyledButtonFrameSvg
        viewBox="0 0 92 92"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient x1="50%" y1="0%" x2="50%" y2="100%" id="a">
            <stop stopColor={props.gradientStops[0]} offset="0%" />
            <stop stopColor={props.gradientStops[1]} offset="100%" />
          </linearGradient>
        </defs>
        <g fill="none" fillRule="nonzero">
          <path
            d="M46 3.119c23.683 0 42.881 19.198 42.881 42.881S69.683 88.881 46 88.881 3.119 69.683 3.119 46 22.317 3.119 46 3.119z"
            fill="#FFF"
          />
          <path
            d="M46 0C20.595 0 0 20.595 0 46s20.595 46 46 46 46-20.595 46-46S71.405 0 46 0zm0 3.119c23.683 0 42.881 19.198 42.881 42.881S69.683 88.881 46 88.881 3.119 69.683 3.119 46 22.317 3.119 46 3.119z"
            fill="url(#a)"
          />
        </g>
      </StyledButtonFrameSvg>
      {props.children}
    </StyledMicButton>
  )
}

const MicIcon: React.FC<{ state: string }> = (props) => {
  switch (props.state) {
    case SpeechState.Failed:
    case SpeechState.NoBrowserSupport:
      return (
        <MicIconSvg
          state={props.state}
          viewBox="0 0 56 56"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g fill="#000" fillRule="evenodd">
            <path
              d="M42 26h4v4c0 9.265-7 16.895-16 17.89V55h-4v-7.11c-8.892-.982-15.833-8.444-15.997-17.56L10 30v-4h4v4c0 7.732 6.268 14 14 14 7.628 0 13.83-6.1 13.997-13.687L42 30v-4z"
              fillRule="nonzero"
            />
            <path d="M37 13.081V31a8 8 0 11-16 0v-1.919l16-16zM26 1a8 8 0 018 8v1.319L18 26.318V9a8 8 0 018-8zM37.969 7.932l3.74-7.35 3.018 2.625zM39.654 10.608l7.531-3.359.695 3.94z" />
          </g>
        </MicIconSvg>
      )
    case SpeechState.NoAudioConsent:
      return (
        <MicIconSvg
          state={props.state}
          viewBox="0 0 56 56"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g fill="#000" fillRule="nonzero">
            <path d="M36 14.828V30a8 8 0 01-15.961.79l15.96-15.962zM28 1a8 8 0 018 8v.172L20 25.173V9a8 8 0 018-8z" />
            <path d="M42 26h4v4c0 9.265-7 16.895-16 17.89V55h-4v-7.11c-8.892-.982-15.833-8.444-15.997-17.56L10 30v-4h4v4c0 7.732 6.268 14 14 14 7.628 0 13.83-6.1 13.997-13.687L42 30v-4z" />
          </g>
        </MicIconSvg>
      )
    default:
      return (
        <MicIconSvg
          state={props.state}
          viewBox="0 0 56 56"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g fill="#000" fillRule="evenodd">
            <path d="M42 26h4v4c0 9.265-7 16.895-16 17.89V55h-4v-7.11c-8.892-.982-15.833-8.444-15.997-17.56L10 30v-4h4v4c0 7.732 6.268 14 14 14 7.628 0 13.83-6.1 13.997-13.687L42 30v-4z" />
            <rect x="20" y="1" width="16" height="37" rx="8" />
          </g>
        </MicIconSvg>
      )
  }
}

const PowerIcon: React.FC<{ state: string }> = (props) => {
  return (
    <MicIconSvg
      state={props.state}
      viewBox="0 0 56 56"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g fill="#000" fillRule="evenodd">
        <path
          d="M52 28c0 13.255-10.745 24-24 24S4 41.255 4 28c0-8.921 4.867-16.705 12.091-20.842l1.984 3.474C12.055 14.08 8 20.566 8 28c0 11.046 8.954 20 20 20s20-8.954 20-20c0-7.434-4.056-13.92-10.075-17.368L39.91 7.16C47.133 11.296 52 19.079 52 28z"
          fillRule="nonzero"
        />
        <rect x="24" y="1" width="8" height="23" rx="4" />
      </g>
    </MicIconSvg>
  )
}

const MicColorSpinKeys = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`

const MicOpacityPulseKeys = keyframes`
  0% {
    opacity: 0.1;
  }
  50% {
    opacity: 0.25;
  }
  100% {
    opacity: 0.1;
  }
`

const MicWidgetDiv = styled(animated.div)<{ size: string }>`
  width: ${(props) => props.size};
  height: ${(props) => props.size};
  position: relative;
`

const StyledMicButton = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: auto;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  -webkit-touch-callout: none !important;
  -webkit-user-select: none !important;
`

const StyledButtonFrameSvg = styled.svg`
  @media (prefers-reduced-motion: no-preference) {
    animation: ${MicColorSpinKeys} infinite 2.5s linear;
  }
`

const MicFxSvg = styled.svg`
  top: -75%;
  left: -75%;
  height: 250%;
  width: 250%;
  position: absolute;
  pointer-events: none;
  @media (prefers-reduced-motion: no-preference) {
    animation: ${MicColorSpinKeys} infinite 2.5s linear;
  }
`

const MicIconSvg = styled.svg<{ state: string }>`
  width: auto;
  height: 60%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
  transition: 0.25s;
  ${(props) => {
    switch (props.state) {
      case SpeechState.Idle:
        return css`
          animation: ${MicOpacityPulseKeys} 4.5s infinite;
          transition: 0.25s;
        `
      case SpeechState.NoAudioConsent:
      case SpeechState.Failed:
      case SpeechState.NoBrowserSupport:
        return css`
          opacity: 0.1;
          transition: 0.25s;
        `
      case SpeechState.Connecting:
      case SpeechState.Loading:
        return css`
          animation: ${MicOpacityPulseKeys} 1s infinite;
          transition: 0.25s;
        `
    }
  }}
`

const vibrate = (durationMs: number = 5): void => {
  if (navigator.vibrate !== undefined) {
    navigator.vibrate(durationMs)
  }
}

type IButtonState = {
  processEvent: boolean
  mouseDrag: boolean
}

enum TangentEvents {
  Hold = 'Hold',
  Release = 'Release',
  Cancel = 'Cancel',
  Handled = 'Handled',
}

const ButtonDefaultState: IButtonState = {
  mouseDrag: false,
  processEvent: false,
}

const buttonReducer = (state: IButtonState, action: any): IButtonState => {
  switch (action.type) {
    case TangentEvents.Hold: {
      if (state.mouseDrag) return state
      return {
        ...state,
        mouseDrag: true,
        processEvent: true,
      }
    }
    case TangentEvents.Cancel:
    case TangentEvents.Release: {
      if (!state.mouseDrag) return state
      return {
        ...state,
        mouseDrag: false,
        processEvent: true,
      }
    }
    case TangentEvents.Handled: {
      return {
        ...state,
        processEvent: false,
      }
    }
    default:
      throw new Error()
  }
}
