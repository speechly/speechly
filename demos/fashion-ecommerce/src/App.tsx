import React, { useEffect } from "react";
import { BigTranscript, BigTranscriptContainer, PushToTalkButton, ErrorPanel } from "@speechly/react-ui";
import Inventory from "components/Inventory";
import SmartFilter from "components/SmartFilters";
import { AppContextProvider } from "AppContext";
import "App.css";
import "components/BigTransscript.css";
import { SpeechlyUiEvents } from "@speechly/react-ui/lib/types";
import { DemoNavigation } from "@speechly/demo-navigation";

export default function App() {

  useEffect(() => {
    PubSub.publish(SpeechlyUiEvents.Notification, {
      message: `Try "Show me blue jeans"`,
      footnote: `Hold the mic button while talking`
    });
  }, [])

  return (
    <AppContextProvider>
      <div className="App">
        <DemoNavigation />
        <SmartFilter />
        <Inventory>
          <BigTranscriptContainer position="absolute">
            <BigTranscript formatText={false}/>
          </BigTranscriptContainer>
        </Inventory>
      </div>
      <PushToTalkButton placement="bottom" size="88px" voffset="32px" intro=""/>
      <ErrorPanel placement="bottom"/>
    </AppContextProvider>
  );
}
