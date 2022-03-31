import React from "react";
import { Entity, Intent, Word } from "@speechly/react-client";
import { sentenceCase } from "sentence-case";
import classNames from "classnames";
import formatDuration from "format-duration";
import "./Segment.css";

const findEntity = (word: Word, entities: Entity[]) =>
  entities.find(entity => word.index >= entity.startPosition && word.index < entity.endPosition);

const mapWordsWithEntities = (words: Word[], entities: Entity[]) =>
  words.flatMap(word => [{ word, entity: findEntity(word, entities) }])

type SegmentProps = {
  words: Word[];
  intent: Intent;
  entities: Entity[];
  currentTime?: number;
  onClick: (ms: number) => void;
};

export const Segment = ({ words, intent, entities, currentTime = 0, onClick }: SegmentProps) => {
  const firstTimestamp = words && words[0].startTimestamp;
  const lastTimestamp = words && words[words.length - 1].endTimestamp;
  const wordsWithEntities = mapWordsWithEntities(words, entities);

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
      <div className="Segment__timestamp">
        {formatDuration(firstTimestamp, { leading: true })}
      </div>
      <div className="Segment__words">
        {wordsWithEntities.map(({ word, entity }, i) =>
          <>
            {!entity && (
              <span key={word.index}>
                {i === 0 ? sentenceCase(word.value) : word.value.toLowerCase()}
              </span>
            )}
            {entity && (
              <span className="Label Label--info" key={word.index}>
                {i === 0 ? sentenceCase(entity.value) : entity.value.toLowerCase()}
                <small>{entity.type}</small>
              </span>
            )}
          </>
        )}
      </div>
      {intent.intent && (
        <div className="Segment__labels">
          <div className={intentClasses}>
            {sentenceCase(intent.intent)}
          </div>
        </div>
      )}
    </div>
  );
};
