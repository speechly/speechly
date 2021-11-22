import React from 'react';
import ReactDOM from 'react-dom';
import HttpsRedirect from "components/HttpsRedirect";
import { SpeechProvider } from "@speechly/react-client";
import { LogKit } from "@speechly/logkit";
import App from './App';
import * as serviceWorker from './serviceWorker';
import './index.css';

const appId = "4d7fd32a-909b-45a0-93da-e313fda00bc0"

ReactDOM.render(
  <React.StrictMode>
    <HttpsRedirect>
      <SpeechProvider appId={process.env.REACT_APP__SPEECHLY_APP_ID || appId}>
        <LogKit appName="fashion-ecommerce" appVersion={211}>
          <App />
        </LogKit>
      </SpeechProvider>
    </HttpsRedirect>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
