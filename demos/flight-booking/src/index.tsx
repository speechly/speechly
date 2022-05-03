import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { SpeechProvider } from "@speechly/react-client";
import * as serviceWorker from './serviceWorker';
import { LogKit } from "@speechly/logkit"

const appId = '1ea63538-f95c-4259-b8af-923994424137'

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <SpeechProvider appId={appId}>
      <LogKit appName="flight-booking" appVersion={100} >
        <App />
      </LogKit>
    </SpeechProvider>
  </React.StrictMode>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
