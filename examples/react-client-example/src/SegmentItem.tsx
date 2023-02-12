import React from 'react';
import { SpeechSegment } from '@speechly/react-client';
import formatDuration from 'format-duration';

interface Props {
  segment: SpeechSegment;
}

export const SegmentItem: React.FC<Props> = ({ segment }) => {
  const text = segment.words.map((w) => w.value).join(' ');
  const timestamp = formatDuration(segment.words[segment.words.length - 1].endTimestamp);
  const { intent, entities } = segment;
  const entitiesList = entities.map((e) => `${e.value} (${e.type})`).join(', ');

  return (
    <div className="segment">
      <div>{timestamp}</div>
      <div className="segment-content">
        <div>{text}</div>
        {intent.intent && (
          <div className="segment-details">
            intent: {intent.intent}
            {entitiesList ? ` · entities: ${entitiesList}` : ''}
          </div>
        )}
      </div>
    </div>
  );
};
