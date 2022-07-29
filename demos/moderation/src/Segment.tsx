import React, { useEffect, useRef } from "react";
import { Entity, Intent, Word } from "@speechly/react-client";
import { sentenceCase } from "sentence-case";
import classNames from "classnames";
import formatDuration from "format-duration";
import { Label } from "./Label";
import "./Segment.css";

const scOptions = {
  stripRegexp: /[^A-Z0-9@'"]+/gi
}

const isWordPartOfEntity = (entity: Entity, word: Word | undefined) =>
  word && word.index >= entity.startPosition && word.index < entity.endPosition;

const transformWordsToMatchEntities = (words: Word[], entities: Entity[]) => {
  let wordsBuilder: {word: Word, entity?: Entity | null}[] = [];

  words.forEach(word => {
    if (!word) return;
    let entitiesToDisplay = entities;
    const wordEntity = entitiesToDisplay.find(entity => isWordPartOfEntity(entity, word));

    if (!wordEntity) {
      wordsBuilder[word.index] = { word };
    } else {
      const combinedWordValue = words
        .filter(word => isWordPartOfEntity(wordEntity, word))
        .map(word => word.value)
        .join(" ");

      wordsBuilder[wordEntity.startPosition] = {
        entity: wordEntity,
        word: { ...word, value: combinedWordValue, index: wordEntity.startPosition }
      };
    }
  });

  return wordsBuilder.filter(item => item.word);
}

type SegmentProps = {
  words: Word[];
  intent: Intent;
  entities: Entity[];
  currentTime?: number;
  onClick: (ms: number) => void;
  isFinal: boolean;
};

export const Segment = ({ words, intent, entities, currentTime = 0, onClick, isFinal }: SegmentProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const firstTimestamp = isFinal ? words && words[0].startTimestamp : 0;
  const lastTimestamp = isFinal ? words && words[words.length - 1].endTimestamp : 0;
  const wordsWithEntities = transformWordsToMatchEntities(words, entities);

  useEffect(() => {
    if (currentTime >= firstTimestamp && currentTime <= lastTimestamp) {
      ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [currentTime, firstTimestamp, lastTimestamp]);

  const segmentClasses = classNames({
    Segment: true,
    "Segment--active": currentTime >= firstTimestamp && currentTime < lastTimestamp
  });

  const wordClasses = (startTimestamp: number) => classNames({
    "highlighted": currentTime >= startTimestamp
  });

  return (
    <div className={segmentClasses} onClick={() => onClick(firstTimestamp)} ref={ref}>
      <div className="Segment__words">
        {wordsWithEntities.map(({ word, entity }, i) =>
          <React.Fragment key={i}>
            {!entity && (
              <span className={wordClasses(word.startTimestamp)} key={word.index}>
                {i === 0 ? sentenceCase(word.value, scOptions) : word.value.toLowerCase()}
              </span>
            )}
            {entity && (
              <span className={wordClasses(word.startTimestamp)} key={word.index}>
                <Label variant="entity" type={entity.type}>
                  {i === 0 ? sentenceCase(entity.value, scOptions) : entity.value.toLowerCase()}
                </Label>
              </span>
            )}
          </React.Fragment>
        )}
      </div>
      <div className="Segment__labels">
        <Label variant="time">
          {formatDuration(firstTimestamp, { leading: true })}
        </Label>
        {intent.intent && (
          <Label variant="intent" intent={intent.intent}>
            {sentenceCase(intent.intent, scOptions)}
          </Label>
        )}
      </div>
    </div>
  );
};
