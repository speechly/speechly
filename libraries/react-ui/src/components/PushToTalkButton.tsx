import React, { useEffect, useRef, useState } from 'react'
import { SpeechState, useSpeechContext } from '@speechly/react-client'
import PubSub from 'pubsub-js'
import { mapSpeechStateToClientState, SpeechlyUiEvents } from '../types'
import '@speechly/browser-ui/holdable-button'
import '@speechly/browser-ui/call-out'
import { PushToTalkButtonContainer } from '..'

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      'holdable-button': any
    }
    interface IntrinsicElements {
      'call-out': any
    }
  }
}

/**
 * Properties for PushToTalkButton component.
 *
 * @public
 */
export type PushToTalkButtonProps = {
  /**
   * Optional "bottom" string turns on internal placement without any CSS positioning.
   */
  placement?: string
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
   * Optional boolean. Default: false
   */
  hide?: boolean
  /**
   * Optional string containing a short usage introduction. Displayed when the component is first displayed. Default: "Push to talk". Set to "" to disable.
   */
  intro?: string
  /**
   * Optional string containing a short usage hint. Displayed on a short tap. Default: "Push to talk". Set to "" to disable.
   */
  hint?: string
  /**
   * Optional CSS string for hint text. Default: "1.2rem"
   */
  fontSize?: string
  /**
   * Optional number in ms. Visibility duration for intro and hint callouts. Default: "5000" (ms)
   */
  showTime?: number
  /**
   * Optional string (CSS color) for hint text. Default: "#ffffff"
   */
  textColor?: string
  /**
   * Optional string (CSS color) for hint text background. Default: "#202020"
   */
  backgroundColor?: string
  /**
   * Optional boolean. Shows poweron state. If false, recording can immediately start but will first press will cause a system permission prompt. Default: false
   */
  powerOn?: boolean
}

/**
 * A React component that renders a push-to-talk microphone button.
 *
 * Make sure to place this component inside your `SpeechProvider` component imported from `@speechly/react-client`.
 *
 * @public
 */

export const PushToTalkButton: React.FC<PushToTalkButtonProps> = ({
  powerOn = false,
  hide = false,
  captureKey,
  size = '6.0rem',
  gradientStops = ['#15e8b5', '#4fa1f9'],
  intro = 'Hold to talk',
  hint = 'Hold to talk',
  fontSize,
  showTime,
  textColor,
  backgroundColor,
  placement,
}) => {
  const { speechState, toggleRecording, initialise } = useSpeechContext()
  const [icon, setIcon] = useState<string>((powerOn ? SpeechState.Idle : SpeechState.Ready) as string)
  const [hintText, setHintText] = useState<string>(intro)
  const [showHint, setShowHint] = useState(true)
  const buttonRef = useRef<any>()
  const speechStateRef = useRef<SpeechState>()

  const SHORT_PRESS_TRESHOLD_MS = 600

  // make stateRef always have the current count
  // your "fixed" callbacks can refer to this object whenever
  // they need the current value.  Note: the callbacks will not
  // be reactive - they will not re-run the instant state changes,
  // but they *will* see the current value whenever they do run
  speechStateRef.current = speechState

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (buttonRef?.current) {
      const button = buttonRef.current
      button.onholdstart = tangentPressAction
      button.onholdend = tangentReleaseAction
    }
  })

  useEffect(() => {
    // Change button face according to Speechly states
    if (!powerOn && speechState === SpeechState.Idle) {
      setIcon(SpeechState.Ready as string)
    } else {
      setIcon(speechState as string)
    }

    // Automatically start recording if button held
    if (!powerOn && buttonRef?.current?.isbuttonpressed() === true && speechState === SpeechState.Ready) {
      toggleRecording().catch(err => console.error('Error while starting to record', err))
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [speechState])

  const tangentPressAction = (): void => {
    PubSub.publish(SpeechlyUiEvents.TangentPress, { state: speechStateRef.current })
    window.postMessage({ type: 'holdstart', state: mapSpeechStateToClientState(speechStateRef.current !== undefined ? speechStateRef.current : SpeechState.Idle) }, '*')
    setShowHint(false)

    switch (speechStateRef.current) {
      case SpeechState.Idle:
      case SpeechState.Failed:
        // Speechly & Mic initialise needs to be in a function triggered by event handler
        // otherwise it won't work reliably on Safari iOS as of 11/2020
        initialise().catch(err => console.error('Error initiasing Speechly', err))
        break
      case SpeechState.Ready:
        toggleRecording().catch(err => console.error('Error while starting to record', err))
        break
      default:
        break
    }
  }

  const tangentReleaseAction = (event: any): void => {
    PubSub.publish(SpeechlyUiEvents.TangentRelease, { state: speechStateRef.current, timeMs: event.timeMs })
    window.postMessage({ type: 'holdend' }, '*')

    switch (speechStateRef?.current) {
      case SpeechState.Ready:
      case SpeechState.Recording:
      case SpeechState.Connecting:
      case SpeechState.Loading:
        if (event.timeMs < SHORT_PRESS_TRESHOLD_MS) {
          console.log(speechStateRef?.current)
          setHintText(hint)
          setShowHint(true)
        }
        break
    }

    switch (speechStateRef.current) {
      case SpeechState.Recording:
        toggleRecording().catch(err => console.error('Error while stopping recording', err))
        break
      default:
        break
    }
  }

  return (
    <div>
      { (placement === 'bottom') && (
        <PushToTalkButtonContainer>
          <holdable-button ref={buttonRef} poweron={powerOn} capturekey={captureKey} icon={icon} size={size} gradientstop1={gradientStops[0]} gradientstop2={gradientStops[1]} hide={hide ? 'true' : 'false'}></holdable-button>
          <call-out show={showHint && hintText !== ''} fontsize={fontSize} textcolor={textColor} backgroundcolor={backgroundColor} showtime={showTime}>{hintText}</call-out>
        </PushToTalkButtonContainer>
      )}
      { (placement !== 'bottom') && (
        <>
          <holdable-button ref={buttonRef} poweron={powerOn} capturekey={captureKey} icon={icon} size={size} gradientstop1={gradientStops[0]} gradientstop2={gradientStops[1]} hide={hide ? 'true' : 'false'}></holdable-button>
          <call-out show={showHint && hintText !== ''} fontsize={fontSize} textcolor={textColor} backgroundcolor={backgroundColor} showtime={showTime}>{hintText}</call-out>
        </>
      )}
    </div>
  )
}
