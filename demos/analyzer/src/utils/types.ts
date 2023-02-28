import { SpeechSegment } from '@speechly/react-client';

export type Severity = 'positive' | 'neutral' | 'negative' | undefined;

export interface Classification {
  label: string;
  severity: Severity;
  score: number;
  threshold: number;
}

export interface ClassifiedSpeechSegment extends SpeechSegment {
  classifications?: Classification[];
  extra?: string[];
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

export interface Workflow {
  count: number;
  event: Classification;
  action: string;
}
