import { useEffect, useRef, useState } from 'react';
import { DecoderState, useSpeechContext } from '@speechly/react-client';
import useStateRef from 'react-usestateref';
import clsx from 'clsx';
import { AudioFile } from './components/AudioFile';
import { FileInput } from './components/FileInput';
import { MicButton } from './components/MicButton';
import { SegmentItem } from './components/SegmentItem';
import { TabItem, Tabs } from './components/Tabs';
import { Waveform } from './components/Waveform';
import { AbuseLabelingResponse, FileOrUrl, LabeledSpeechSegment } from './utils/types';
import { ABUSE_LABELING_URL } from './utils/variables';
import { ReactComponent as EmptyIllustration } from './assets/empty.svg';
import sample1 from './assets/warzone.mp3';
import sample2 from './assets/seaofthieves.mp3';
import './App.css';

function App() {
  const { appId, client, segment, clientState, listening, microphone, attachMicrophone, start, stop } =
    useSpeechContext();
  const [activeSegmentIndex, setActiveSegmentIndex, activeSegmentIndexRef] = useStateRef(-1);
  const [speechSegments, setSpeechSegments, speechSegmentsRef] = useStateRef<LabeledSpeechSegment[]>([]);
  const [selectedFileId, setSelectedFileId] = useState<number | undefined>();
  const [files, setFiles] = useState<FileOrUrl[]>([
    { name: 'Warzone 2.0: Get Away From Me', src: sample1 },
    { name: 'Sea of Thieves: English Meet French', src: sample2 },
  ]);
  const [audioSource, setAudioSource] = useState<string>();
  const [recData, setRecData] = useState<Blob>();
  const [showEmptyState, setShowEmptyState] = useState(true);
  const [counter, setCounter] = useState(0);
  const [currentTime, setCurrentTime] = useState<number | undefined>(undefined);
  const intervalRef: { current: NodeJS.Timeout | null } = useRef(null);
  const segmentEndRef: { current: HTMLDivElement | null } = useRef(null);
  const mainRef: { current: HTMLDivElement | null } = useRef(null);
  const recorder: { current: MediaRecorder | undefined } = useRef(undefined);

  useEffect(() => {
    return () => stopCounter();
  }, []);

  useEffect(() => {
    if (microphone?.mediaStream) {
      recorder.current = new MediaRecorder(microphone.mediaStream);
      recorder.current.start();
      recorder.current.ondataavailable = (e) => setRecData(e.data);
    }
  }, [microphone?.mediaStream]);

  useEffect(() => {
    if (recData) {
      const src = URL.createObjectURL(recData);
      setAudioSource(src);
      const timeStr = new Date().toISOString().split('T').join(' at ').substring(0, 22);
      const name = `Recording ${timeStr}`;
      setFiles((current) => [...current, { name, src }]);
      setRecData(undefined);
      setSelectedFileId(files.length);
    }
  }, [recData, files.length]);

  useEffect(() => {
    const scrollToSegmentsEnd = () => {
      if (activeSegmentIndexRef.current !== -1) return;
      segmentEndRef.current?.scrollIntoView({ behavior: 'auto', block: 'end' });
    };

    const updateOrAddSegment = (ss: LabeledSpeechSegment) => {
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

    const labelSegment = async (ss: LabeledSpeechSegment) => {
      const text = ss.words.map((word) => word.value).join(' ');
      try {
        const response = await fetch(ABUSE_LABELING_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ texts: [text], appId }),
        });
        if (response.status !== 200) {
          throw new Error(`${response.status} ${response.statusText}`);
        }
        const { results } = (await response.json()) as AbuseLabelingResponse;
        if (!results.length) {
          throw new Error('no abuse labeling results found');
        }
        const sortedLabels = results[0].labels.sort((a, b) => b.score - a.score);
        const newSegment: LabeledSpeechSegment = {
          ...ss,
          abuseLabels: sortedLabels,
          isFlagged: results[0].flagged,
        };
        console.log(newSegment);
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
        labelSegment(segment);
      }
    }
    // eslint-disable-next-line
  }, [segment]);

  const isTimeInRange = (time: number, segment: LabeledSpeechSegment) => {
    if (!segment.isFinal) return false;
    return (
      Math.round(time) > segment.words[0].endTimestamp &&
      Math.round(time) < segment.words[segment.words.length - 1].endTimestamp
    );
  };

  useEffect(() => {
    if (!currentTime) return;
    const idx = speechSegmentsRef.current.findIndex((segment) => isTimeInRange(currentTime, segment));
    if (idx === -1 || idx === activeSegmentIndexRef.current) return;
    setActiveSegmentIndex(idx);
  }, [currentTime, speechSegmentsRef, activeSegmentIndexRef, setActiveSegmentIndex]);

  useEffect(() => {
    if (activeSegmentIndex === -1) return;
    const el = mainRef.current?.children.item(activeSegmentIndex);
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth' });
  }, [activeSegmentIndex]);

  const handleFileAdd = async (file: File) => {
    setFiles((current) => [...current, { name: file.name, file }]);
  };

  const handleSelectFile = async (i: number) => {
    if (selectedFileId === i) return;
    if (clientState === DecoderState.Active) return;

    setSelectedFileId(i);
    setAudioSource(undefined);
    setCurrentTime(undefined);
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
      setAudioSource(fileSrc);
      const buffer = await response.arrayBuffer();
      await client?.uploadAudioData(buffer);
      return;
    }

    const fileFile = files[i].file;
    if (fileFile) {
      const buffer = await fileFile.arrayBuffer();
      const blob = new Blob([buffer], { type: fileFile.type });
      const url = URL.createObjectURL(blob);
      setAudioSource(url);
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

    if (speechSegments.length) {
      setSelectedFileId(undefined);
      setAudioSource(undefined);
      setCurrentTime(undefined);
      setSpeechSegments([]);
    }

    if (listening) {
      stopCounter();
      await stop();
      recorder.current?.stop();
    } else {
      await attachMicrophone();
      await start();
      startCounter();
    }
  };

  const handleStop = async () => {
    if (listening && counter > 100) {
      stopCounter();
      await stop();
      recorder.current?.stop();
    }
  };

  const highlightSegment = (seekTime: number) => {
    const idx = speechSegmentsRef.current.findIndex((segment) => isTimeInRange(seekTime, segment));
    if (idx === -1) return;
    const el = mainRef.current?.children.item(idx);
    if (!el) return;
    el.classList.toggle('Segment--active');
    setTimeout(() => el.classList.toggle('Segment--active'), 1000);
  };

  return (
    <div className="App">
      <div className="Sidebar">
        <div className="Sidebar__section">
          <div className="Sidebar__content">
            <Tabs>
              <TabItem title="Audio file">
                <FileInput acceptMimes="audio/wav,audio/mpeg,audio/mp4" onFileSelected={handleFileAdd} />
              </TabItem>
              <TabItem title="Microphone">
                <MicButton isListening={listening} onPointerDown={handleStart} onPointerUp={handleStop} />
              </TabItem>
            </Tabs>
          </div>
        </div>
        <div className="Sidebar__section">
          <h4 className="Sidebar__title">Recordings</h4>
          <div>
            {files.map(({ name }, i) => (
              <AudioFile key={name} isSelected={selectedFileId === i} onClick={() => handleSelectFile(i)}>
                {name}
              </AudioFile>
            ))}
          </div>
        </div>
      </div>
      <div className="Main">
        {!speechSegments.length && showEmptyState && (
          <div className="EmptyState">
            <EmptyIllustration className="EmptyState__icon" width={180} />
            <h2 className="EmptyState__title">Voice chat moderation</h2>
            <p className="EmptyState__description">
              Use one of the sample recordings, upload your own audio or use the microphone.
            </p>
          </div>
        )}
        {speechSegments.length > 0 && (
          <div className="Main__inner" ref={mainRef}>
            {speechSegments.map((segment) => (
              <SegmentItem key={`${segment.contextId}-${segment.id}`} currentTime={currentTime} segment={segment} />
            ))}
            <div ref={segmentEndRef} className="Segment__end" />
          </div>
        )}
        <div className={clsx('Player', (audioSource || !showEmptyState) && 'Player--visible')}>
          <Waveform url={audioSource} onSeek={highlightSegment} onUpdate={setCurrentTime} />
        </div>
      </div>
    </div>
  );
}

export default App;
