import React, { useEffect, useState } from "react";
import { startDemo, stopDemo } from "@speechly/browser-ui/demomode";
import { SpeechProvider, SpeechSegment, useSpeechContext } from "@speechly/react-client";
import {
//  BigTranscript,
  BigTranscriptContainer,
  PushToTalkButton,
  PushToTalkButtonContainer,
  ErrorPanel,
//} from "@speechly/react-ui";
// Run `sh initialize.sh` in the parent directory and uncomment this import to use local linked code.
} from "./@speechly/react-ui";

import {
  TranscriptDrawer,
} from "./@speechly/react-ui/components/TranscriptDrawer";

import QueryString from "query-string";
import { SpeechlyUiEvents } from "./@speechly/react-ui/types";

export default function App() {
  // http://localhost:3000/?appId=staging:nnnnn

  const queryAppIdParts = (QueryString.parse(window.location.search).appId as string)?.split(":") || [];

  const appId = ( () => {
    if (queryAppIdParts.length > 0) return queryAppIdParts.slice(-1)[0];
    if (!process.env.REACT_APP__SPEECHLY_APP_ID) throw Error("App ID not defined");
    return process.env.REACT_APP__SPEECHLY_APP_ID;
  })();

  const LoginUrl = queryAppIdParts.length > 0 && queryAppIdParts[0] === "staging" ? "https://staging.speechly.com/login" : process.env.REACT_APP__SPEECHLY_LOGIN_URL;
  const ApiUrl = queryAppIdParts.length > 0 && queryAppIdParts[0] === "staging" ? "wss://staging.speechly.com/ws/v1" : process.env.REACT_APP__SPEECHLY_API_URL;

  console.log("appId:", appId);
  console.log("ApiUrl:", ApiUrl);
  console.log("LoginUrl:", LoginUrl);

  return (
    <div className="App">
      <SpeechProvider
        appId={appId}
        language="en-US"
        loginUrl={LoginUrl}
        apiUrl={ApiUrl}
      >
        <SpeechlyApp />
      </SpeechProvider>
    </div>
  );
}

function SpeechlyApp() {
  const { speechState, segment, toggleRecording } = useSpeechContext();
  const [mockSegment, setMockSegment] = useState<SpeechSegment | undefined>();

  useEffect(() => {
    if (segment?.isFinal) {
      window.postMessage({ type: "speechhandled", success: true }, "*")

      PubSub.publish(SpeechlyUiEvents.Notification, {
        message: "Feedback notification test",
        footnote: "Triggered on final segment",
      })
    }
  }, [segment])

  const clickStartDemo = () => {
    const demoStrings = [
      "*filter show me blue(color) jeans(product)",
      "*clear clear",
    ]

    startDemo(demoStrings, (s: SpeechSegment) => {
      setMockSegment(s);
      if (s.isFinal) {
        window.postMessage({ type: "speechhandled", success: true }, "*")
      }
    });
  }

  const clickStopDemo = () => {
    stopDemo();
  }

  return (
    <>
      <BigTranscriptContainer>
        <TranscriptDrawer mockSegment={mockSegment} hint={['Try: "Hello World"', 'Try: "Show me blue jeans"']} formatText={false}/>
      </BigTranscriptContainer>

      <PushToTalkButton placement="bottom" size="6rem" intro="Hold to use voice commands"/>

      <ErrorPanel placement="bottom" />

      <div className="status">{speechState}</div>
      {segment ? (
        <div className="segment">
          {segment.words.map((w) => w.value).join(" ")}
        </div>
      ) : null}
      <div className="mic-button">
        <button onClick={toggleRecording}>Record</button>
        <button onClick={clickStartDemo}>Start demo</button>
        <button onClick={clickStopDemo}>Stop demo</button>
      </div>
    </>
  );
}
