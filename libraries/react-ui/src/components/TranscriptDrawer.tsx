import React, { useEffect, useRef, useState } from 'react'
import { SpeechSegment, useSpeechContext } from '@speechly/react-client'

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      'transcript-drawer': any
    }
  }
}

/**
 * Properties for BigTranscript component.
 *
 * @public
 */
export type TranscriptDrawerProps = {
  /**
   * Optional "top" string turns on internal placement without any CSS positioning.
   */
  placement?: string
  /**
   * Optional boolean. If true, transcript is formatted with detected entities, e.g. numbers. Default: true
   */
  formatText?: boolean
  /**
   * Optional CSS string for text size. Default: "1.5rem"
   */
  fontSize?: string
  /**
   * Optional string (CSS color) for text. Default: "#ffffff"
   */
  color?: string
  /**
   * Optional string (CSS color) for entity highlighting, vu meter and acknowledged icon. Default: "#15e8b5"
   */
  highlightColor?: string
  /**
   * Optional string (CSS color) for hint text background. Default: "#202020"
   */
  backgroundColor?: string
  /**
   * Optional string (CSS dimension). Dynamic margin added when element is visible. Default: "0rem"
   */
  marginBottom?: string
  /**
   * Optional SpeechSegment to be displayed instead of actual transcription from API. Can be used to demonstrate voice functionality to the user.
   */
  mockSegment?: SpeechSegment | undefined
  /**
   * Optional hint text or array
   */
  hint?: string | string[]
  /**
   * Optional minimum height as CSS string. Default: "8rem"
   */
  height?: string
  /**
   * Optional string (CSS color) for hint text. Default: "#ffffff70"
   */
  smallTextColor?: string
  /**
   * Optional CSS string for hint text size. Default: "0.9rem"
   */
  hintFontSize?: string
}

/**
 * A React component that renders the transcript and entities received from Speechly SLU API.
 *
 * The component is intended to be used for providing visual feedback to the speaker.
 *
 * @public
 */
export const TranscriptDrawer: React.FC<TranscriptDrawerProps> = props => {
  const { segment, clientState } = useSpeechContext()
  const refElement = useRef<any>()
  const [loaded, setLoaded] = useState(false)
  const [demoMode, setDemoMode] = useState(false)

  // Dynamic import of HTML custom element to play nice with Next.js SSR
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    (async () => {
      await import('@speechly/browser-ui/core/transcript-drawer')
      setLoaded(true)
    })()
  }, [])

  useEffect(() => {
    if (refElement?.current !== undefined) {
      refElement.current.speechstate(clientState)
    }
  }, [clientState])

  useEffect(() => {
    if (refElement?.current !== undefined && segment !== undefined) {
      setDemoMode(false)
      refElement.current.speechsegment(segment)
    }
  }, [segment])

  useEffect(() => {
    if (refElement?.current !== undefined && props.mockSegment !== undefined) {
      setDemoMode(true)
      refElement.current.speechsegment(props.mockSegment)
    }
  }, [props.mockSegment])

  if (!loaded) return null

  return (
    <transcript-drawer
      ref={refElement}
      demomode={demoMode ? 'true' : 'false'}
      formattext={props.formatText === false ? 'false' : 'true'}
      fontsize={props.fontSize}
      color={props.color}
      smalltextcolor={props.smallTextColor}
      highlightcolor={props.highlightColor}
      backgroundcolor={props.backgroundColor}
      marginbottom={props.marginBottom}
      hint={JSON.stringify(props.hint)}
      height={props.height}
      hintfontsize={props.hintFontSize}
    ></transcript-drawer>
  )
}
