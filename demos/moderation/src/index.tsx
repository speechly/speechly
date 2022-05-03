import React from "react";
import ReactDOM from "react-dom/client";
import { SpeechProvider } from "@speechly/react-client";
import { LogKit } from "@speechly/logkit";
import { DemoNavigation } from "@speechly/demo-navigation";
import * as serviceWorker from "./serviceWorker";
import App from "./App";
import "./index.css";

const noMic = {
  initialize: function() {return new Promise<void>(function() {})},
  close: function() {return new Promise<void>(function() {})},
  mute: function() {},
  unmute: function() {},
  printStats: function() {}
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <SpeechProvider appId="aeca6691-2a4c-4f80-af93-4c8396216a62" microphone={noMic}>
      <LogKit appName="moderation" appVersion={100}>
        <DemoNavigation />
        <App />
      </LogKit>
    </SpeechProvider>
  </React.StrictMode>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
