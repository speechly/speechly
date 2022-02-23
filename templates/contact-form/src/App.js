import React, { useEffect, useState } from "react";
import { useSpeechContext } from "@speechly/react-client";
import {
  PushToTalkButton,
  BigTranscript,
  IntroPopup
} from "@speechly/react-ui";
import "./App.css";

/*
1. Paste your App ID into index.js (get it from https://api.speechly.com/dashboard/)
2. Run `npm start` to run the app in development mode
3. Open http://localhost:3000 and you should see your app running
4. Open the Developer Console to see speech segement outputs.
5. Start developing with Speechly (see https://docs.speechly.com/quick-start/)
*/

function App() {
  const { segment } = useSpeechContext()
  const [data, setData] = useState({
    name: "",
    street_address: "",
    email_address: "",
    phone_number: "",
    dob: ""
  });

  const handleChange = (e, key) => setData({ ...data, [key]: e.target.value});

  useEffect(() => {
    if (segment) {
      if(segment.entities) {
        segment.entities.forEach(entity => {
          console.log(entity.type, entity.value);
          setData(data => ({ ...data, [entity.type]: entity.value}));
        });
      }
      if (segment.isFinal) {
        if(segment.entities) {
          segment.entities.forEach(entity => {
            console.log('✅', entity.type, entity.value)
            setData(data => ({ ...data, [entity.type]: entity.value}))
          });
        }
      }
    }
  }, [segment]);

  return (
    <div className="App">
      <BigTranscript placement="top"/>
      <PushToTalkButton placement="bottom" captureKey=" " powerOn="auto" />
      <IntroPopup />
      <div className="Form">
        <div className="Form_group">
          <label>Name</label>
          <input
            value={data.name}
            onChange={e => handleChange(e, "name")}
            type="text"
          />
        </div>
        <div className="Form_group">
          <label>Street address</label>
          <input
            value={data.street_address}
            onChange={e => handleChange(e, "street_address")}
            type="text"
          />
        </div>
        <div className="Form_group">
          <label>Email</label>
          <input
            value={data.email_address}
            onChange={e => handleChange(e, "email_address")}
            type="text"
          />
        </div>
        <div className="Form_group">
          <label>Phone number</label>
          <input
            value={data.phone_number}
            onChange={e => handleChange(e, "phone_number")}
            type="text"
          />
        </div>
        <div className="Form_group">
          <label>Date of birth</label>
          <input
            value={data.dob}
            onChange={e => handleChange(e, "dob")}
            type="text"
          />
        </div>
        <p className="openconsole">ℹ️ Open the Browser Console to see speech segment outputs</p>
      </div>
    </div>
  );
}

export default App;
