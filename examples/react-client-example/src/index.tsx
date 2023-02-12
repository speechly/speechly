import React from 'react';
import ReactDOM from 'react-dom/client';
import { SpeechProvider } from '@speechly/react-client';
import App from './App';
import 'modern-normalize/modern-normalize.css';
import './styles.css';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <SpeechProvider
      appId="d7cfc4a0-cfb7-4859-a53d-9f9e404a1f19"
      debug={true}
      logSegments={true}
      vad={{ enabled: false }}
    >
      <App />
    </SpeechProvider>
  </React.StrictMode>
);
