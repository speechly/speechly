import React, { useCallback, useEffect, useState } from "react";
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

type Sender = "other" | "me";

type Message = {
  sender: Sender;
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

  const sendMessage = useCallback((content: string, sender: Sender) => {
    if (content.trim() === "") return
    const newMessage: Message = {
      sender,
      content,
      date: new Date()
    }
    setMessages([ ...messages, newMessage ]);
    if (sender === "me") setText("");
  }, [messages])

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
        sendMessage(casedTextContent, "me");
      }
    }
  // eslint-disable-next-line
  }, [segment])

  useEffect(() => {
    if (!messages.length) {
      const timer = setTimeout(() => sendMessage("Hey 👋 What are you up to?", "other"), 1500);
      return () => clearTimeout(timer);
    }
    if (messages.length === 2) {
      const timer = setTimeout(() => sendMessage("That sounds great! 👍", "other"), 1500);
      return () => clearTimeout(timer);
    }
  }, [messages, sendMessage])

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(textContent, "me");
    }
  }

  const formatTime = (date: Date) => date.toLocaleTimeString("en-US", {hour: "2-digit", minute:"2-digit"})

  return (
    <div className="ImApp">
      <div className="Header">
        <img className="Header__image" src="https://avatars.githubusercontent.com/u/25465412?s=200&v=4" alt="profile" />
        <div>
          <h2 className="Header__title">Speechly chat demo</h2>
          <div className="Header__meta">42 users in the chat</div>
        </div>
      </div>
      <div className="Messages">
        {messages.map(message =>
          <div key={message.date.valueOf()} className={`Message Message--${message.sender}`}>
            {message.sender === "other" && <span className="Message__sender">bot</span>}
            <span className="Message__content">{message.content}</span>
            <span className="Message__time">{formatTime(message.date)}</span>
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
