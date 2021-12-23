import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { SpeechProvider } from '@speechly/react-client';

ReactDOM.render(
  <React.StrictMode>
    <SpeechProvider appId="YOUR_APP_ID_FROM_SPEECHLY_DASHBOARD">
      <App />
    </SpeechProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
