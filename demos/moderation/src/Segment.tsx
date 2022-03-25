import React from "react";
import { Intent, Word } from "@speechly/react-client";
import { sentenceCase } from "sentence-case";
import classNames from "classnames";
import formatDuration from "format-duration";
import "./Segment.css";

type SegmentProps = {
  words: Word[];
  intent: Intent;
  onClick: (ms: number) => void;
};

export const Segment = ({ words, intent, onClick }: SegmentProps) => {
  const intentClasses = classNames({
    Label: true,
    "Label--danger": intent.intent === "offensive",
    "Label--success": intent.intent !== "offensive",
    "Label--tentative": !intent.isFinal
  });
  const firstTimestamp = words && words[0].startTimestamp;

  return (
    <div className="Segment" onClick={() => onClick(firstTimestamp)}>
      <div title={`${firstTimestamp}`} className="Segment__timestamp">
        {formatDuration(firstTimestamp, { leading: true })}
      </div>
      <div className="Segment__words">
        {words.map((word, i) =>
          <span key={word.index}>
            {i === 0 ? sentenceCase(word.value) : word.value.toLowerCase()}
          </span>
        )}
      </div>
      {intent.intent && (
        <div className="Segment__labels">
          <div title={intent.intent} className={intentClasses}>
            {sentenceCase(intent.intent)}
          </div>
        </div>
      )}
    </div>
  );
};
