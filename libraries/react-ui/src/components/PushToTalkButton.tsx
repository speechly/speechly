import React, { useEffect, useRef, useState } from 'react'
import { AudioSourceState, DecoderState, useSpeechContext } from '@speechly/react-client'
import { LocalStorageKeys, MessageType } from '@speechly/browser-ui'
import PubSub from 'pubsub-js'
import { SpeechlyUiEvents } from '../types'
import { PushToTalkButtonContainer } from '..'
import styled from 'styled-components'

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
  powerOn?: boolean | 'auto'

  /**
   * Optional CSS string. Vertical distance from viewport edge. Only effective when using placement.
   */
  voffset?: string

  /**
   * Optional time in milliseconds to listen after tap. Set to 0 to disable tap-to-talk. Default: "8000" (ms)
   */
  tapToTalkTime?: number

  /**
   * Optional milliseconds of silence to listen before hangup. Only used in tap-to-talk mode. Default: "1000" (ms)
   */
  silenceToHangupTime?: number

}

/**
 * A React component that renders a push-to-talk microphone button.
 *
 * Make sure to place this component inside your `SpeechProvider` component imported from `@speechly/react-client`.
 *
 * @public
 */

type IButtonState = {
  tapListenActive: boolean
  wasListening: boolean
  holdListenActive: boolean
  tapListenTimeout: number | null
  tangentPressPromise: Promise<void> | null
}

export const PushToTalkButton: React.FC<PushToTalkButtonProps> = ({
  powerOn = false,
  hide = false,
  captureKey,
  size,
  gradientStops = ['#15e8b5', '#4fa1f9'],
  intro = 'Hold to talk',
  hint = 'Hold to talk',
  fontSize = '100%',
  showTime,
  textColor = '#ffffff',
  backgroundColor,
  placement,
  voffset,
  tapToTalkTime = 8000,
  silenceToHangupTime = 1000,
}) => {
  const { client, clientState, microphoneState, attachMicrophone, start, stop, segment } = useSpeechContext()
  const [loaded, setLoaded] = useState(false)
  const [icon, setIcon] = useState<string>(DecoderState.Disconnected as unknown as string)
  const [hintText, setHintText] = useState<string>(intro)
  const [showHint, setShowHint] = useState(true)
  const [usePermissionPriming, setUsePermissionPriming] = useState(powerOn === true)
  const buttonStateRef = useRef<IButtonState>({
    tapListenActive: false,
    wasListening: false,
    holdListenActive: false,
    tapListenTimeout: null,
    tangentPressPromise: null,
  })
  const buttonRef = useRef<any>()

  const TAP_TRESHOLD_MS = 600
  const PERMISSION_PRE_GRANTED_TRESHOLD_MS = 1500

  // make stateRef always have the current count
  // your "fixed" callbacks can refer to this object whenever
  // they need the current value.  Note: the callbacks will not
  // be reactive - they will not re-run the instant state changes,
  // but they *will* see the current value whenever they do run
  const clientStateRef = useRef<DecoderState>(clientState)
  const microphoneStateRef = useRef<AudioSourceState>(microphoneState)

  // Dynamic import of HTML custom element to play nice with Next.js SSR
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    (async () => {
      const import1 = import('@speechly/browser-ui/core/holdable-button')
      const import2 = import('@speechly/browser-ui/core/call-out')
      await Promise.all([import1, import2])

      setLoaded(true)
    })()
  }, [])

  // Use browser API only after mount to play nice with Next.js SSR
  useEffect(() => {
    if (powerOn === 'auto') {
      setUsePermissionPriming(localStorage.getItem(LocalStorageKeys.SpeechlyFirstConnect) === null)
    }
  }, [powerOn])

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (buttonRef?.current) {
      const button = buttonRef.current
      button.onholdstart = tangentPressAction
      button.onholdend = tangentReleaseAction
    }
  })

  useEffect(() => {
    clientStateRef.current = clientState
    microphoneStateRef.current = microphoneState

    // Change button appearance according to Speechly states
    switch (microphoneState) {
      case AudioSourceState.NoAudioConsent:
      case AudioSourceState.NoBrowserSupport:
        setIcon(microphoneState)
        break
      default:
        setIcon(clientState as unknown as string)
        break
    }

    if (clientState >= DecoderState.Connected && microphoneState === AudioSourceState.Started) {
      setUsePermissionPriming(false)
      // Set connect made
      if (localStorage.getItem(LocalStorageKeys.SpeechlyFirstConnect) === null) {
        localStorage.setItem(LocalStorageKeys.SpeechlyFirstConnect, String(Date.now()))
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientState, microphoneState])

  const tangentPressAction = async (): Promise<void> => {
    if (!client) {
      throw Error('No Speechly client (are you using Speechly in non-browser environment?)')
    }

    buttonStateRef.current.tangentPressPromise = (async() => {
      PubSub.publish(SpeechlyUiEvents.TangentPress, { state: clientStateRef.current })
      window.postMessage({ type: 'holdstart', state: clientStateRef.current, audioSourceState: microphoneStateRef.current }, '*')
      setShowHint(false)

      if (usePermissionPriming) {
        window.postMessage({
          type: MessageType.speechlypoweron,
        }, '*')
      } else {
        if (buttonStateRef.current.tapListenTimeout) {
          window.clearTimeout(buttonStateRef.current.tapListenTimeout)
          buttonStateRef.current.tapListenTimeout = null
        }

        if (clientStateRef.current >= DecoderState.Connected && microphoneStateRef.current === AudioSourceState.Started) {
          buttonStateRef.current.holdListenActive = true
        } else {
          // Speechly & Mic initialise needs to be in a function triggered by event handler
          const initStartTime = Date.now()
          try {
            await attachMicrophone()
          } catch (err) {
            console.error('Error initializing Speechly', err)
          }
          // Long init time suggests permission dialog --> prevent listening start
          buttonStateRef.current.holdListenActive = Date.now() - initStartTime < PERMISSION_PRE_GRANTED_TRESHOLD_MS
        }

        // Start listening
        if (buttonStateRef.current.holdListenActive) {
          buttonStateRef.current.wasListening = client.isActive()
          if (!client.isActive()) {
            try {
              await start()
            } catch (err) {
              console.error('Error while starting to record', err)
            }
          }
        }
      }
    })()
  }

  const tangentReleaseAction = async (event: any): Promise<void> => {
    // Ensure async tangentPress and Release are run in appropriate order
    await buttonStateRef.current.tangentPressPromise

    PubSub.publish(SpeechlyUiEvents.TangentRelease, { state: clientStateRef.current, timeMs: event.timeMs })
    window.postMessage({ type: 'holdend' }, '*')

    if (buttonStateRef.current.holdListenActive) {
      buttonStateRef.current.holdListenActive = false

      if (event.timeMs < TAP_TRESHOLD_MS) {
        if (tapToTalkTime === 0) {
          stopListening()
          setHintText(hint)
          setShowHint(true)
        } else {
          // Tap: toggle listening on/off
          if (buttonStateRef.current.wasListening) {
            stopListening()
          } else {
            // schedule "silence based stop"
            setStopContextTimeout(tapToTalkTime)
          }
        }
      } else {
        stopListening()
      }
    }
  }

  const setStopContextTimeout = (timeoutMs: number): void => {
    buttonStateRef.current.tapListenActive = true
    if (buttonStateRef.current.tapListenTimeout) {
      window.clearTimeout(buttonStateRef.current.tapListenTimeout)
    }
    buttonStateRef.current.tapListenTimeout = window.setTimeout(() => {
      buttonStateRef.current.tapListenTimeout = null
      stopListening()
    }, timeoutMs)
  }

  const stopListening = (): void => {
    buttonStateRef.current.tapListenActive = false
    if (client?.isActive()) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        stop()
      } catch (err) {
        console.error('Error while stopping recording', err)
      }
    }
  }

  /**
   * Extend listening time if segment updates received
   */
  useEffect(() => {
    if (segment) {
      if (buttonStateRef.current.tapListenTimeout) {
        setStopContextTimeout(silenceToHangupTime)
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [segment])

  if (!loaded) return null

  return (
    <MicButtonDiv textColor={textColor} fontSize={fontSize}>
      { (placement === 'bottom') && (
        <PushToTalkButtonContainer size={size} voffset={voffset}>
          <holdable-button ref={buttonRef} poweron={powerOn} capturekey={captureKey} icon={icon} size={size} gradientstop1={gradientStops[0]} gradientstop2={gradientStops[1]} hide={hide ? 'true' : 'false'}></holdable-button>
          <call-out show={showHint && hintText !== ''} backgroundcolor={backgroundColor} showtime={showTime}>{hintText}</call-out>
        </PushToTalkButtonContainer>
      )}
      { (placement !== 'bottom') && (
        <>
          <holdable-button ref={buttonRef} poweron={powerOn} capturekey={captureKey} icon={icon} size={size} gradientstop1={gradientStops[0]} gradientstop2={gradientStops[1]} hide={hide ? 'true' : 'false'}></holdable-button>
          <call-out show={showHint && hintText !== ''} backgroundcolor={backgroundColor} showtime={showTime}>{hintText}</call-out>
        </>
      )}
    </MicButtonDiv>
  )
}

const MicButtonDiv = styled.div<{textColor: string, fontSize: string}>`
  font-family: 'Saira Condensed', sans-serif;
  color: ${(props) => props.textColor};
  font-size: ${(props) => props.fontSize};
  line-height: 120%;
  text-transform: uppercase;
`
