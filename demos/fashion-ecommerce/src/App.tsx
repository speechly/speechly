import React, { useEffect } from "react";
import { SpeechProvider } from "@speechly/react-client";
import { BigTranscript, BigTranscriptContainer, PushToTalkButton, PushToTalkButtonContainer, ErrorPanel } from "@speechly/react-ui";
import Inventory from "components/Inventory";
import SmartFilter from "components/SmartFilters";
import { AppContextProvider } from "AppContext";
import "App.css";
import "components/BigTransscript.css";
import HttpsRedirect from "components/HttpsRedirect";
import { SpeechlyUiEvents } from "@speechly/react-ui/lib/types";
import { LogKit } from "@speechly/logkit";

const appId = "4d7fd32a-909b-45a0-93da-e313fda00bc0"

export default function App() {
  return (
    <HttpsRedirect>
      <SpeechProvider appId={process.env.REACT_APP__SPEECHLY_APP_ID || appId}>
        <LogKit appName="fashion-ecommerce" appVersion={210}>
          <SpeechlyApp/>
        </LogKit>
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
      <PushToTalkButtonContainer size="88px" voffset="32px">
        <PushToTalkButton size="88px" intro=""/>
        <ErrorPanel/>
      </PushToTalkButtonContainer>
    </AppContextProvider>
  );
}
