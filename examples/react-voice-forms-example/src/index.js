import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { SpeechProvider } from '@speechly/react-client';

ReactDOM.render(
  <React.StrictMode>
    <SpeechProvider appId="ed4fed3e-3d81-4c3d-8f07-2ea14092a74d" debug={true}>
      <App />
    </SpeechProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
