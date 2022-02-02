import React, { useEffect, useState } from "react";
import { useSpeechContext } from "@speechly/react-client";
import { Input } from "./Input";
import { useSearchContext } from "./context";
import { isStandalone } from "./utils";
import "./SearchView.css";
import logo from "./assets/logo.svg";

const MadeWith = () => <div className="MadeWith">Made with ♥ using <a href="https://speechly.com">Speechly</a></div>

const SearchView: React.FC = (): JSX.Element => {
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
      const formattedTextContent = plainString
        .replace(" COMMA", ",")
        .replace(" PERIOD", ".")
        .replace(" DOT", ".")
        .replace(" QUESTION MARK", "?")
        .replace(" EXCLAMATION MARK", "!")
        .replace(" EXCLAMATION POINT", "!")
        .replace(" COLON", ":")
        .replace(" SEMICOLON", ";")
        .replace(" SEMI COLON", ";")
        .toLowerCase();
      const casedTextContent = toSentenceCase(formattedTextContent);
      setTentativeQuery(casedTextContent);
      segment.words.forEach((word, index) => {
        const wordIndex = index - 1
        if (word.isFinal && prevWordIndex < wordIndex) {
          setPrevWordIndex(wordIndex);
          results && getResults(casedTextContent);
        }
      });
      if (segment.isFinal) {
        setText(casedTextContent);
        window.postMessage({ type: "speechhandled", success: true }, "*");
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
    if (e.key === "Enter") {
      e.preventDefault();
      getResults(query);
    }
  }

  const classes = isStandalone ? "SearchView SearchView--standalone" : "SearchView"

  return (
    <div className={classes}>
      {!results && (
        <div className="SearchBox">
          <img className="SearchBox__logo" src={logo} alt="logo" />
          <Input
            value={tentativeQuery}
            clearFn={() => setText("")}
            onChangeFn={handleChange}
            onKeyPressFn={handleKeyPress}
          />
          <MadeWith />
        </div>
      )}
      {results && (
        <>
          <div className="Navigation">
            <a href="/" className="Navigation__link">
              <img className="Navigation__logo" src={logo} alt="logo" />
            </a>
            <Input
              small
              value={tentativeQuery}
              clearFn={() => setText("")}
              onChangeFn={handleChange}
              onKeyPressFn={handleKeyPress}
            />
          </div>
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
          <div className="Footer">
            <MadeWith />
          </div>
        </>
      )}
    </div>
  )
}

export default SearchView
