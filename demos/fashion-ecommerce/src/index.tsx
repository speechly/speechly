import React from 'react';
import ReactDOM from 'react-dom/client';
import HttpsRedirect from 'components/HttpsRedirect';
import { SpeechProvider } from '@speechly/react-client';
import App from './App';
import * as serviceWorker from './serviceWorker';
import './index.css';

const appId = '4d7fd32a-909b-45a0-93da-e313fda00bc0';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <HttpsRedirect>
      <SpeechProvider appId={process.env.REACT_APP__SPEECHLY_APP_ID || appId}>
        <App />
      </SpeechProvider>
    </HttpsRedirect>
  </React.StrictMode>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
