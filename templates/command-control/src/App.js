import React, { useEffect } from "react";
import { useSpeechContext } from "@speechly/react-client";
import {
  PushToTalkButton,
  BigTranscript,
  ErrorPanel
} from "@speechly/react-ui";
import "./App.css";

/*
1. Paste your App ID into index.js (get it from https://api.speechly.com/dashboard/)
2. Run `npm start` to run the app in development mode
3. Open http://localhost:3000 to view it in the browser
4. Start developing with Speechly (see https://docs.speechly.com/quick-start/)
*/

function App() {
  const { segment } = useSpeechContext();

  useEffect(() => {
    if (segment) {
      if (segment.intent?.isFinal) {
        console.log(segment.intent.intent);
        const element = document.getElementById(segment.intent.intent)
        window.scrollTo({
          top: element?.offsetTop || 0,
          behavior: "smooth"
        });
      }
      if (segment.isFinal) {
        console.log("✅", segment.intent.intent);
      }
    }
  }, [segment]);

  return (
    <div className="App">
      <BigTranscript placement="top"/>
      <PushToTalkButton placement="bottom" captureKey=" "/>
      <ErrorPanel placement="bottom"/>
      <div className="Main">
        <h1 id="hello">Hello, and welcome!</h1>
        <div/><div/><div/><div/>
        <h1 id="opening_hours">Opening hours</h1>
        <div/><div/><div/><div/>
        <h1 id="contact_info">Contact details</h1>
        <div/><div/><div/><div/>
        <h1 id="shipping_info">Shipping information</h1>
        <div/><div/><div/><div/>
        <h1 id="return_policy">Return policy</h1>
        <div/><div/><div/><div/>
        <h1 id="payment_options">Payment options</h1>
        <div/><div/><div/><div/>
        <h1 id="about_us">About us</h1>
        <div/><div/><div/><div/>
      </div>
    </div>
    );
}

export default App;
