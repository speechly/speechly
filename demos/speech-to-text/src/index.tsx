import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { SpeechProvider } from "@speechly/react-client";
import * as serviceWorker from "./serviceWorker";
import { LogKit } from "@speechly/logkit";

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <SpeechProvider appId="6f1c7eaa-53fa-495e-9319-4ceacfa88cfe">
      <LogKit appName="speech-to-text" appVersion={100} >
        <App />
      </LogKit>
    </SpeechProvider>
  </React.StrictMode>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
