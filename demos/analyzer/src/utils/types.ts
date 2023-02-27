import { SpeechSegment } from '@speechly/react-client';

export type Severity = 'positive' | 'neutral' | 'negative' | undefined;

export interface Classification {
  label: string;
  severity: Severity;
  score: number;
}

export interface ClassifiedSpeechSegment extends SpeechSegment {
  classifications?: Classification[];
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
  classifications: Classification[];
}
