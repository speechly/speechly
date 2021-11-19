import React, { useEffect, useState } from 'react'
import { useSpeechContext } from '@speechly/react-client'
import {
  PushToTalkButton,
  PushToTalkButtonContainer,
  ErrorPanel
} from '@speechly/react-ui'
import textareaBg from './textarea.png'
import textareaButton from './textarea-button.png'
import './App.css'

const App: React.FC = (): JSX.Element => {

  return (
    <div className="App">
      <PushToTalkButtonContainer voffset="calc(1rem + 4vh)" size="5rem">
        <PushToTalkButton size="5rem" captureKey=" " />
        <ErrorPanel />
      </PushToTalkButtonContainer>
      <SpeechlyApp/>
    </div>
  )
}

const SpeechlyApp: React.FC = (): JSX.Element => {

  const [textContent, setTextContent] = useState<string>('')
  const [tentativeTextContent, setTentativeTextContent] = useState<string>('')
  const { segment } = useSpeechContext()

  const setText = (value: string) => {
    setTextContent(value)
    setTentativeTextContent(value)
  }

  useEffect(() => {
    if (segment) {
      const plainString = segment.words.filter(w => w.value).map(w => w.value).join(' ')
      const alteredTextContent = textContent ? [textContent, plainString].join(' ') : plainString
      setTentativeTextContent(alteredTextContent)
      if (segment.isFinal) {
        setTextContent(alteredTextContent)
      }
    }
  }, [segment, textContent])

  return (
    <div className="TextareaContainer" style={{ backgroundImage: `url(${textareaBg})` }}>
      <textarea onChange={e => setText(e.target.value)} value={tentativeTextContent.toLowerCase()} />
      {tentativeTextContent && <div className="SendButton" onClick={()=>setText('')} style={{ backgroundImage: `url(${textareaButton})` }} />}
    </div>
  )
}

export default App
