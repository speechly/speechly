import React, { createContext, useEffect, useRef, useState } from 'react'
import { SpeechSegment, useSpeechContext, DecoderState, AudioSourceState, stateToString } from '@speechly/react-client'
import Logger from './logger'

const search = window.location.search.substring(1)
const queryParams = !search ? {} :
  JSON.parse('{"' + search.replace(/&/g, '","').replace(/=/g,'":"') + '"}', (key, value) => { return key===''?value:decodeURIComponent(value) })

export type AnalyticsContextProps = {
  track: (eventName: string, params: any) => void,
  trackIntent: (segment: SpeechSegment, numChanges: number) => void,
}

const contextDefaultValues: AnalyticsContextProps = {
  track: () => ({}),
  trackIntent: () => ({}),
}

export const AnalyticsContext = createContext<AnalyticsContextProps>(
  contextDefaultValues
)

interface Props {
  appName: string,
  appVersion: number,
  autoIntentTracking?: boolean,
  printLog?: boolean,
  children?: React.ReactNode
}

export const LogKit: React.FC<Props> = ({
  appName,
  appVersion,
  children,
  autoIntentTracking = true,
  printLog = false,
}) => {
  const [launched, setLaunched] = useState(false)
  const [initializationAttempted, setInitializationAttempted] = useState(false)
  const { clientState, microphoneState, segment } = useSpeechContext()
  const startAttempted = useRef<boolean>(false)

  useEffect(() => {
    Logger.setLogging(printLog)
  }, [printLog]);

  useEffect(() => {
    if (!launched) {
      Logger.trackLaunch(appName, appVersion, queryParams)
      setLaunched(true)
    }
  }, [launched, appName, appVersion])

  useEffect(() => {
    const handleHoldStartMessage = (e: any) => {
      if (startAttempted.current === false) {
        if (e.data.type === 'holdstart') {
          Logger.trackStarting(appName, appVersion)
          startAttempted.current = true
        }
      }
    }
    window.addEventListener('message', handleHoldStartMessage)

    return () => {
      window.removeEventListener('message', handleHoldStartMessage)
    }
  }, [appName, appVersion])

  useEffect(() => {
    if (!initializationAttempted) {
      switch(microphoneState) {
        case AudioSourceState.NoBrowserSupport:
        case AudioSourceState.NoAudioConsent:
          Logger.trackInitialized(false, microphoneState, appName, appVersion)
          setInitializationAttempted(true)
          return
      }

      switch(clientState) {
        case DecoderState.Failed:
          Logger.trackInitialized(false, stateToString(clientState), appName, appVersion)
          setInitializationAttempted(true)
          return
      }

      if (microphoneState === AudioSourceState.Started && clientState >= DecoderState.Connected) {
        Logger.trackInitialized(true, stateToString(clientState), appName, appVersion)
        setInitializationAttempted(true)
        return
      }
    }
  }, [clientState, microphoneState, initializationAttempted, appName, appVersion])

  useEffect(() => {
    if (autoIntentTracking && segment && segment.isFinal) {
      Logger.trackIntent(segment, appName, appVersion)
    }
  }, [segment, appName, appVersion, autoIntentTracking])

  return (
    <AnalyticsContext.Provider
      value={{
        track: (eventName, params) => Logger.log(eventName, {...params, appName: appName, appVersion: appVersion}),
        trackIntent: (segment, numChanges) => Logger.trackIntent(segment, appName, appVersion, numChanges),
      }}
    >
      {children}
    </AnalyticsContext.Provider>
  )
}
