import React from "react";
import { sentenceCase } from "sentence-case";
import "./Transcript.css";

type TranscriptProps = {
  timestamp: string;
  utterance: string[];
  labels: [
    {
      text: string;
      variant: "success" | "danger" | "undefined";
    }
  ];
};
export const Transcript = ({ timestamp, utterance, labels }: TranscriptProps) => {
  return (
    <div className="Transcript">
      <div className="Transcript__timestamp">{timestamp}</div>
      <div className="Transcript__utterance">
        {utterance.map((word, i) => <span key={word + i}>{i === 0 ? sentenceCase(word) : word.toLowerCase()}</span>
        )}
      </div>
      {labels?.length > 0 && (
        <div className="Transcript__labels">
          {labels?.map((label, i) => <div key={label.text + i} className={`Label Label--${label.variant}`}>offensive</div>
          )}
        </div>
      )}
    </div>
  );
};
