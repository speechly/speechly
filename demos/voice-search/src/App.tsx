import React, { useEffect, useState } from 'react'
import { useSpeechContext } from '@speechly/react-client'
import { DemoNavigation } from '@speechly/demo-navigation'
import { PushToTalkButton, ErrorPanel, BigTranscript } from '@speechly/react-ui'
import './App.css'
import avatar from './assets/avatar.png'
import logo from './assets/logo.svg'
import searchIcon from './assets/search.svg'
import searchIconGray from './assets/search-gray.svg'
import imageIcon from './assets/image.svg'
import videoIcon from './assets/video.svg'
import newsIcon from './assets/news.svg'

const App: React.FC = (): JSX.Element => {
  return (
    <div className="App">
      <DemoNavigation />
      <div className="TranscriptContainer">
        <BigTranscript highlightColor="#009FFA" backgroundColor="#1F2D3B" />
      </div>
      <ErrorPanel />
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

  const toSentenceCase = (str: string) => {
    const alphabet = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
    const punctuation = ['.','!','?']
    alphabet.forEach(letter => {
      punctuation.forEach(punc => {
          str = str.replace(`${punc} ${letter.toLowerCase()}`,`${punc} ${letter}`)
      })
    })
    return str.charAt(0).toUpperCase() + str.substr(1);
  }

  useEffect(() => {
    if (segment) {
      const plainString = segment.words.filter(w => w.value).map(w => w.value).join(' ')
      const alteredTextContent = textContent ? [textContent, plainString].join(' ') : plainString
      const formattedTextContent = alteredTextContent
        .replace(' COMMA', ',')
        .replace(' PERIOD', '.')
        .replace(' DOT', '.')
        .replace(' QUESTION MARK', '?')
        .replace(' EXCLAMATION MARK', '!')
        .replace(' EXCLAMATION POINT', '!')
        .replace(' COLON', ':')
        .replace(' SEMICOLON', ';')
        .replace(' SEMI COLON', ';')
        .toLowerCase()
      const casedTextContent = toSentenceCase(formattedTextContent)
      setTentativeTextContent(casedTextContent)
      if (segment.isFinal) {
        setTextContent(casedTextContent)
      }
    }
  // eslint-disable-next-line
  }, [segment])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value)
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
    }
  }

  return (
    <div className="SearchApp">
      <div className="Navigation">
        <div className="Navigation__item Navigation__item--active">
          <img src={searchIcon} alt="icon" />
          <span>All</span>
        </div>
        <div className="Navigation__item">
          <img src={imageIcon} alt="icon" />
          <span>Images</span>
        </div>
        <div className="Navigation__item">
          <img src={videoIcon} alt="icon" />
          <span>Videos</span>
        </div>
        <div className="Navigation__item">
          <img src={newsIcon} alt="icon" />
          <span>News</span>
        </div>
        <div className="Navigation__avatar">
          <img src={avatar} alt="profile" />
        </div>
      </div>
      <div className="Search">
        <img className="Search__logo" src={logo} alt="logo" />
        <div className="Input">
        <input
          className="Input__textfield"
          placeholder="Search the web"
          onChange={handleChange}
          value={tentativeTextContent}
          onKeyPress={handleKeyPress}
        />
        <img className="Input__icon" src={searchIconGray} alt="icon" />
        <div className="Input__button">
          <PushToTalkButton size="48px" intro="" />
        </div>
        </div>
      </div>
      <div className="Footer">
        &copy; Speechly
      </div>
    </div>
  )
}

export default App
