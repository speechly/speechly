import React from "react";
import { Intent, Word } from "@speechly/react-client";
import { sentenceCase } from "sentence-case";
import classNames from "classnames";
import formatDuration from "format-duration";
import "./Segment.css";

type SegmentProps = {
  words: Word[];
  intent: Intent;
  currentTime?: number;
  onClick: (ms: number) => void;
};

export const Segment = ({ words, intent, currentTime = 0, onClick }: SegmentProps) => {
  const firstTimestamp = words && words[0].startTimestamp;
  const lastTimestamp = words && words[words.length - 1].endTimestamp;

  const segmentClasses = classNames({
    Segment: true,
    "Segment--active": currentTime >= firstTimestamp && currentTime <= lastTimestamp
  });
  const intentClasses = classNames({
    Label: true,
    "Label--danger": intent.intent === "offensive",
    "Label--success": intent.intent !== "offensive",
    "Label--tentative": !intent.isFinal
  });

  return (
    <div className={segmentClasses} onClick={() => onClick(firstTimestamp)}>
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
