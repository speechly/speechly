import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { SpeechProvider } from "@speechly/react-client";
import * as serviceWorker from "./serviceWorker";
import { LogKit } from "@speechly/logkit";
import { DemoNavigation } from "@speechly/demo-navigation";

ReactDOM.render(
  <React.StrictMode>
    <SpeechProvider appId="a55bc719-5e17-4281-8987-91f0ab2fa4dc">
      <LogKit appName="moderation" appVersion={100}>
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
