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
    <SpeechProvider appId="eb9300c4-94fc-47be-8534-dbae216d5d6e">
      <LogKit appName="analyzer" appVersion={110}>
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
