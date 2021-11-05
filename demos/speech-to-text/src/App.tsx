import React, { useEffect, useState } from 'react'
import { useSpeechContext } from '@speechly/react-client'
import {
  PushToTalkButton,
  PushToTalkButtonContainer,
  ErrorPanel
} from '@speechly/react-ui'
import './App.css'

// http://localhost:3000/?backgroundColor=%23ff00ff
const params = new URLSearchParams(window.location.search)

const queryParams = {
  backgroundColor: params.get('backgroundColor') || '#302865',
  backgroundHighlightColor: params.get('backgroundHighlightColor') || '#494287',
  intro: params.get('intro') || 'Hold to talk',
  placeholder: params.get('placeholder') || 'TRY SPEECHLY SPEECH-TO-TEXT!',
  padding: params.get('padding') || '2rem',
}

const App: React.FC = (): JSX.Element => {

  return (
    <>
      <PushToTalkButtonContainer voffset="calc(1rem + 4vh)" size="5rem">
        <PushToTalkButton
          size="5rem" backgroundColor={queryParams.backgroundHighlightColor} captureKey=" " intro={queryParams.intro} showTime={0}
        />
        <ErrorPanel />
      </PushToTalkButtonContainer>

      <SpeechlyApp/>
    </>
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
    <>
      <div className="pageMargin">
        <main>
          <textarea
            style={{padding: queryParams.padding, backgroundColor: queryParams.backgroundColor}}
            placeholder={queryParams.placeholder}
            onChange={e => setText(e.target.value)} value={tentativeTextContent} />
        </main>
      </div>
    </>
  )
}

export default App
