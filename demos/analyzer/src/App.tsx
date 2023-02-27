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
import { AudioRegionLabels, Classification, ClassifiedSpeechSegment, FileOrUrl, Severity } from './utils/types';
import {
  AUDIO_CLASSIFIER_URL,
  CHUNK_MS,
  AUDIO_ANALYSIS_CHUNK_SIZE,
  TEXT_CLASSIFIER_URL,
  MAX_TAGS,
  TAG_THRESHOLD,
} from './utils/variables';
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

const defaultTags: Classification[] = [
  { label: 'a derogatory comment based on sexual orientation', severity: 'negative', score: 0 },
  { label: 'a derogatory comment based on faith', severity: 'negative', score: 0 },
];

function App() {
  const { appId, client, segment, clientState, listening, start, stop } = useSpeechContext();
  const [speechSegments, setSpeechSegments, speechSegmentsRef] = useStateRef<ClassifiedSpeechSegment[]>([]);
  const [selectedFileId, setSelectedFileId] = useState<number | undefined>();
  const [isAddTagEnabled, setIsAddTagEnabled] = useState(false);
  const [tagValue, setTagValue] = useState('');
  const [tags, setTags] = useLocalStorage<Classification[]>('textLabels', defaultTags);
  const [files, setFiles] = useState<FileOrUrl[]>([
    { name: 'Terminator 1 Trailer', src: sample1 },
    { name: 'DJ Gecko Cumbia Music', src: sample2 },
    { name: 'Buying Walmart’s Display PS5', src: sample3 },
  ]);
  const [audioSource, setAudioSource] = useState<string>();
  const [detectionBuffer, setDetectionBuffer] = useState<Float32Array>(new Float32Array());
  const [micBuffer, setMicBuffer] = useState<Float32Array[]>([]);
  const [recData, setRecData] = useState<Blob>();
  const [audioEvents, setAudioEvents] = useState<AudioRegionLabels[]>([]);
  const [peakData, setPeakData] = useState<Array<number>>([]);
  const [showEmptyState, setShowEmptyState] = useState(true);
  const [counter, setCounter] = useState(0);
  const [nextRegion, setNextRegion] = useState(0);
  const [currentTime, setCurrentTime] = useState<number | undefined>(undefined);
  const [violationCount, setViolationCount] = useState(0);
  const intervalRef: { current: NodeJS.Timeout | null } = useRef(null);
  const segmentEndRef: { current: HTMLDivElement | null } = useRef(null);
  const mainRef: { current: HTMLDivElement | null } = useRef(null);

  useEffect(() => {
    return () => {
      stopCounter();
      setViolationCount(0);
    };
  }, []);

  useEffect(() => {
    if (violationCount >= 3) {
      const message = 'That’s 3 negative text labels. Disciplinary actions will be taken if you continue like this.';
      window.alert(message);
      setViolationCount(0);
    }
  }, [violationCount]);

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

    const classifySegment = async (ss: SpeechSegment, tags: Classification[]): Promise<void> => {
      const text = ss.words.map((word) => word.value).join(' ');
      const labels = tags.flatMap((t) => t.label);
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
        const classifications = rawClassifications.map((c) => {
          const match = tags.find((t) => t.label === c.label);
          if (match) return { ...c, severity: match.severity };
          return c;
        });
        const updatedCount = classifications.filter((x) => x.severity === 'negative' && x.score > TAG_THRESHOLD).length;
        const newSegment = { ...ss, classifications };
        updateOrAddSegment(newSegment);
        scrollToSegmentsEnd();
        setViolationCount((current) => current + updatedCount);
      } catch (err) {
        console.error(err);
      }
    };

    if (segment) {
      setShowEmptyState(false);
      updateOrAddSegment(segment);
      scrollToSegmentsEnd();
      if (segment.isFinal) {
        if (tags.length) {
          classifySegment(segment, tags);
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

  const handleRemoveTag = (label: string) => {
    const newTags = tags.filter((t) => t.label !== label);
    setTags(newTags);
  };

  const handleFormChange = (e: React.FormEvent<HTMLFormElement>) => {
    const target = e.currentTarget as typeof e.currentTarget & {
      label: { value: string };
      severity: { value: Severity };
    };
    const isDuplicate = tags.find((t) => t.label === target.label.value);
    const enabled = !!target.label.value && !!target.severity.value && tags.length < MAX_TAGS && !isDuplicate;
    setIsAddTagEnabled(enabled);
  };

  const handleAddTag = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const target = e.currentTarget as typeof e.currentTarget & {
      label: { value: string };
      severity: { value: Severity };
    };
    const tag = { label: target.label.value, severity: target.severity.value, score: 0 };
    const newTags = [...tags, tag];
    setTags(newTags);
    setTagValue('');
    setIsAddTagEnabled(false);
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
    setViolationCount(0);

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
      setViolationCount(0);
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

  const severities: Severity[] = ['positive', 'neutral', 'negative'];

  return (
    <>
      <div className="App">
        <div className="Sidebar">
          <h4 className="Sidebar__title">Text classification labels</h4>
          <div className="Tags">
            {tags.map((tag, i) => (
              <Tag
                key={`${tag.label}-${i}`}
                onRemove={() => handleRemoveTag(tag.label)}
                severity={tag.severity}
                size="normal"
              >
                {tag.label}
              </Tag>
            ))}
            <form className="TagForm" onSubmit={handleAddTag} onChange={handleFormChange}>
              <input
                className="TagForm__input"
                name="label"
                type="text"
                placeholder="Add a label"
                value={tagValue}
                onChange={(e) => setTagValue(e.target.value)}
              />
              <div className="TagForm__options">
                {severities.map((s) => (
                  <div key={s}>
                    <input type="radio" name="severity" id={s} value={s} />
                    <label htmlFor={s}>{s}</label>
                  </div>
                ))}
              </div>
              <button type="submit" disabled={!isAddTagEnabled}>
                Add
              </button>
              {tagValue && tags.length >= MAX_TAGS && <p>Max {MAX_TAGS} labels allowed</p>}
            </form>
          </div>
          <h4 className="Sidebar__title">Audio files</h4>
          {files.map(({ name }, i) => (
            <AudioFile key={name} isSelected={selectedFileId === i} onClick={() => handleSelectFile(i)}>
              {name}
            </AudioFile>
          ))}
          <FileInput acceptMimes="audio/wav,audio/mpeg,audio/m4a,audio/mp4" onFileSelected={handleFileAdd} />
        </div>
        <div className="Main" ref={mainRef}>
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
              showDetails={tags.length > 0}
            />
          ))}
          <div ref={segmentEndRef} className="Main__lastItem" />
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
