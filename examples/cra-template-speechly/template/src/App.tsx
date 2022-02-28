import React from 'react';
import { PushToTalkButton, BigTranscript, IntroPopup } from '@speechly/react-ui';
import './App.css';

function App() {
  return (
    <>
      <BigTranscript placement="top" />
      <PushToTalkButton placement="bottom" captureKey=" " powerOn="auto" />
      <IntroPopup />

      <main>
        <h1>Speechly React App</h1>
      </main>
    </>
  );
}

export default App;
