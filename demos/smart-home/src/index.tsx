import { SpeechProvider } from '@speechly/react-client';
import { LogKit } from "@speechly/logkit"
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import HttpsRedirect from "./components/HttpsRedirect";
import './index.css';

const appId = process.env.REACT_APP__SPEECHLY_APP_ID || "738ec39c-3a5c-435f-aa5a-4d815a3e8d87"

ReactDOM.render(
  <React.StrictMode>
    <HttpsRedirect>
      <SpeechProvider appId={appId}>
        <LogKit appName="smart-home" appVersion={104}>
          <App />
        </LogKit>
      </SpeechProvider>
    </HttpsRedirect>
  </React.StrictMode>,
  document.getElementById('root')
);
