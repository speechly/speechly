import { SpeechSegment } from '@speechly/react-client';

export type Severity = 'positive' | 'neutral' | 'negative';
export type Action = 'warn' | 'mute' | 'ban' | 'reward';

export interface Classification {
  label: string;
  score: number;
  severity?: Severity;
}

export interface ClassifiedSpeechSegment extends SpeechSegment {
  classifications?: Classification[];
  workflows?: Workflow[];
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
  eventLabel: string;
  threshold: number;
  action: Action;
  sum: number;
}
