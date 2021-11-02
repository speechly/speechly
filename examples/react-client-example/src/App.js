import React from 'react'
import {SpeechProvider, useSpeechContext} from '@speechly/react-client'

export default function App() {
  const appId = process.env.REACT_APP_APP_ID ?? "";
  if (appId === undefined) {
    throw Error("Missing Speechly app ID!");
  }

  const language = process.env.REACT_APP_LANGUAGE ?? "en-US";
  if (language === undefined) {
    throw Error("Missing Speechly app language!");
  }
  return (
    <div className="App">
      <SpeechProvider appId={appId} language={language}>
        <SpeechlyApp/>
      </SpeechProvider>
    </div>
  )
}

function SpeechlyApp() {
  const {speechState, segment, toggleRecording, initialise} = useSpeechContext()

  return (
    <div>
      <h1>Speechly React Client Example</h1>
      <p>Check out our spoken language understanding API for developers
        at <a href="https://speechly.com" rel="noreferrer noopener" target="_blank">
          https://speechly.com</a>
      </p>
      <p>Start by clicking the "Connect" button and then click "Record" button to start Speech Recognition and try saying something.</p>

      <hr/>


      <div className="status">State: {speechState}</div>
      <div className="mic-button">
        <button onClick={initialise} disabled={speechState !== 'Idle'}>Connect</button>
        <button onClick={toggleRecording} disabled={!(speechState === 'Ready' || speechState === 'Recording')}>
          { speechState === 'Recording' ? 'Stop' : 'Record' }
        </button>
      </div>
      <h3>Transcript</h3>
      {segment ? <p className="segment">{segment.words.map(w => w.value).join(' ')}</p> : null}

      <h3>Entities</h3>
      {segment ? <pre className="segment">{segment.entities.map(ent => ent.type + ': ' + ent.value).join('\n')}</pre> : null}

      <h3>Intent</h3>
      {segment ? <pre className="segment">{segment.intent.intent}</pre> : null}

      <h3>Full result</h3>
      {segment ? <pre className="segment">{JSON.stringify(segment, null, 2)}</pre> : null}
    </div>
  )
}
