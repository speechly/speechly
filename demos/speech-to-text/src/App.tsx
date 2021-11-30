import React, { useEffect, useState } from 'react'
import { useSpeechContext } from '@speechly/react-client'
import {
  PushToTalkButton,
  PushToTalkButtonContainer,
  ErrorPanel
} from '@speechly/react-ui'
import './App.css'

const App: React.FC = (): JSX.Element => {
  return (
    <div className="App">
      <ErrorPanel />
      <SpeechlyApp/>
    </div>
  )
}

type Message = {
  content: string;
  date: Date;
};

const SpeechlyApp: React.FC = (): JSX.Element => {

  const [textContent, setTextContent] = useState<string>('')
  const [tentativeTextContent, setTentativeTextContent] = useState<string>('')
  const [messages, setMessages] = useState<Message[]>([])
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
  }, [segment])

  const sendMessage = () => {
    const newMessage: Message = {
      content: textContent,
      date: new Date()
    }
    setMessages([ ...messages, newMessage ])
    setText('')
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (textContent.trim() === '') return
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  const formatTime = (date: Date) => date.toLocaleTimeString('en-US', {hour: '2-digit', minute:'2-digit'})

  return (
    <div className="ImApp">
      <div className="Header">
        <img className="Header__image" src="https://avatars.githubusercontent.com/u/25465412?s=200&v=4" alt="profile" />
        <div>
          <h2 className="Header__title">Speechly demo chat</h2>
          <div className="Header__meta">42 uses in the chat</div>
        </div>
      </div>
      <div className="Messages">
        <div className="Message Message--other">
          <span className="Message__content">Hey 👋 What are you up to?</span>
          <span className="Message__time">{formatTime(new Date())}</span>
        </div>
        {messages.map(m =>
          <div className="Message Message--me">
            <span className="Message__content">{m.content}</span>
            <span className="Message__time">{formatTime(m.date)}</span>
          </div>
        )}
      </div>
      <div className="Textarea__container">
        <textarea
          className="Textarea"
          placeholder="Speak or type a message…"
          onChange={e => setText(e.target.value)}
          value={tentativeTextContent}
          onKeyPress={e => handleKeyPress(e)}
          rows={textContent.split('\n').length}
        />
        <PushToTalkButton size="60px" intro="" />
      </div>
    </div>
  )
}

export default App
