import React, { useEffect, useRef, useState } from "react";
import { APITypes } from "plyr-react";
import { SpeechSegment, useSpeechContext } from "@speechly/react-client";
import classNames from "classnames";
import { useAppContext } from "./AppContext";
import { Segment } from "./Segment";
import { Cover } from "./Cover";
import { Spinner } from "./Spinner";
import { CustomPlyrInstance } from "./CustomPlyrInstance";
import emptyIcon from "./arrow-up-circle.svg";
import "./App.css";

const blankAudio: Plyr.SourceInfo = {
  type: "audio",
  sources: [{ src: "audio/blank.mp3" }]
}

const demoAudios: {
  audioSrc: Plyr.SourceInfo;
  title: string;
  duration: number;
  thumbnail: string;
}[] = [
    {
      audioSrc: {
        type: "audio",
        sources: [{ src: "audio/koth.mp3" }]
      },
      title: "I'm Gonna Kick Your Ass",
      duration: 20000,
      thumbnail: "audio/koth.jpg"
    },
    {
      audioSrc: {
        type: "audio",
        sources: [{ src: "audio/tiktok.m4a" }]
      },
      title: "Angyr TikTok Mom",
      duration: 13000,
      thumbnail: "audio/tiktok.jpg"
    },
    {
      audioSrc: {
        type: "audio",
        sources: [{ src: "audio/stepbrothers.mp3" }]
      },
      title: "Catalina Wine Mixer",
      duration: 36000,
      thumbnail: "audio/stepbrothers.jpg"
    },
    {
      audioSrc: {
        type: "audio",
        sources: [{ src: "audio/pewdiepie.mp3" }]
      },
      title: "PewDiePie Uses the N-word",
      duration: 12000,
      thumbnail: "audio/pewdiepie.jpg"
    }
  ]

const playerOptions: Plyr.Options = {
  controls: ["play", "progress", "current-time", "mute", "volume"],
  invertTime: false,
  keyboard: { focused: false, global: false }
};

const App = () => {
  const { currentTime } = useAppContext();
  const { segment, client, clientState, initialize } = useSpeechContext();
  const [currentItem, setCurrentItem] = useState<number>();
  const [segments, setSegments] = useState<SpeechSegment[]>([]);
  const ref = useRef<APITypes>(null);

  useEffect(() => {
    if (client) initialize();
  }, [client, initialize]);

  useEffect(() => {
    if (segment && segment.isFinal) {
      setSegments(oldSegments => [...oldSegments, segment]);
      const player = (ref?.current?.plyr as Plyr);
      player.play();
    }
  }, [segment]);

  const sendAudioToSpeechly = async (i: number) => {
    const response = await fetch(demoAudios[i].audioSrc.sources[0].src);
    const buffer =  await response.arrayBuffer();
    client?.sendAudioData(buffer);
  }

  const handleCoverClick = (i: number) => {
    if (i === currentItem || clientState > 9) return
    setCurrentItem(i);
    setSegments([]);
    sendAudioToSpeechly(i);
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
          <CustomPlyrInstance
            ref={ref}
            source={currentItem === undefined ? blankAudio : demoAudios[currentItem].audioSrc}
            options={playerOptions}
          />
        </div>
      </div>
      <div className="Content">
        <div className="Transcripts">
          {segments.map((segment, i) =>
            <Segment
              key={segment.id + i}
              words={segment.words}
              intent={segment.intent}
              entities={segment.entities}
              currentTime={currentTime}
              onClick={handleSegmentClick}
            />
          )}
        </div>
        <div className="Empty">
          {currentItem === undefined && segments.length === 0 && (
            <div>
              <img src={emptyIcon} alt="icon" />
              <h3>Choose an audio source to get started</h3>
              <p>Trigger warning: this demo contains profanity, racial slurs and hate speech.</p>
            </div>
          )}
          {clientState > 9 && <Spinner />}
        </div>
      </div>
    </div>
  );
};

export default App
