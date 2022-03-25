import React from "react";
import { sentenceCase } from "sentence-case";
import "./Segment.css";

type SegmentProps = {
  timestamp: string;
  transcript: string[];
  labels: [
    {
      text: string;
      variant: "success" | "danger" | "undefined";
    }
  ];
};
export const Segment = ({ timestamp, transcript, labels }: SegmentProps) => {
  return (
    <div className="Segment">
      <div className="Segment__timestamp">{timestamp}</div>
      <div className="Segment__transcript">
        {transcript.map((word, i) => <span key={word + i}>{i === 0 ? sentenceCase(word) : word.toLowerCase()}</span>
        )}
      </div>
      {labels?.length > 0 && (
        <div className="Segment__labels">
          {labels?.map((label, i) => <div key={label.text + i} className={`Label Label--${label.variant}`}>offensive</div>
          )}
        </div>
      )}
    </div>
  );
};
