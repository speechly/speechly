import React from 'react';
import formatDuration from 'format-duration';
import clsx from 'clsx';
import { Tag } from './Tag';
import { LabeledSpeechSegment } from '../utils/types';
import { ReactComponent as Spinner } from '../assets/3-dots-fade-black-36.svg';
import './SegmentItem.css';

interface Props {
  segment: LabeledSpeechSegment;
  currentTime?: number;
  showDetails: boolean;
}

export const SegmentItem: React.FC<Props> = ({ segment, currentTime, showDetails }) => {
  const { words, abuseLabels, isFlagged } = segment;

  return (
    <div className={clsx('Segment', isFlagged && 'Segment--flagged')}>
      <div className="Segment__timestamp">
        {isNaN(words[0]?.endTimestamp) && '···'}
        {!isNaN(words[0]?.endTimestamp) && formatDuration(words[0]?.endTimestamp)}
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
          <span>Abuse labels:</span>
          {!abuseLabels && <Spinner width={16} height={16} fill="#7d8fa1" />}
          {abuseLabels?.map(({ label, score, flagged }) => (
            <Tag key={label} label={label} score={score} isFlagged={flagged} />
          ))}
        </div>
      )}
    </div>
  );
};
