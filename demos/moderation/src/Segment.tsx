import React, { useEffect, useRef } from "react";
import { Entity, Intent, Word } from "@speechly/react-client";
import { sentenceCase } from "sentence-case";
import classNames from "classnames";
import formatDuration from "format-duration";
import { Label } from "./Label";
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
  const ref = useRef<HTMLDivElement>(null);
  const firstTimestamp = words && words[0].startTimestamp;
  const lastTimestamp = words && words[words.length - 1].endTimestamp;
  const wordsWithEntities = mapWordsWithEntities(words, entities);

  useEffect(() => {
    if (currentTime >= firstTimestamp && currentTime <= lastTimestamp) {
      ref.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [currentTime, firstTimestamp, lastTimestamp]);

  const segmentClasses = classNames({
    Segment: true,
    "Segment--active": currentTime >= firstTimestamp && currentTime <= lastTimestamp
  });

  const wordClasses = (startTimestamp: number) => classNames({
    "highlighted": currentTime > startTimestamp
  });

  return (
    <div className={segmentClasses} onClick={() => onClick(firstTimestamp)} ref={ref}>
      <div className="Segment__timestamp">
        {formatDuration(firstTimestamp, { leading: true })}
      </div>
      <div className="Segment__words">
        {wordsWithEntities.map(({ word, entity }, i) =>
          <React.Fragment key={i}>
            {!entity && (
              <span className={wordClasses(word.startTimestamp)} key={word.index}>
                {i === 0 ? sentenceCase(word.value) : word.value.toLowerCase()}
              </span>
            )}
            {entity && (
              <span className={wordClasses(word.startTimestamp)} key={word.index}>
                <Label variant="entity" type={entity.type}>
                  {i === 0 ? sentenceCase(entity.value) : entity.value.toLowerCase()}
                </Label>
              </span>
            )}
          </React.Fragment>
        )}
      </div>
      {intent.intent && (
        <div className="Segment__labels">
          <Label variant="intent" intent={intent.intent}>
            {sentenceCase(intent.intent)}
          </Label>
        </div>
      )}
    </div>
  );
};
