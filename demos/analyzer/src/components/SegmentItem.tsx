import React from 'react';
import formatDuration from 'format-duration';
import clsx from 'clsx';
import { Tag } from './Tag';
import { ClassifiedSpeechSegment } from '../utils/types';
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
      <div className="Segment__header">
        <div className="Segment__timestamp">
          {isNaN(words[0]?.endTimestamp) && '···'}
          {!isNaN(words[0]?.endTimestamp) && formatDuration(words[0]?.endTimestamp)}
        </div>
        {classifications?.map((c) =>
          c.workflows?.map((w, i) =>
            w.sum === w.count ? (
              <span
                key={`action-${w.eventLabel}-${w.sum}-${i}`}
                className={`Segment__action Segment__action--${w.action}`}
              >
                {w.action}
              </span>
            ) : null
          )
        )}
      </div>
      <div className="Segment__transcript">
        {words.map(({ index, startTimestamp, value }) => (
          <span
            key={index}
            className={clsx(
              currentTime && 'Segment__word',
              currentTime && currentTime >= startTimestamp && 'Segment__word--highlighted'
            )}
          >
            {value}{' '}
          </span>
        ))}
      </div>
      {showDetails && (
        <div className="Segment__details">
          <span>Text events:</span>
          {!classifications && (
            <Spinner
              width={16}
              height={16}
              fill="#7d8fa1"
            />
          )}
          {classifications?.map(({ label, score, severity }) => (
            <Tag
              key={label}
              label={label}
              score={score}
              severity={severity ? severity : undefined}
              size={severity ? 'small' : undefined}
            />
          ))}
        </div>
      )}
    </div>
  );
};
