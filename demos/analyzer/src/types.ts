import { SpeechSegment } from '@speechly/react-client';

export interface Classification {
  label: string;
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

export type Severity = 'positive' | 'neutral' | 'negative';

export interface TextLabel {
  label: string;
  severity: Severity;
}
