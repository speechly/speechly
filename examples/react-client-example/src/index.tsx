import React from 'react';
import ReactDOM from 'react-dom/client';
import 'modern-normalize/modern-normalize.css';
import App from './App';
import { SpeechProvider } from '@speechly/react-client';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <SpeechProvider
      appId="YOUR-APP-ID"
      debug={true}
      logSegments={true}
      vad={{ enabled: false }}
    >
      <App />
    </SpeechProvider>
  </React.StrictMode>
);
