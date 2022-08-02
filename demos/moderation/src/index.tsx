import React from "react";
import ReactDOM from "react-dom";
import { SpeechProvider } from "@speechly/react-client";
import { LogKit } from "@speechly/logkit";
import { DemoNavigation } from "@speechly/demo-navigation";
import * as serviceWorker from "./serviceWorker";
import App from "./App";
import "./index.css";

ReactDOM.render(
  <React.StrictMode>
    <SpeechProvider appId="9dbba3e2-0d75-40db-a45a-a351d6cb8ce7" debug={true} vad={{enabled: true, signalSustainMillis: 2000}}>
      <LogKit appName="moderation" appVersion={110}>
        <DemoNavigation />
        <App />
      </LogKit>
    </SpeechProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
