import React, { useCallback, useEffect, useState, useRef } from 'react';
import { BrowserMicrophone } from '@speechly/browser-client';
import { DecoderState, SpeechSegment, useSpeechContext } from '@speechly/react-client';
import clsx from 'clsx';
import formatDuration from 'format-duration';
import { Waveform } from './Waveform';
import { FileInput } from './FileInput';
import { ReactComponent as Spinner } from './assets/3-dots-fade-black-36.svg';
import { ReactComponent as Close } from './assets/close.svg';
import { ReactComponent as Mic } from './assets/mic.svg';
import { ReactComponent as AudioFile } from './assets/audio-file.svg';
import { ReactComponent as Empty } from './assets/empty.svg';
import sample1 from './assets/ndgt.wav';
import sample2 from './assets/after-life.mp3';
import './App.css';

export interface Classification {
  label: string;
  score: number;
}

interface ClassifiedSpeechSegment extends SpeechSegment {
  classifications?: Classification[];
}

interface FileOrUrl {
  name: string;
  file?: File;
  src?: string;
}

export const CHUNK_MS = 2000;
const AUDIO_ANALYSIS_CHUNK_SIZE = 16 * CHUNK_MS;
const TEXT_CLASSIFIER_URL = 'https://api.speechly.com/text-classifier-api/classify';
const AUDIO_CLASSIFIER_URL = 'https://api.speechly.com/text-classifier-api/classifyAudio';
const MAX_TAGS = 8;

const ourMic = new BrowserMicrophone();
const ac = new AudioContext({ sampleRate: 16000 });
const sp = ac.createScriptProcessor();
sp.connect(ac.destination);
let recorder: MediaRecorder;

function App() {
  const { appId, client, segment, clientState, listening, start, stop } = useSpeechContext();
  const [speechSegments, setSpeechSegments] = useState<ClassifiedSpeechSegment[]>([]);
  const [selectedFileId, setSelectedFileId] = useState<number | undefined>();
  const [tagValue, setTagValue] = useState('');
  const [tags, setTags] = useState(['profane', 'violent', 'about money', 'neutral']);
  const [files, setFiles] = useState<FileOrUrl[]>([
    { name: 'Neil deGrasse Tyson', src: sample1 },
    { name: 'After Life Cafe Scene', src: sample2 },
  ]);
  const [audioSource, setAudioSource] = useState<string>();
  const [detectionBuffer, setDetectionBuffer] = useState<Float32Array>(new Float32Array());
  const [micBuffer, setMicBuffer] = useState<Float32Array[]>([]);
  const [recData, setRecData] = useState<Blob>();
  const [audioEvents, setAudioEvents] = useState<Classification[][]>([]);
  const [peakData, setPeakData] = useState<Array<number>>([]);
  const [showEmptyState, setShowEmptyState] = useState(true);
  const [counter, setCounter] = useState(0);
  const intervalRef: { current: NodeJS.Timeout | null } = useRef(null);
  const segmentEndRef: { current: HTMLDivElement | null } = useRef(null);

  useEffect(() => {
    return () => stopCounter();
  }, []);

  const classifyBuffer = useCallback(
    async (buf: Float32Array): Promise<void> => {
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
        setAudioEvents((current) => [...current, [...classifications]]);
      } catch (err) {
        console.error(err);
      }
    },
    [appId]
  );

  useEffect(() => {
    if (micBuffer.length && clientState > 2) {
      const initialValue = 0;
      const newSum = micBuffer.map((b) => b.length).reduce((a, b) => a + b, initialValue);
      if (newSum >= AUDIO_ANALYSIS_CHUNK_SIZE) {
        const buf = new Float32Array(micBuffer.map((a) => Array.from(a)).flat());
        classifyBuffer(buf);
        const peaks = [] as Array<number>;
        for (let i = 0; i < buf.length; i += 128) {
          peaks.push(Math.max(...Array.from(buf.slice(i, i + 128).map((x) => Math.abs(x)))));
        }
        setPeakData((prevPeaks) => [...prevPeaks, ...peaks]);
        setMicBuffer([]);
      }
    }
  }, [micBuffer, clientState, classifyBuffer]);

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
      chunks.map((c) => classifyBuffer(c));
    }
  }, [detectionBuffer, classifyBuffer]);

  useEffect(() => {
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

    const classifySegment = async (ss: SpeechSegment, labels: string[]): Promise<void> => {
      const text = ss.words.map((word) => word.value).join(' ');
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
        const classifications = json['classifications'] as Classification[];
        const newSegment = { ...ss, classifications };
        updateOrAddSegment(newSegment);
      } catch (err) {
        console.error(err);
      }
    };

    if (segment) {
      setShowEmptyState(false);
      updateOrAddSegment(segment);
      segmentEndRef.current?.scrollIntoView();
      if (segment.isFinal) {
        if (tags.length) {
          classifySegment(segment, tags);
        } else {
          updateOrAddSegment(segment);
        }
      }
    }
    // eslint-disable-next-line
  }, [segment]);

  const handleRemoveTag = (tag: string) => {
    setTags((current) => current.filter((t) => t !== tag));
  };

  const handleAddTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tagValue || tags.length >= MAX_TAGS) return;
    if (tags.includes(tagValue)) return setTagValue('');
    setTags((current) => [...current, tagValue.trim()]);
    setTagValue('');
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
    setSpeechSegments([]);
    setAudioEvents([]);
    setPeakData([]);

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
      setSpeechSegments([]);
      setAudioEvents([]);
      setPeakData([]);
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

  return (
    <>
      <div className="App">
        <div className="Sidebar">
          <h4 className="Sidebar__title">Text classification labels</h4>
          <div className="Tag__container">
            {tags.map((tag, i) => (
              <div className="Tag" key={`${tag}-${i}`}>
                {tag}
                <Close width={16} height={16} onClick={() => handleRemoveTag(tag)} />
              </div>
            ))}
            <form className="Tag__form" onSubmit={handleAddTag}>
              <input
                type="text"
                placeholder="Add a label"
                value={tagValue}
                onChange={(e) => setTagValue(e.target.value)}
              />
              <button type="submit" disabled={!tagValue || tags.length >= MAX_TAGS}>
                Add
              </button>
              {tagValue && tags.length >= MAX_TAGS && <p>Max {MAX_TAGS} labels allowed</p>}
            </form>
          </div>
          <h4 className="Sidebar__title">Audio files</h4>
          {files.map(({ name }, i) => (
            <button
              type="button"
              className={clsx('Sidebar__item', selectedFileId === i && 'Sidebar__item--selected')}
              key={name}
              onClick={() => handleSelectFile(i)}
            >
              <AudioFile width={18} height={18} />
              <span>{name}</span>
            </button>
          ))}
          <FileInput acceptMimes={'audio/wav;audio/mpeg'} onFileSelected={handleFileAdd} />
        </div>
        <div className="Main">
          {!speechSegments.length && showEmptyState && (
            <div className="EmptyState">
              <Empty className="EmptyState__icon" />
              <h2 className="EmptyState__title">Speech and audio analysis</h2>
              <p className="EmptyState__description">
                Use one of our sample files, upload your own audio or use the microphone.
              </p>
            </div>
          )}
          {speechSegments?.map(({ contextId, id, words, classifications }) => (
            <div className="Segment" key={`${contextId}-${id}`}>
              <div className="Segment__timestamp">
                {!isNaN(words[0]?.endTimestamp) && formatDuration(words[0]?.endTimestamp)}
              </div>
              <div className="Segment__transcript">
                {words.map((word) => (
                  <span key={word.index}>{word.value} </span>
                ))}
              </div>
              {tags.length > 0 && (
                <div className="Segment__details">
                  <span>Text classification:</span>
                  {!classifications && <Spinner width={16} height={16} fill="#7d8fa1" />}
                  {classifications &&
                    classifications.map(({ label, score }, i) => (
                      <span key={`${label}-${i}`}>
                        {label}: {(score * 100).toFixed(2)}%
                      </span>
                    ))}
                </div>
              )}
            </div>
          ))}
          <div ref={segmentEndRef} />
        </div>
      </div>
      <div className="Player">
        <Waveform url={audioSource} peaks={peakData} data={audioEvents}>
          <button
            type="button"
            className={clsx('Microphone', listening && 'Microphone--active')}
            onPointerDown={handleStart}
            onPointerUp={handleStop}
          >
            <Mic />
          </button>
        </Waveform>
      </div>
    </>
  );
}

export default App;
