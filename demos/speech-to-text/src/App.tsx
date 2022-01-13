import React, { useEffect, useState } from "react";
import { useSpeechContext } from "@speechly/react-client";
import { DemoNavigation } from "@speechly/demo-navigation";
import { PushToTalkButton, ErrorPanel } from "@speechly/react-ui";
import "./App.css";

const App: React.FC = (): JSX.Element => {
  return (
    <div className="App">
      <DemoNavigation />
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
  const [textContent, setTextContent] = useState<string>("")
  const [tentativeTextContent, setTentativeTextContent] = useState<string>("")
  const [messages, setMessages] = useState<Message[]>([])
  const { segment } = useSpeechContext()

  const setText = (value: string) => {
    setTextContent(value)
    setTentativeTextContent(value)
  }

  const toSentenceCase = (str: string) => {
    const alphabet = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];
    const punctuation = [".","!","?"]
    alphabet.forEach(letter => {
      punctuation.forEach(punc => {
          str = str.replace(`${punc} ${letter.toLowerCase()}`,`${punc} ${letter}`)
      })
    })
    return str.charAt(0).toUpperCase() + str.substr(1);
  }

  useEffect(() => {
    if (segment) {
      const plainString = segment.words.filter(w => w.value).map(w => w.value).join(" ")
      const alteredTextContent = textContent ? [textContent, plainString].join(" ") : plainString
      const formattedTextContent = alteredTextContent
        .replace(" COMMA", ",")
        .replace(" PERIOD", ".")
        .replace(" DOT", ".")
        .replace(" QUESTION MARK", "?")
        .replace(" EXCLAMATION MARK", "!")
        .replace(" EXCLAMATION POINT", "!")
        .replace(" COLON", ":")
        .replace(" SEMICOLON", ";")
        .replace(" SEMI COLON", ";")
        .toLowerCase()
      const casedTextContent = toSentenceCase(formattedTextContent);
      setTentativeTextContent(casedTextContent);
      if (segment.isFinal) {
        setText(casedTextContent);
        sendMessage(casedTextContent);
      }
    }
  // eslint-disable-next-line
  }, [segment])

  const sendMessage = (message: string) => {
    if (message.trim() === "") return
    const newMessage: Message = {
      content: message,
      date: new Date()
    }
    setMessages([ ...messages, newMessage ]);
    setText("");
  }

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(textContent);
    }
  }

  const formatTime = (date: Date) => date.toLocaleTimeString("en-US", {hour: "2-digit", minute:"2-digit"})

  return (
    <div className="ImApp">
      <div className="Header">
        <img className="Header__image" src="https://avatars.githubusercontent.com/u/25465412?s=200&v=4" alt="profile" />
        <div>
          <h2 className="Header__title">Speechly demo chat</h2>
          <div className="Header__meta">42 users in the chat</div>
        </div>
      </div>
      <div className="Messages">
        <div className="Message Message--other">
          <span className="Message__content">Hey 👋 What are you up to?</span>
          <span className="Message__time">{formatTime(new Date())}</span>
        </div>
        {messages.map(m =>
          <div key={m.content} className="Message Message--me">
            <span className="Message__content">{m.content}</span>
            <span className="Message__time">{formatTime(m.date)}</span>
          </div>
        )}
      </div>
      <div className="Footer">
        <div className="Textarea__container" data-replicated-value={tentativeTextContent}>
          <textarea
            className="Textarea"
            placeholder="Say or type a message"
            onChange={handleChange}
            value={tentativeTextContent}
            onKeyPress={handleKeyPress}
            rows={1}
          />
        </div>
        <div className="Textarea__button">
          <PushToTalkButton
            gradientStops={["#508CFF", "#009FFA", "#00E48F"]}
            size="56px"
            showTime={2000}
            tapToTalkTime={0}
            />
          </div>
        </div>
    </div>
  )
}

export default App
