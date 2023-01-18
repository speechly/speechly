import React from 'react';
import ReactDOM from 'react-dom/client';
import { DemoNavigation } from '@speechly/demo-navigation';
import { LogKit } from '@speechly/logkit';
import { SpeechProvider } from '@speechly/react-client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <SpeechProvider appId="9fedda54-8213-4435-9876-04dce16d9743">
      <LogKit appName="transcription" appVersion={110}>
        <DemoNavigation />
        <App />
      </LogKit>
    </SpeechProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
