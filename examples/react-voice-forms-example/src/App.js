import React, { useEffect, useState } from "react";
import { useSpeechContext } from "@speechly/react-client";
import {
  PushToTalkButton,
  BigTranscript,
  ErrorPanel
} from "@speechly/react-ui";
import { VoiceInput, VoiceSelect, VoiceToggle } from '@speechly/react-voice-forms'
import '@speechly/react-voice-forms/css/theme/mui.css'

function App() {
  const { segment } = useSpeechContext()
  const [phone, setPhone] = useState("")

  useEffect(() => {
    if (segment) {
      const plainString = segment.words.filter(w => w.value).map(w => w.value).join(' ');
      console.log(plainString);
      if (segment.isFinal) {
        console.log("✅", plainString);
      }
    }
  }, [segment]);

  return (
    <div className="App">
      <BigTranscript placement="top"/>
      <PushToTalkButton placement="bottom" captureKey=" "/>
      <ErrorPanel placement="bottom"/>
      <p className="openconsole">ℹ️ Open the Browser Console to see speech segment outputs</p>
      <VoiceInput label="Phone number" changeOnEntityType="phone_number" value={phone} onChange={setPhone}/>
      <VoiceSelect label="Phone number" changeOnEntityType="phone_number" value={phone} options={["", "112 ", "911 "]} onChange={setPhone}/>
      <VoiceToggle changeOnEntityType="phone_number" value={phone} options={["", "112 ", "911 "]} onChange={setPhone}/>
      <div>Phone number state: {phone}</div>
      <button onClick={() => setPhone("")}>Reset</button>
      <button onClick={() => setPhone("911 ")}>Set to 911</button>
    </div>
  );
}

export default App;
