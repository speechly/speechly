import React, { useEffect, useState } from "react";
import { useSpeechContext } from "@speechly/react-client";
import { PushToTalkButton } from "@speechly/react-ui";
import "./Input.css";
import searchIconGray from "./assets/search-gray.svg";
import closeIconGray from "./assets/close-gray.svg";

export const Input: React.FC <{
  small?: boolean,
  query?: string,
}> = ({ small, query }) => {
  const [textContent, setTextContent] = useState<string>("");
  const [tentativeTextContent, setTentativeTextContent] = useState<string>("");
  const { segment } = useSpeechContext();

  const setText = (value: string) => {
    setTextContent(value);
    setTentativeTextContent(value);
  }

  const toSentenceCase = (str: string) => {
    const alphabet = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];
    const punctuation = [".","!","?"]
    alphabet.forEach(letter => {
      punctuation.forEach(punc => {
          str = str.replace(`${punc} ${letter.toLowerCase()}`,`${punc} ${letter}`);
      });
    });
    return str.charAt(0).toUpperCase() + str.substr(1);
  }

  useEffect(() => {
    if (segment) {
      const plainString = segment.words.filter(w => w.value).map(w => w.value).join(" ");
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
      const casedTextContent = toSentenceCase(formattedTextContent)
      setTentativeTextContent(casedTextContent);
      if (segment.isFinal) {
        setTextContent(casedTextContent);
      }
    }
  // eslint-disable-next-line
  }, [segment])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
    }
  }

  const classes = small ? "Input Input--small" : "Input"
  const buttonSize = small ? "32px" : "48px"

  return (
    <div className={classes}>
      <input
        className="Input__textfield"
        placeholder="Search the web"
        onChange={handleChange}
        value={tentativeTextContent}
        onKeyPress={handleKeyPress}
      />
      <img className="Input__icon" src={tentativeTextContent ? closeIconGray : searchIconGray} alt="icon" onClick={() => setText("")} />
      <div className="Input__button">
        <PushToTalkButton size={buttonSize} intro="" />
      </div>
    </div>
  )
}
