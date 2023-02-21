import React from 'react';
import formatDuration from 'format-duration';
import clsx from 'clsx';
import { Tag } from './Tag';
import { ClassifiedSpeechSegment } from '../types';
import { TAG_THRESHOLD } from '../variables';
import { ReactComponent as Spinner } from '../assets/3-dots-fade-black-36.svg';
import './SegmentItem.css';

interface Props {
  segment: ClassifiedSpeechSegment;
  currentTime?: number;
  showDetails: boolean;
}

export const SegmentItem: React.FC<Props> = ({ segment, currentTime, showDetails }) => {
  const { words, classifications } = segment;

  return (
    <div className="Segment">
      <div className="Segment__timestamp">
        {isNaN(words[0]?.endTimestamp) && '···'}
        {!isNaN(words[0]?.endTimestamp) && formatDuration(words[0]?.endTimestamp)}
      </div>
      <div className="Segment__transcript">
        {words.map((word) => (
          <span
            key={word.index}
            className={clsx(
              currentTime && 'Segment__word',
              currentTime && currentTime >= word.startTimestamp && 'Segment__word--highlighted'
            )}
          >
            {word.value}{' '}
          </span>
        ))}
      </div>
      {showDetails && (
        <div className="Segment__details">
          <span>Text classification:</span>
          {!classifications && <Spinner width={16} height={16} fill="#7d8fa1" />}
          {classifications?.map(({ label, score, severity }, i) => (
            <Tag
              key={`${label}-${i}`}
              severity={score > TAG_THRESHOLD ? severity : undefined}
              size={score > TAG_THRESHOLD ? 'small' : undefined}
            >
              {label}: {(score * 100).toFixed(2)}%
            </Tag>
          ))}
        </div>
      )}
    </div>
  );
};
