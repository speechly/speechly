import React, { createContext, useEffect, useRef, useState } from 'react'
import { SpeechSegment, SpeechState, useSpeechContext } from '@speechly/react-client'
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
  const { speechState, segment } = useSpeechContext()
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
      switch(speechState) {
        case SpeechState.NoBrowserSupport:
        case SpeechState.NoAudioConsent:
        case SpeechState.Failed:
          Logger.trackInitialized(false, speechState, appName, appVersion)
          setInitializationAttempted(true)
          break
        case SpeechState.Ready:
          Logger.trackInitialized(true, speechState, appName, appVersion)
          setInitializationAttempted(true)
          break
      }
    }
  }, [speechState, initializationAttempted, appName, appVersion])

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
