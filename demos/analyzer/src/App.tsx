import React, { useCallback, useEffect, useState, useRef } from 'react';
import { BrowserMicrophone } from '@speechly/browser-client';
import { DecoderState, SpeechSegment, useSpeechContext } from '@speechly/react-client';
import useStateRef from 'react-usestateref';
import clsx from 'clsx';
import { Waveform } from './components/Waveform';
import { FileInput } from './components/FileInput';
import { AudioFile } from './components/AudioFile';
import { SegmentItem } from './components/SegmentItem';
import { Tag } from './components/Tag';
import { WorkflowItem } from './components/WorkflowItem';
import { WorkflowForm } from './components/WorkflowForm';
import { EventForm } from './components/EventForm';
import { Popover } from './components/Popover';
import {
  Action,
  AudioRegionLabels,
  Classification,
  ClassifiedSpeechSegment,
  FileOrUrl,
  Severity,
  Workflow,
} from './utils/types';
import { AUDIO_CLASSIFIER_URL, CHUNK_MS, AUDIO_ANALYSIS_CHUNK_SIZE, TEXT_CLASSIFIER_URL } from './utils/variables';
import { useLocalStorage } from './utils/useLocalStorage';
import { ReactComponent as MicIcon } from './assets/mic.svg';
import { ReactComponent as Empty } from './assets/empty.svg';
import sample1 from './assets/t1-trailer.wav';
import sample2 from './assets/tiktok-cumbia.wav';
import sample3 from './assets/walmart-ps5.mp3';
import './App.css';

const ourMic = new BrowserMicrophone();
const ac = new AudioContext({ sampleRate: 16000 });
const sp = ac.createScriptProcessor();
sp.connect(ac.destination);
let recorder: MediaRecorder;

const defaultTextEvents: Classification[] = [
  { label: 'a derogatory comment based on faith', severity: 'negative', score: 0 },
  { label: 'a derogatory comment based on sexual orientation', severity: 'negative', score: 0 },
];
const defaultWorkflows: Workflow[] = [
  { count: 2, eventLabel: defaultTextEvents[0].label, threshold: 0.7, action: 'warn', sum: 0 },
];

function App() {
  const { appId, client, segment, clientState, listening, start, stop } = useSpeechContext();
  const [speechSegments, setSpeechSegments, speechSegmentsRef] = useStateRef<ClassifiedSpeechSegment[]>([]);
  const [selectedFileId, setSelectedFileId] = useState<number | undefined>();
  const [textEvents, setTextEvents] = useLocalStorage<Classification[]>('textEvents', defaultTextEvents);
  const [files, setFiles] = useState<FileOrUrl[]>([
    { name: 'Terminator 1 Trailer', src: sample1 },
    { name: 'DJ Gecko Cumbia Music', src: sample2 },
    { name: 'Buying Walmart’s Display PS5', src: sample3 },
  ]);
  const [workflows, setWorkflows] = useLocalStorage<Workflow[]>('workflowRules', defaultWorkflows);
  const [audioSource, setAudioSource] = useState<string>();
  const [detectionBuffer, setDetectionBuffer] = useState<Float32Array>(new Float32Array());
  const [micBuffer, setMicBuffer] = useState<Float32Array[]>([]);
  const [recData, setRecData] = useState<Blob>();
  const [audioEvents, setAudioEvents] = useState<AudioRegionLabels[]>([]);
  const [peakData, setPeakData] = useState<Array<number>>([]);
  const [showEmptyState, setShowEmptyState] = useState(true);
  const [counter, setCounter] = useState(0);
  const [nextRegion, setNextRegion] = useState(0);
  const [closePopover, setClosePopover] = useState(false);
  const [currentTime, setCurrentTime] = useState<number | undefined>(undefined);
  const intervalRef: { current: NodeJS.Timeout | null } = useRef(null);
  const segmentEndRef: { current: HTMLDivElement | null } = useRef(null);
  const mainRef: { current: HTMLDivElement | null } = useRef(null);

  useEffect(() => {
    return () => {
      stopCounter();
      resetWorkflowSums();
    };
    // eslint-disable-next-line
  }, []);

  useEffect(() => () => setClosePopover(false), [closePopover]);

  const classifyBuffer = useCallback(
    async (index: number, buf: Float32Array): Promise<void> => {
      let formData = new FormData();
      let blob = new Blob([buf], { type: 'octet/stream' });
      formData.append('audio', blob);
      formData.append('appId', appId!);
      try {
        const response = await fetch(AUDIO_CLASSIFIER_URL, {
          method: 'POST',
          body: formData,
        });
        if (response.status !== 200) {
          throw new Error(`${response.status} ${response.statusText}`);
        }
        const json = await response.json();
        const classifications = json['classifications'] as Classification[];
        const chunkSec = CHUNK_MS / 1000;
        const start = index * chunkSec;
        setAudioEvents((current) => [...current, { index, start, end: start + chunkSec, classifications }]);
      } catch (err) {
        console.error(err);
      }
    },
    [appId, setAudioEvents]
  );

  useEffect(() => {
    if (micBuffer.length && clientState > 2) {
      const initialValue = 0;
      const newSum = micBuffer.map((b) => b.length).reduce((a, b) => a + b, initialValue);
      if (newSum >= AUDIO_ANALYSIS_CHUNK_SIZE) {
        const buf = new Float32Array(micBuffer.map((a) => Array.from(a)).flat());
        classifyBuffer(nextRegion, buf);
        setNextRegion((current) => current + 1);
        const peaks = [] as Array<number>;
        for (let i = 0; i < buf.length; i += 128) {
          peaks.push(Math.max(...Array.from(buf.slice(i, i + 128).map((x) => Math.abs(x)))));
        }
        setPeakData((prevPeaks) => [...prevPeaks, ...peaks]);
        setMicBuffer([]);
      }
    }
  }, [micBuffer, clientState, classifyBuffer, nextRegion]);

  useEffect(() => {
    if (recData) {
      const src = URL.createObjectURL(recData);
      setAudioSource(src);
      const timeStr = new Date().toISOString().split('T').join(' at ').substring(0, 22);
      const name = `Recording ${timeStr}`;
      setFiles((current) => [...current, { name, src }]);
      setRecData(undefined);
    }
  }, [recData]);

  useEffect(() => {
    if (clientState <= 2) {
      setMicBuffer([]);
    }
  }, [clientState]);

  useEffect(() => {
    const chunk = (data: Float32Array, length: number) => {
      let result = [];
      for (var i = 0; i < data.length; i += length) {
        result.push(data.subarray(i, i + length));
      }
      return result;
    };

    if (detectionBuffer.length >= AUDIO_ANALYSIS_CHUNK_SIZE) {
      const chunks = chunk(detectionBuffer, AUDIO_ANALYSIS_CHUNK_SIZE);
      chunks.map((c, i) => classifyBuffer(i, c));
    }
  }, [detectionBuffer, classifyBuffer]);

  useEffect(() => {
    const scrollToSegmentsEnd = () =>
      !currentTime && segmentEndRef.current?.scrollIntoView({ behavior: 'auto', block: 'end' });

    const updateOrAddSegment = (ss: SpeechSegment | ClassifiedSpeechSegment) => {
      setSpeechSegments((current) => {
        const newArray = [...current];
        const idx = newArray.findIndex((item) => item.contextId === ss.contextId && item.id === ss.id);
        if (idx > -1) {
          newArray[idx] = ss;
        } else {
          newArray.push(ss);
        }
        return newArray;
      });
    };

    const classifySegment = async (ss: SpeechSegment, textEvents: Classification[]): Promise<void> => {
      const text = ss.words.map((word) => word.value).join(' ');
      const labels = textEvents.flatMap((t) => t.label);
      try {
        const response = await fetch(TEXT_CLASSIFIER_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text, labels, appId }),
        });
        if (response.status !== 200) {
          throw new Error(`${response.status} ${response.statusText}`);
        }
        const json = await response.json();
        const rawClassifications = json['classifications'] as Classification[];

        const updatedClassifications = rawClassifications.map((c) => {
          const workflow = workflows.find((w) => w.eventLabel === c.label && w.threshold <= c.score);
          if (workflow) {
            const severity = textEvents.find((t) => t.label === c.label)?.severity;
            return { ...c, ...(severity && { severity }) };
          }
          return c;
        });

        const updatedWorkflows = updatedClassifications
          .flatMap((c) => {
            const newWorkflows = workflows.map((w) =>
              w.eventLabel === c.label && w.threshold <= c.score && w.threshold <= c.score ? { ...w, sum: ++w.sum } : w
            );
            setWorkflows(newWorkflows);
            const sorted = Array.from(newWorkflows).sort((a, b) => (a.count > b.count ? 1 : -1));
            const filtered = sorted
              .filter((w) => w.eventLabel === c.label && w.threshold <= c.score && w.sum === w.count)
              .at(-1);
            return filtered;
          })
          .filter((n) => n);

        const newSegment = {
          ...ss,
          classifications: updatedClassifications,
          ...(updatedWorkflows && { workflows: updatedWorkflows }),
        };
        updateOrAddSegment(newSegment);
        scrollToSegmentsEnd();
      } catch (err) {
        console.error(err);
      }
    };

    if (segment) {
      setShowEmptyState(false);
      updateOrAddSegment(segment);
      scrollToSegmentsEnd();
      if (segment.isFinal) {
        if (textEvents.length) {
          classifySegment(segment, textEvents);
        } else {
          updateOrAddSegment(segment);
        }
        scrollToSegmentsEnd();
      }
    }
    // eslint-disable-next-line
  }, [segment]);

  useEffect(() => {
    if (currentTime) {
      const idx = speechSegmentsRef.current.findIndex((s) => currentTime <= s.words[s.words.length - 1].endTimestamp);
      if (idx === -1) return;
      const el = mainRef.current?.children.item(idx);
      if (!el) return;
      el.scrollIntoView();
    }
  }, [currentTime, speechSegmentsRef]);

  const handleRemoveEvent = (idx: number) => {
    setTextEvents(textEvents.filter((_, i) => i !== idx));
  };

  const handleAddEvent = (e: React.FormEvent<HTMLFormElement>) => {
    const target = e.currentTarget as typeof e.currentTarget & {
      label: { value: string };
      severity: { value: Severity };
    };
    const newEvent = {
      label: target.label.value,
      severity: target.severity.value,
      score: 0,
    };
    setTextEvents([...textEvents, newEvent]);
    setClosePopover(true);
  };

  const resetWorkflowSums = () => {
    setWorkflows(workflows.map((w) => ({ ...w, sum: 0 })));
  };

  const handleRemoveWorkflow = (idx: number) => {
    setWorkflows(workflows.filter((_, i) => i !== idx));
  };

  const handleAddWorkflow = (e: React.FormEvent<HTMLFormElement>) => {
    const target = e.currentTarget as typeof e.currentTarget & {
      count: { value: number };
      threshold: { value: number };
      event: { value: string };
      action: { value: Action };
    };
    const workflow = {
      count: Number(target.count.value),
      threshold: Number(target.threshold.value) / 100,
      eventLabel: target.event.value,
      action: target.action.value,
      sum: 0,
    };
    const newWorkflows = [...workflows, workflow];
    setWorkflows(newWorkflows);
    setClosePopover(true);
  };

  const handleFileAdd = async (file: File) => {
    setFiles((current) => [...current, { name: file.name, file }]);
  };

  const updateDetectionBuffer = async (buffer: ArrayBuffer) => {
    const audioCtx = new AudioContext({ sampleRate: 16000 });
    const decodedBuffer = await audioCtx.decodeAudioData(buffer.slice(0));
    const samples = decodedBuffer.getChannelData(0);
    setDetectionBuffer(samples);
  };

  const handleSelectFile = async (i: number) => {
    if (selectedFileId === i) return;
    if (clientState === DecoderState.Active) return;
    setSelectedFileId(i);
    setAudioSource(undefined);
    setCurrentTime(undefined);
    setSpeechSegments([]);
    setAudioEvents([]);
    setPeakData([]);
    resetWorkflowSums();

    const fileSrc = files[i].src;
    if (fileSrc) {
      const response = await fetch(fileSrc, {
        headers: {
          'Content-Type': 'audio/mpeg;audio/wav',
          Accept: 'audio/mpeg;audio/wav',
        },
        cache: 'no-store',
      });
      if (!response.ok) {
        console.error("Could't find file");
      }
      setAudioSource(fileSrc);
      const buffer = await response.arrayBuffer();
      await updateDetectionBuffer(buffer);
      await client?.uploadAudioData(buffer);
      return;
    }

    const fileFile = files[i].file;
    if (fileFile) {
      const buffer = await fileFile.arrayBuffer();
      const blob = new Blob([buffer], { type: fileFile.type });
      const url = URL.createObjectURL(blob);
      setAudioSource(url);
      await updateDetectionBuffer(buffer);
      await client?.uploadAudioData(buffer);
      return;
    }
  };

  const startCounter = () => {
    if (intervalRef.current) return;
    intervalRef.current = setInterval(() => {
      setCounter((prevCounter) => prevCounter + 1);
    }, 10);
  };

  const stopCounter = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      setCounter(0);
      intervalRef.current = null;
    }
  };

  const handleStart = async () => {
    if (clientState === DecoderState.Active) return;

    if (!ourMic.mediaStream) {
      await ourMic.initialize();
      if (ourMic.mediaStream) {
        await client?.attach(ourMic.mediaStream);
      }
    }

    if (ourMic.mediaStream) {
      const node = ac.createMediaStreamSource(ourMic.mediaStream);
      node.connect(sp);
      await ac.resume();
      sp.onaudioprocess = (e) => {
        const samples = new Float32Array(e.inputBuffer.length);
        e.inputBuffer.copyFromChannel(samples, 0, 0);
        setMicBuffer((current) => [...current, samples]);
      };
      recorder = new MediaRecorder(ourMic.mediaStream);
      recorder.start();
      recorder.ondataavailable = (e) => setRecData(e.data);
    }

    if (speechSegments.length) {
      setSelectedFileId(undefined);
      setAudioSource(undefined);
      setCurrentTime(undefined);
      setSpeechSegments([]);
      setAudioEvents([]);
      setPeakData([]);
      setNextRegion(0);
      resetWorkflowSums();
    }

    if (listening) {
      stopCounter();
      await stop();
      await ac.suspend();
      recorder.stop();
    } else {
      startCounter();
      await start();
    }
  };

  const handleStop = async () => {
    if (listening && counter > 100) {
      stopCounter();
      await stop();
      await ac.suspend();
      recorder.stop();
    }
  };

  const highlightSegment = (time: number) => {
    if (!speechSegmentsRef.current.every((s) => s.isFinal)) return;
    const idx = speechSegmentsRef.current.findIndex((s) => time <= s.words[s.words.length - 1].endTimestamp);
    if (idx === -1) return;
    const el = mainRef.current?.children.item(idx);
    if (!el) return;
    el.classList.toggle('Segment--active');
    setTimeout(() => el.classList.toggle('Segment--active'), 1000);
  };

  return (
    <>
      <div className="App">
        <div className="Sidebar">
          <div className="Sidebar__title">
            <h4>Text events</h4>
            <Popover
              title="Add text event"
              close={closePopover}
            >
              <EventForm
                onSubmit={handleAddEvent}
                textEvents={textEvents}
              />
            </Popover>
          </div>
          <div className="Sidebar__grid">
            {textEvents.map(({ label, severity }, i) => (
              <Tag
                key={`event-${label}-${i}`}
                onRemove={() => handleRemoveEvent(i)}
                severity={severity}
                size="normal"
                label={label}
              />
            ))}
          </div>
          <div className="Sidebar__title">
            <h4>Workflows</h4>
            <Popover
              title="Add workflow"
              close={closePopover}
            >
              <WorkflowForm
                textEvents={textEvents}
                onSubmit={handleAddWorkflow}
              />
            </Popover>
          </div>
          <div className="Sidebar__list">
            {workflows?.map(({ count, eventLabel, threshold, action }, i) => (
              <WorkflowItem
                key={`rule-${eventLabel}-${action}-${i}`}
                count={count}
                label={eventLabel}
                threshold={threshold}
                action={action}
                onDelete={() => handleRemoveWorkflow(i)}
              />
            ))}
          </div>
          <h4 className="Sidebar__title">Audio files</h4>
          <div className="Sidebar__list">
            {files.map(({ name }, i) => (
              <AudioFile
                key={name}
                isSelected={selectedFileId === i}
                onClick={() => handleSelectFile(i)}
              >
                {name}
              </AudioFile>
            ))}
          </div>
          <FileInput
            acceptMimes="audio/wav,audio/mpeg,audio/m4a,audio/mp4"
            onFileSelected={handleFileAdd}
          />
        </div>
        <div
          className="Main"
          ref={mainRef}
        >
          {!speechSegments.length && showEmptyState && (
            <div className="EmptyState">
              <Empty className="EmptyState__icon" />
              <h2 className="EmptyState__title">Speech and audio analysis</h2>
              <p className="EmptyState__description">
                Use one of our sample files, upload your own audio or use the microphone.
              </p>
            </div>
          )}
          {speechSegments?.map((segment) => (
            <SegmentItem
              key={`${segment.contextId}-${segment.id}`}
              currentTime={currentTime}
              segment={segment}
              showDetails={textEvents.length > 0}
            />
          ))}
          <div
            ref={segmentEndRef}
            className="Main__lastItem"
          />
        </div>
      </div>
      <div className="Player">
        <Waveform
          url={audioSource}
          peaks={peakData}
          regionData={audioEvents}
          onRegionClick={highlightSegment}
          onUpdate={(ct) => setCurrentTime(ct)}
        >
          <button
            type="button"
            className={clsx('Microphone', listening && 'Microphone--active')}
            onPointerDown={handleStart}
            onPointerUp={handleStop}
          >
            <MicIcon />
          </button>
        </Waveform>
      </div>
    </>
  );
}

export default App;
