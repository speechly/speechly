import React, { useEffect, useState } from "react";
import { SpeechProvider, SpeechSegment, useSpeechContext } from "@speechly/react-client";
import {
//  BigTranscript,
  PushToTalkButton,
  IntroPopup,
} from "@speechly/react-ui";

import { TranscriptDrawer } from "@speechly/react-ui/lib/components/TranscriptDrawer";
import { startDemo, stopDemo } from "@speechly/browser-ui/core/demomode";
import { SpeechlyUiEvents } from "@speechly/react-ui/lib/types";
import PubSub from "pubsub-js";

export default function App() {
  const appId = "a14e42a3-917e-4a57-81f7-7433ec71abad"

  return (
    <div className="App">
      <SpeechProvider appId={appId} >
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
      <TranscriptDrawer mockSegment={mockSegment} hint={['Try: "Hello World"', 'Try: "Show me blue jeans"']} formatText={false}/>

      <PushToTalkButton powerOn="auto" placement="bottom" size="88px" voffset="32px" intro="Hold to use voice commands"/>

      <IntroPopup>
        <span slot="priming-body">You will be able to book faster with voice.</span>
      </IntroPopup>

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
