import React, { useEffect, useState } from "react";
import { DemoNavigation } from "@speechly/demo-navigation";
import { useSpeechContext } from "@speechly/react-client";
import { ErrorPanel, BigTranscript } from "@speechly/react-ui";
import { Input } from "./Input";
import "./App.css";
import avatar from "./assets/avatar.png";
import logo from "./assets/logo.svg";
import searchIcon from "./assets/search.svg";
import imageIcon from "./assets/image.svg";
import videoIcon from "./assets/video.svg";
import newsIcon from "./assets/news.svg";
import { SearchContextProvider, useSearchContext } from "./context";

const App: React.FC = (): JSX.Element => {
  return (
    <SearchContextProvider>
      <div className="App">
        <DemoNavigation />
        <div className="TranscriptContainer">
          <BigTranscript highlightColor="#009FFA" backgroundColor="#1F2D3B" />
        </div>
        <ErrorPanel />
        <SearchApp />
      </div>
    </SearchContextProvider>
  )
}

const SearchApp: React.FC = (): JSX.Element => {
  const { segment } = useSpeechContext();
  const { query, setQuery, results, getResults } = useSearchContext();
  const [tentativeQuery, setTentativeQuery] = useState<string>("");
  const [prevWordIndex, setPrevWordIndex] = useState(-1);

  const setText = (value: string) => {
    setQuery(value);
    setTentativeQuery(value);
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
      const alteredTextContent = query ? [query, plainString].join(" ") : plainString
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
      setTentativeQuery(casedTextContent);
      segment.words.forEach((word, index) => {
        const wordIndex = index - 1
        if (prevWordIndex < wordIndex) {
          setPrevWordIndex(wordIndex);
          results && getResults(casedTextContent);
        }
      });
      if (segment.isFinal) {
        setText(casedTextContent);
        setPrevWordIndex(-1);
        !results && getResults(casedTextContent);
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
      getResults(query);
    }
  }

  return (
    <div className="SearchApp">
      <div className="Navigation">
        {results && (
          <div className="Navigation__left">
            <Input
              small
              value={tentativeQuery}
              clearFn={() => setText("")}
              onChangeFn={handleChange}
              onKeyPressFn={handleKeyPress}
            />
          </div>
        )}
        <div className="Navigation__right">
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
      </div>
      {!results && (
        <div className="Search">
          <img className="Search__logo" src={logo} alt="logo" />
          <Input
            value={tentativeQuery}
            clearFn={() => setText("")}
            onChangeFn={handleChange}
            onKeyPressFn={handleKeyPress}
          />
        </div>
      )}
      {results && (
        <div className="Results">
          {results.map(item => (
            <a
              key={item.link}
              href={item.link}
              className="Result"
              target="_blank"
              rel="noopener noreferrer"
              >
              <span className="Result__link">{item.displayLink}</span>
              <span className="Result__title">{item.title}</span>
              <span className="Result__snippet">{item.snippet}</span>
            </a>
          ))}
        </div>
      )}
      <div className="Footer">
        &copy; Speechly
      </div>
    </div>
  )
}

export default App
