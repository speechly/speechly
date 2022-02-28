import React from 'react'
import {SpeechProvider, useSpeechContext} from '@speechly/react-client'

export default function App() {
  const appId = process.env.REACT_APP_APP_ID ?? "be3bfb17-ee36-4050-8830-743aa85065ab";
  if (appId === undefined) {
    throw Error("Missing Speechly app ID!");
  }

  return (
    <div className="App">
      <SpeechProvider appId={appId}>
        <SpeechlyApp/>
      </SpeechProvider>
    </div>
  )
}

function SpeechlyApp() {
  const {speechState, segment, listening, toggleRecording, initialize} = useSpeechContext()

  return (
    <div>
      <h1>Speechly React Client Example</h1>
      <p>Check out our spoken language understanding API for developers
        at <a href="https://speechly.com" rel="noreferrer noopener" target="_blank">
          https://speechly.com</a>
      </p>
      <p>Start by clicking the "Connect" button and then click "Record" button to start Speech Recognition and try saying something.</p>

      <hr/>


      <div className="status">State: {speechState}. Listening: {listening.toString()}</div>
      <div className="mic-button">
        <button onClick={initialize} disabled={speechState !== 'Idle'}>Connect</button>
        <button onClick={toggleRecording}>
          { listening ? 'Stop' : 'Listen' }
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
