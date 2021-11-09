import React, { ReactNode, useEffect, useState } from "react";
import {
  SpeechSegment,
  SpeechState,
  useSpeechContext,
} from "@speechly/react-client";
import { isMobile } from "react-device-detect";
import micimage from "res/mic-icon@2x.png";
import { Chip } from "@material-ui/core";
import "./Transscript.css";

type ITaggedWord = {
  word: string;
  serialNumber: number;
  entityType: string | null;
};

const Transscript: React.FC = (props) => {
  const { speechState, segment } = useSpeechContext();

  return (
    <div className="Transscript">
      {segment ? (
        <div>
          <Words segment={segment} />
        </div>
      ) : (
        (speechState === SpeechState.Idle &&
          ((isMobile && (
            <div>
              Tap{" "}
              <img
                src={micimage}
                className="text-micicon"
                alt="Mic"
                draggable="false"
              />{" "}
              and say <i>'Blue Pants'</i>
            </div>
          )) ||
            (!isMobile && (
              <div>
                Tap <Chip variant="outlined" label="SPACE" /> to start
              </div>
            )))) ||
        (speechState !== SpeechState.Idle && (
          <>
            {isMobile && (
              <div>
                Hold{" "}
                <img
                  src={micimage}
                  className="text-micicon"
                  alt="Mic"
                  draggable="false"
                />{" "}
                and say <i>'Blue Pants'</i>
              </div>
            )}
            {!isMobile && (
              <div>
                Hold <Chip variant="outlined" label="SPACE" /> and say{" "}
                <i>'Blue Pants'</i>
              </div>
            )}
          </>
        ))
      )}
    </div>
  );
};

const Words: React.FC<{ segment: SpeechSegment }> = ({ segment }) => {
  if (!segment) return <></>;
  /*
  console.log(segment.words.map((w) => `${w.value}[${w.index}]`).join("; "));
  console.log(
    segment.entities
      .map((w) => `${w.value}:${w.type}(${w.startPosition}..${w.endPosition})`)
      .join("; ")
  );
  */

  // Assign words to a new list with original index (segments.words array indices may not correlate with entity.startIndex)
  let words: ITaggedWord[] = [];
  segment.words.forEach((w) => {
    words[w.index] = { word: w.value, serialNumber: w.index, entityType: null };
  });

  // Tag words with entities
  segment.entities.forEach((e) => {
    words.slice(e.startPosition, e.endPosition).forEach((w) => {
      w.entityType = e.type;
    });
  });

  // Remove holes from word array
  words = words.flat();
  // console.log(words);
  words.push({ word: "", serialNumber: 0, entityType: null }); // Insert end marker

  // Combine words of same type into HTML element snippets
  let snippets: ReactNode[] = [];
  let startSnippetIndex = 0;
  let startSnippet: ITaggedWord | null = null;
  words.forEach((w, index) => {
    if (!startSnippet) {
      startSnippetIndex = index;
      startSnippet = w;
    }
    let end = index === words.length - 1;
    if (end || w.entityType !== startSnippet.entityType) {
      if (startSnippet.entityType !== null) {
        snippets.push(
          <TransscriptItem key={startSnippet.serialNumber}>
            <Entity
              entityType={startSnippet.entityType}
              text={words
                .slice(startSnippetIndex, index)
                .map((w) => w.word)
                .join(" ")}
            />{" "}
          </TransscriptItem>
        );
      } else {
        snippets.push(
          <TransscriptItem key={startSnippet.serialNumber}>
            <Word
              text={words
                .slice(startSnippetIndex, index)
                .map((w) => w.word)
                .join(" ")}
            />{" "}
          </TransscriptItem>
        );
      }
      startSnippetIndex = index;
      startSnippet = w;
    }
  });

  console.log(
    `${segment.isFinal ? "[FINAL] " : ""}${
      segment.intent ? "*" + segment.intent.intent + " " : ""
    }${segment.words.map((w) => w.value).join(" ")}`,
    segment.entities
  );

  return <div>{snippets}</div>;
};

const TransscriptItem: React.FC = (props) => {
  const [rendered, setRendered] = useState(false);
  useEffect(() => {
    setRendered(true);
  }, []);
  return (
    <span className={`transscriptitem ${rendered ? "appear" : ""}`}>
      {props.children}
    </span>
  );
};

const Word: React.FC<{ text: string }> = (props) => {
  return <span className={`word`}>{props.text}</span>;
};

const Entity: React.FC<{ text: string; entityType: string }> = (props) => {
  const [rendered, setRendered] = useState(false);
  useEffect(() => {
    setRendered(true);
  }, []);
  return (
    <b className={`entity ${props.entityType} ${rendered ? "appear" : ""}`}>
      {props.text}
    </b>
  );
};

export default Transscript;
