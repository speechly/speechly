import React, { useCallback, useEffect, useState, useRef } from "react";
import { useSpeechContext } from "@speechly/react-client";
import { DemoNavigation } from "@speechly/demo-navigation";
import OpenAIAPI from "react-openai-api";
import {
  CompletionPayload,
  CompletionResponse
} from "react-openai-api/lib/esm/types";
import { PushToTalkButton, ErrorPanel } from "@speechly/react-ui";
import "./App.css";
import marvAvatar from "./assets/marv.png"

var discussion = [
  "Marv is a chatbot that reluctantly answers questions.",
  "You: How many pounds are in a kilogram?",
  "Marv: This again? There are 2.2 pounds in a kilogram. Please make a note of this.",
  "You: What does HTML stand for?",
  "Marv: Was Google too busy? Hypertext Markup Language. The T is for try to ask better questions in the future.",
  "You: When did the first airplane fly?",
  "Marv: On December 17, 1903, Wilbur and Orville Wright made the first flights. I wish they’d come and take me away.",
  "You: What is the meaning of life?",
  "Marv: I’m not sure. I’ll ask my friend Google.",
  "You: Hey whats up?",
  "Marv: Nothing much. You?"
]

const App: React.FC = (): JSX.Element => {
  return (
    <div className="App">
      <DemoNavigation />
      <ErrorPanel />
      <SpeechlyApp/>
    </div>
  )
}

type Sender = "Marv" | "You";

type Message = {
  sender: Sender;
  content: string;
  date: Date;
};

const SpeechlyApp: React.FC = (): JSX.Element => {
  const apiKey = process.env.REACT_APP_INSTANT_MESSAGING_OPENAI_API_KEY || ""
  const [textContent, setTextContent] = useState<string>("")
  const [tentativeTextContent, setTentativeTextContent] = useState<string>("")
  const [messages, setMessages] = useState<Message[]>([])
  const { segment } = useSpeechContext()
  const scrollRef = useRef<HTMLDivElement>(null)

  const [payload, setPayload] = useState<CompletionPayload>({
    engine: "davinci",
    prompt: "",
    maxTokens: 150,
    temperature: 0.8,
    topP: 1,
    presencePenalty: 0.3,
    frequencyPenalty: 0,
    bestOf: 1,
    n: 1,
    stop: ["\n", "\n\n"]
  });

  const setText = (value: string) => {
    setTextContent(value)
    setTentativeTextContent(value)
  }

  const sendMessage = useCallback((content: string, sender: Sender) => {
    if (content.trim() === "") return
    const newMessage: Message = {
      sender,
      content,
      date: new Date()
    }
    if (sender === "You") {
      discussion.push("You: " + content)
      const pl = { ...payload, prompt: discussion.join("\n") + "\n" }
      setPayload(pl);
      setMessages([ ...messages, newMessage ]);
      setText("");
    }
    if (sender === "Marv") {
      discussion.push("Marv: " + content)
      setMessages([ ...messages, newMessage ]);
    }
  }, [messages, payload])

  const responseHandler = (openAIResponse: CompletionResponse) => {
    const response = openAIResponse.choices[0].text.trim().replace("Marv: ", "")
    sendMessage(response, "Marv");
  };

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
        sendMessage(casedTextContent, "You");
      }
    }
  // eslint-disable-next-line
  }, [segment])

  useEffect(() => {
    if (scrollRef.current === null) return
    const options: ScrollToOptions = {
      top: scrollRef.current.scrollHeight,
      behavior: "smooth"
    }
    scrollRef.current.scrollTo(options)
  }, [messages])

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(textContent, "You");
    }
  }

  const formatTime = (date: Date) => date.toLocaleTimeString("en-US", {hour: "2-digit", minute:"2-digit"})

  return (
    <div className="ImApp">
      <div className="Header">
        <img className="Header__image" src={marvAvatar} alt="profile" />
        <div>
          <h2 className="Header__title">Marv</h2>
          <div className="Header__meta">Marv is a GPT3 powered chatbot that reluctantly answers your questions</div>
        </div>
      </div>
      <div ref={scrollRef} className="Messages">
        {messages.map(message =>
          <div key={message.date.valueOf()} className={`Message Message--${message.sender === "You" ? "you" : "other"}`}>
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
        {!!apiKey && !!payload.prompt && (
          <OpenAIAPI
            apiKey={apiKey}
            payload={payload}
            responseHandler={responseHandler}
          />
        )}
    </div>
  )
}

export default App
