import { SpeechSegment } from '@speechly/react-client';

export interface AbuseLabelingResponse {
  results: {
    text: string;
    labels: AbuseLabel[];
    flagged: boolean;
    flags: string[];
  }[];
}

export interface AbuseLabel {
  label: string;
  score: number;
  flagged: boolean;
}

export interface LabeledSpeechSegment extends SpeechSegment {
  abuseLabels?: AbuseLabel[];
  isFlagged?: boolean;
}

export interface FileOrUrl {
  name: string;
  file?: File;
  src?: string;
}
