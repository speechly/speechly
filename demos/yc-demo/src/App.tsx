import { useEffect, useState } from "react";
import { useSpeechContext } from "@speechly/react-client";
import { PushToTalkButton } from "@speechly/react-ui";
import { sentenceCase } from "sentence-case"
import logo from "./assets/speechly-logo-duo-white.svg"
import "./App.css"

const App = () => {
  const { segment } = useSpeechContext();
  const [text, setText] = useState("");
  const highlights = ["meaning", "speechly"]

  useEffect(() => {
    if (segment) {
      const plainString = segment.words.filter(w => w.value).map(w => w.value).join(" ");
      const casedString = sentenceCase(plainString);
      setText(casedString);
      if (segment.isFinal) {
        setText(casedString);
      }
    }
  }, [segment])

  return (
    <div className="App">
      <img className="Logo" src={logo} alt="logo" />
      <div className="Transcript">
        {text.split(" ").map((w, i) => {
          if (highlights.includes(w)) {
            return <span key={w + i} className="highlight">{w}</span>
          }
          return <span key={w + i}>{w}</span>
        })}
      </div>
      <div style={{display: "none"}}>
        <PushToTalkButton captureKey=" " size="0px" />
      </div>
    </div>
  );
}

export default App
