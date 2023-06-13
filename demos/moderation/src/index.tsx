import React from 'react';
import ReactDOM from 'react-dom/client';
import { DemoNavigation } from '@speechly/demo-navigation';
import { SpeechProvider } from '@speechly/react-client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <SpeechProvider appId="6e0d5a0c-880c-4ffd-8229-01a3b7c75a12">
      <DemoNavigation />
      <App />
    </SpeechProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
