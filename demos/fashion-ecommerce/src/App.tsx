import React, { useEffect } from "react";
import { SpeechProvider } from "@speechly/react-client";
import { BigTranscript, BigTranscriptContainer, PushToTalkButton, PushToTalkButtonContainer, ErrorPanel } from "@speechly/react-ui";
import Inventory from "components/Inventory";
import SmartFilter from "components/SmartFilters";
import { AppContextProvider } from "AppContext";
import "App.css";
import "components/BigTransscript.css";
import HttpsRedirect from "components/HttpsRedirect";
import { SpeechlyUiEvents } from "@speechly/react-ui/types";

export default function App() {
  return (
    <HttpsRedirect>
      <SpeechProvider
        loginUrl={process.env.REACT_APP__SLU_LOGIN_URL}
        apiUrl={process.env.REACT_APP__SPEECHLY_API_URL}
        appId={process.env.REACT_APP__SPEECHLY_APP_ID!}
        language={process.env.REACT_APP__SPEECHLY_LANGUAGE_CODE!}
      >
        <SpeechlyApp/>
      </SpeechProvider>
    </HttpsRedirect>
  );
}

function SpeechlyApp() {

  useEffect(() => {
    PubSub.publish(SpeechlyUiEvents.Notification, {
      message: `Try "Show me blue jeans"`,
      footnote: `Hold the mic button while talking`
    });
  }, [])
  
  return (
    <AppContextProvider>
      <div className="App">
        <SmartFilter />
        <Inventory>
          <BigTranscriptContainer position="absolute">
            <BigTranscript formatText={false}/>
          </BigTranscriptContainer>
        </Inventory>
      </div>
      <PushToTalkButtonContainer>
        <PushToTalkButton intro=""/>
        <ErrorPanel/>
      </PushToTalkButtonContainer>
    </AppContextProvider>
  );
}
