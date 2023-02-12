import React, { useEffect, useState } from 'react';
import { SpeechSegment, stateToString, useSpeechContext } from '@speechly/react-client';
import { SegmentItem } from './SegmentItem';
import './App.css';

function App() {
  const [isVadEnabled, setIsVadEnabled] = useState(false);
  const [speechSegments, setSpeechSegments] = useState<SpeechSegment[]>([]);
  const [tentative, setTentative] = useState('');
  const {
    client,
    clientState,
    listening,
    microphoneState,
    segment,
    attachMicrophone,
    start,
    stop,
  } = useSpeechContext();

  useEffect(() => {
    if (segment) {
      const text = segment.words.map((w) => w.value).join(' ');
      setTentative(text);
      if (segment.isFinal) {
        setTentative('');
        setSpeechSegments((current) => [...current, segment]);
      }
    }
  }, [segment]);

  const handleMicPress = async () => {
    if (listening) {
      await stop();
    } else {
      await attachMicrophone();
      await start();
    }
  };

  const handleVadPress = async () => {
    await attachMicrophone();
    await client?.adjustAudioProcessor({ vad: { enabled: !isVadEnabled } });
    setIsVadEnabled(!isVadEnabled);
  };

  const handleFileSelect = async (evt: React.ChangeEvent<HTMLInputElement>) => {
    const arrayBuffer = evt.target.files && (await evt.target.files[0].arrayBuffer());
    if (arrayBuffer) {
      await client?.uploadAudioData(arrayBuffer);
    }
  };

  const handleClearPress = () => {
    setSpeechSegments([]);
    setTentative('');
  };

  return (
    <div className="app">
      <div className="left">
        <h1 className="title">Speechly React Client Example</h1>
        <div className="status">
          <code>
            Client: <span>{stateToString(clientState)}</span>
          </code>
          <code> &middot; </code>
          <code>
            Microphone: <span>{microphoneState}</span>
          </code>
        </div>
        <div className="toolbar">
          <button onClick={handleVadPress}>{isVadEnabled ? 'Disable' : 'Enable'} VAD</button>
          <button onClick={handleMicPress}>{listening ? 'Stop' : 'Start'} microphone</button>
          <input onChange={handleFileSelect} type="file" accept=".mp3, .wav" />
          <button onClick={handleClearPress} disabled={!speechSegments.length && !tentative}>
            Clear
          </button>
        </div>
        <div className="transcript">
          {speechSegments?.map((segment) => (
            <SegmentItem key={`segment-${segment.contextId}-${segment.id}`} segment={segment} />
          ))}
        </div>
        <div className="tentative">{tentative}</div>
      </div>
      <div className="right">
        <pre>
          {speechSegments?.map((segment) => (
            <code key={`debug-${segment.contextId}-${segment.id}`}>
              {JSON.stringify(segment, undefined, 2)}
            </code>
          ))}
        </pre>
      </div>
    </div>
  );
}

export default App;
