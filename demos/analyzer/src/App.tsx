import React, { useEffect, useRef, useState } from 'react';
import { BrowserMicrophone } from '@speechly/browser-client';
import { DecoderState, SpeechSegment, useSpeechContext } from '@speechly/react-client';
import clsx from 'clsx';
import AudioPlayer, { RHAP_UI } from 'react-h5-audio-player';
import { FileInput } from './FileInput';
import { ReactComponent as Spinner } from './assets/3-dots-fade-black-36.svg';
import { ReactComponent as Close } from './assets/close.svg';
import { ReactComponent as Mic } from './assets/mic.svg';
import { ReactComponent as AudioFile } from './assets/audio-file.svg';
import { ReactComponent as Empty } from './assets/empty.svg';
import sample1 from './assets/ndgt.wav';
import sample2 from './assets/after-life.mp3';
import 'react-h5-audio-player/lib/styles.css';
import './App.css';

interface Classification {
  label: string;
  score: number;
}

interface ClassifiedSpeechSegment extends SpeechSegment {
  classifications?: Classification[];
  audioEvents?: Classification[];
}

interface FileOrUrl {
  name: string;
  file?: File;
  src?: string;
}

const maxTags = 8;
const AUDIO_ANALYSIS_CHUNK_SIZE = 16000 * 3;

const ourMic = new BrowserMicrophone();
const ac = new AudioContext({ sampleRate: 16000 });
const sp = ac.createScriptProcessor();
sp.connect(ac.destination);

function App() {
  const { appId, client, segment, clientState, listening, start, stop } = useSpeechContext();
  const [speechSegments, setSpeechSegments] = useState<ClassifiedSpeechSegment[]>([]);
  const [selectedFileId, setSelectedFileId] = useState<number | undefined>();
  const [tagValue, setTagValue] = useState('');
  const [tags, setTags] = useState(['neutral', 'happy', 'sad', 'cheerful', 'disgusted']);
  const [files, setFiles] = useState<FileOrUrl[]>([
    { name: 'Neil deGrasse Tyson', src: sample1 },
    { name: 'After Life Cafe Scene', src: sample2 },
  ]);
  const [audioSource, setAudioSource] = useState('');
  const audioRef: { current: AudioPlayer | null } = useRef(null);
  const [detectionBuffer, setDetectionBuffer] = useState<Float32Array>(new Float32Array());
  const [micBuffer, setMicBuffer] = useState<Float32Array[]>([]);

  const clientStateRef = useRef(clientState);

  useEffect(() => {
    const classifyBuffer = async (buf: Float32Array): Promise<void> => {
      let formData = new FormData();
      let blob = new Blob([buf], { type: 'octet/stream' });
      formData.append('audio', blob);
      formData.append('appId', appId!);
      const audioDetResponse = await fetch('https://staging.speechly.com/text-classifier-api/classifyAudio', {
        method: 'POST',
        body: formData,
      });
      if (audioDetResponse.status !== 200) {
        throw new Error(`${audioDetResponse.status} ${audioDetResponse.statusText}`);
      }
      const json = await audioDetResponse.json();
      console.log(json);
      // audioEvents = json['classifications'] as Classification[];
    };

    if (clientState > 2) {
      const initialValue = 0;
      const newSum = micBuffer.map((b) => b.length).reduce((a, b) => a + b, initialValue);

      if (newSum >= AUDIO_ANALYSIS_CHUNK_SIZE) {
        const buf = new Float32Array(micBuffer.map((a) => Array.from(a)).flat());
        classifyBuffer(buf);
        setMicBuffer([]);
      }
    }
  }, [micBuffer]);

  useEffect(() => {
    clientStateRef.current = clientState;
    if (clientState <= 2) {
      setMicBuffer([]);
    }
  }, [clientState]);

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
        const response = await fetch('https://staging.speechly.com/text-classifier-api/classify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text, labels, appId }),
        });
        if (response.status !== 200) {
          throw new Error(`${response.status} ${response.statusText}`);
        }
        const json = await response.json();
        const SAMPLE_SIZE = 16;
        let audioEvents = [] as Classification[];
        const startSample = ss.words[0].startTimestamp * SAMPLE_SIZE;
        const endSample = ss.words[ss.words.length - 1].endTimestamp * SAMPLE_SIZE;
        if (endSample - startSample > 16000) {
          let samplesSlice = detectionBuffer.slice(startSample, endSample);
          let formData = new FormData();
          let blob = new Blob([samplesSlice], { type: 'octet/stream' });
          formData.append('audio', blob);
          formData.append('appId', appId!);
          const audioDetResponse = await fetch('https://staging.speechly.com/text-classifier-api/classifyAudio', {
            method: 'POST',
            body: formData,
          });
          if (audioDetResponse.status !== 200) {
            throw new Error(`${audioDetResponse.status} ${audioDetResponse.statusText}`);
          }
          const json2 = await audioDetResponse.json();
          audioEvents = json2['classifications'] as Classification[];
        }

        const classifications = json['classifications'] as Classification[];
        const newSegment = { ...ss, classifications, audioEvents };
        updateOrAddSegment(newSegment);
      } catch (error) {
        let message = 'Unknown error';
        if (error instanceof Error) message = error.message;
        console.error('Error:', message);
      }
    };

    if (segment) {
      updateOrAddSegment(segment);
      if (segment.isFinal) {
        classifySegment(segment, tags);
      }
    }
    // eslint-disable-next-line
  }, [segment]);

  const handleRemoveTag = (tag: string) => {
    setTags((current) => current.filter((t) => t !== tag));
  };

  const handleAddTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tagValue || tags.length >= maxTags) return;
    if (tags.includes(tagValue)) return setTagValue('');
    setTags((current) => [...current, tagValue.trim()]);
    setTagValue('');
  };

  const handleFileAdd = async (file: File) => {
    setFiles((current) => [...current, { name: file.name, file }]);
  };

  const updateAudioSource = (src: string) => {
    setAudioSource(src);
    if (audioRef.current) {
      audioRef.current.audio.current?.pause();
      audioRef.current.audio.current?.load();
      setTimeout(() => {
        audioRef.current?.audio.current?.play();
      }, 150);
    }
  };

  const updateDetectionBuffer = async (buffer: ArrayBuffer) => {
    const audioCtx = new AudioContext({ sampleRate: 16000 });
    const decodedBuffer = await audioCtx.decodeAudioData(buffer);
    const samples = decodedBuffer.getChannelData(0);
    setDetectionBuffer(samples);
  };

  const handleSelectFile = async (i: number) => {
    if (selectedFileId === i) return;
    if (clientState === DecoderState.Active) return;
    setSelectedFileId(i);
    setSpeechSegments([]);

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
      updateAudioSource(fileSrc);
      const buffer = await response.arrayBuffer();
      await client?.uploadAudioData(buffer);
      await updateDetectionBuffer(buffer);
      return;
    }

    const fileFile = files[i].file;
    if (fileFile) {
      const buffer = await fileFile.arrayBuffer();
      const blob = new Blob([buffer], { type: fileFile.type });
      const url = window.URL.createObjectURL(blob);
      updateAudioSource(url);
      await client?.uploadAudioData(buffer);
      await updateDetectionBuffer(buffer);
      return;
    }
  };

  const handleAudioProcess = (event: AudioProcessingEvent) => {
    if (clientStateRef.current > 2) {
      const samples = event.inputBuffer.getChannelData(0);
      setMicBuffer((current) => [...current, samples]);
    }
  };

  const handleStart = async () => {
    if (!ourMic.mediaStream) {
      await ourMic.initialize();
      if (ourMic.mediaStream) {
        await client?.attach(ourMic.mediaStream);
        const node = ac.createMediaStreamSource(ourMic.mediaStream);
        node.connect(sp);
        await ac.resume();
      }
      sp.addEventListener('audioprocess', handleAudioProcess);
    }
    await start();
  };

  const handleStop = async () => {
    await stop();
    await ac.suspend();
  };

  return (
    <div className="App">
      <div className="Sidebar">
        <h4 className="Sidebar__title">Classifications</h4>
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
            <button type="submit" disabled={!tagValue || tags.length >= maxTags}>
              Add
            </button>
            {tagValue && tags.length >= maxTags && <p>Max {maxTags} labels allowed</p>}
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
        <button
          type="button"
          className={clsx('Sidebar__mic', listening && 'Sidebar__mic--active')}
          onPointerDown={handleStart}
          onPointerUp={handleStop}
        >
          <Mic />
        </button>
        <div className={clsx('Player', !audioSource && 'Player--disabled')}>
          <AudioPlayer
            ref={audioRef}
            src={audioSource}
            layout="horizontal-reverse"
            showJumpControls={false}
            showDownloadProgress={false}
            customControlsSection={[RHAP_UI.MAIN_CONTROLS]}
            customProgressBarSection={[RHAP_UI.PROGRESS_BAR, RHAP_UI.VOLUME]}
            customAdditionalControls={[]}
            showFilledVolume
            hasDefaultKeyBindings={false}
          />
        </div>
      </div>
      <div className="Main">
        {!speechSegments.length && !audioSource && (
          <div className="EmptyState">
            <Empty className="EmptyState__icon" />
            <h2 className="EmptyState__title">Select an audio file to get started</h2>
            <p className="EmptyState__description">
              Analyze audio files to get classifications and acoustic information for each speech segment.
            </p>
          </div>
        )}
        {speechSegments?.map(({ contextId, id, words, classifications, audioEvents }, _i) => (
          <div className="Segment" key={`${contextId}-${id}`}>
            <div className="Segment__transcript">
              {words.map((word) => (
                <span key={word.index}>{word.value} </span>
              ))}
            </div>
            <div className="Segment__details">
              <span>Classifications:</span>
              {!classifications && <Spinner width={16} height={16} fill="#7d8fa1" />}
              {classifications && (
                <>
                  {classifications.map(({ label, score }, i) => (
                    <span key={`${label}-${i}`}>
                      {label}: {(score * 100).toFixed(2)}%
                    </span>
                  ))}
                </>
              )}
            </div>
            <div className="Segment__details">
              <span>Audio events:</span>
              {!audioEvents && <Spinner width={16} height={16} fill="#7d8fa1" />}
              {audioEvents && (
                <>
                  {audioEvents.map(({ label, score }, i) => (
                    <span key={`${label}-${i}`}>
                      {label}: {(score * 100).toFixed(2)}%
                    </span>
                  ))}
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
