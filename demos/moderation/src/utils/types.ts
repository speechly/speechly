import { SpeechSegment } from '@speechly/react-client';

export type Severity = 'positive' | 'neutral' | 'negative';
export type Action = 'warn' | 'mute' | 'ban' | 'reward';

export interface ClassificationResponse {
  results: {
    text: string;
    labels: Classification[];
    flagged: boolean;
    flags: string[];
  }[];
}

export interface Classification {
  label: string;
  score: number;
  flagged: boolean;
}

export interface ClassifiedSpeechSegment extends SpeechSegment {
  classifications?: Classification[];
  isFlagged?: boolean;
}

export interface FileOrUrl {
  name: string;
  file?: File;
  src?: string;
}

export interface AudioRegionLabels {
  index: number;
  start: number;
  end: number;
}
