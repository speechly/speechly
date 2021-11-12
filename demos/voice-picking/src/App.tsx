import React from 'react';
import { PushToTalkButton, PushToTalkButtonContainer, ErrorPanel } from '@speechly/react-ui';
import './App.css';

function App() {
  return (
    <div className="App">
      <div className="block">
        <h1>Speechly React App</h1>
      </div>
      <PushToTalkButtonContainer>
        <PushToTalkButton captureKey=" " />
        <ErrorPanel />
      </PushToTalkButtonContainer>
    </div>
  );
}

export default App;
