import React, { useEffect, useRef, useState } from "react";
import Plyr, { APITypes } from "plyr-react";
import { DecoderState, SpeechSegment, useSpeechContext } from "@speechly/react-client";
import classNames from "classnames";
import { Segment } from "./Segment";
import { Cover } from "./Cover";
import { Spinner } from "./Spinner";
import { blankAudio, demoAudios } from "./demoContent";
import "./App.css";
import "./plyr.css";

const playerOptions: Plyr.Options = {
  controls: ["play", "progress", "current-time", "mute", "volume"],
  invertTime: false,
  keyboard: { focused: false, global: false }
};

const App = () => {
  const { segment, client, clientState } = useSpeechContext();
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [currentItem, setCurrentItem] = useState<number>();
  const [sluResults, setSluResults] = useState<Map<string, Map<number, SpeechSegment>>>(new Map());
  const ref = useRef<APITypes>(null);

  const handleTimeUpdate = (event: any) => {
    const player = event?.detail?.plyr as Plyr
    if (player.source === null) return
    setCurrentTime(player?.currentTime * 1000)
  }

  useEffect(() => {
    window.addEventListener("timeupdate", handleTimeUpdate);
    return () => {
      window.removeEventListener("timeupdate", handleTimeUpdate)
    }
  })

  /**
   * Add contextIds to a map that maintains addition order.
   * This keeps them neatly in cronological ordered, which is needed when VAD is used
   */
  useEffect(() => {
    if (client) {
      client.onStart((contextId: string) => {
        setSluResults(oldSegments => oldSegments.set(contextId, new Map()));
      })
    }
  }, [client])

  useEffect(() => {
    const sendAudioToSpeechly = async (i: number) => {
      const response = await fetch(demoAudios[i].audioSrc.sources[0].src, {
        headers: {
          "Content-Type": "audio/mpeg;audio/wav;audio/m4a",
          "Accept": "audio/mpeg;audio/wav;audio/m4a"
        },
        cache: "no-store"
      });
      if (!response.ok) {
        console.error("Could't find file");
        setCurrentItem(undefined);
      };
      const buffer =  await response.arrayBuffer();
      client?.uploadAudioData(buffer);
    }
    if (client && currentItem !== undefined) {
      sendAudioToSpeechly(currentItem);
    }
  }, [currentItem, client])

  useEffect(() => {
    if (segment) {
      setSluResults(oldSegments => {
        oldSegments.get(segment.contextId)!.set(segment.id, segment)
        return oldSegments
      });
      if (segment.isFinal) {
        // Auto-start playback once we have one full segment received
        const player = (ref?.current?.plyr as Plyr);
        if (player.paused && sluResults.size === 1) player.play();
      }
    }
  // eslint-disable-next-line
  }, [segment]);

  const handleCoverClick = (i: number) => {
    // client?.close();
    if (i === currentItem) return
    setCurrentItem(i);
    setSluResults(new Map());
  }

  const handleSegmentClick = (ms: number) => {
    const player = (ref?.current?.plyr as Plyr);
    player.currentTime = ms / 1000
    player.play();
  }

  const playerClasses = classNames({
    "Player__inner": true,
    "Player__inner--disabled": currentItem === undefined
  });

  return (
    <div className="App">
      <div className="Header">
        <div className="Header__inner">
          {demoAudios.map((item, i) =>
            <Cover
              key={item.title + i}
              title={item.title}
              duration={item.duration}
              thumbnail={item.thumbnail}
              isSelected={i === currentItem}
              onClick={() => handleCoverClick(i)}
            />
          )}
        </div>
      </div>
      <div className="Player">
        <div className={playerClasses}>
          <Plyr
            ref={ref}
            source={currentItem === undefined ? blankAudio : demoAudios[currentItem].audioSrc}
            options={playerOptions}
          />
        </div>
      </div>
      <div className="Content">
        {sluResults.size > 0 && (
          <div className="Transcripts">
            {Array.from(sluResults.values()).map((segments) =>
              Array.from(segments.values()).map((segment) =>
                <Segment
                  key={`${segment.contextId}/${segment.id}`}
                  words={segment.words}
                  intent={segment.intent}
                  entities={segment.entities}
                  currentTime={currentTime}
                  onClick={handleSegmentClick}
                  isFinal={segment.isFinal}
                />
            ))}
          </div>
        )}
        <div className="Empty">
          {currentItem === undefined && sluResults.size === 0 && (
            <div>
              <svg xmlns="http://www.w3.org/2000/svg" width={32} height={32} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx={12} cy={12} r={10} /><polyline points="16 12 12 8 8 12" /><line x1={12} y1={16} x2={12} y2={8} /></svg>
              <h3>Choose an audio source to get started</h3>
              <p>Warning: this demo contains profanities and hate speech.</p>
            </div>
          )}
          {clientState > DecoderState.Connected && <Spinner />}
        </div>
      </div>
    </div>
  );
};

export default App
