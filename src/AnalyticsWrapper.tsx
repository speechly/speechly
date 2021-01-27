import React, { useEffect, useState } from "react";
import { SpeechState, useSpeechContext } from "@speechly/react-client";
import Analytics from "analytics";

export const AnalyticsWrapper: React.FC<{queryParams: {}}> = (props) => {
    const [launched, setLaunched] = useState(false);
    const [initializationAttempted, setInitializationAttempted] = useState(false);
    const { speechState } = useSpeechContext();
  
    useEffect(() => {
      if (!launched) {
        Analytics.trackLaunch(props.queryParams);
        setLaunched(true);
      };
    }, [launched]);
  
    useEffect(() => {
      if (!initializationAttempted) {
        switch(speechState) {
          case SpeechState.NoBrowserSupport:
          case SpeechState.NoAudioConsent:
          case SpeechState.Failed:
            Analytics.trackInitialized(false, speechState);
            setInitializationAttempted(true);
            break;
          case SpeechState.Ready:
            Analytics.trackInitialized(true, speechState);
            setInitializationAttempted(true);
            break;
        }
      };
    }, [speechState, initializationAttempted]);
  
    return (
      <>
        {props.children}
      </>
    );
  
  }
  