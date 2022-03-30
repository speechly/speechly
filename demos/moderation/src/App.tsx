import React, { useEffect, useRef, useState } from "react";
import { APITypes } from "plyr-react";
import { SpeechSegment, useSpeechContext } from "@speechly/react-client";
import classNames from "classnames";
import { useAppContext } from "./AppContext";
import { Segment } from "./Segment";
import { Cover } from "./Cover";
import { Spinner } from "./Spinner";
import { CustomPlyrInstance } from "./CustomPlyrInstance";
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
        sources: [{ src: "audio/kick.wav" }]
      },
      title: "Kick",
      duration: 0,
      thumbnail: "https://picsum.photos/seed/1/640/360"
    },
    {
      audioSrc: {
        type: "audio",
        sources: [{ src: "audio/nice.wav" }]
      },
      title: "Nice",
      duration: 0,
      thumbnail: "https://picsum.photos/seed/2/640/360"
    },
    {
      audioSrc: {
        type: "audio",
        sources: [{ src: "audio/kick.wav" }]
      },
      title: "Kick",
      duration: 0,
      thumbnail: "https://picsum.photos/seed/1/640/360"
    },
    {
      audioSrc: {
        type: "audio",
        sources: [{ src: "audio/nice.wav" }]
      },
      title: "Nice",
      duration: 0,
      thumbnail: "https://picsum.photos/seed/2/640/360"
    }
  ]

const playerOptions: Plyr.Options = {
  controls: ["play", "progress", "current-time", "mute", "volume"],
  invertTime: false,
  keyboard: { focused: false, global: false }
};

const App = () => {
  const { currentTime } = useAppContext();
  const { segment, client, initialize } = useSpeechContext();
  const [currentItem, setCurrentItem] = useState<number>();
  const [segments, setSegments] = useState<SpeechSegment[]>([]);
  const ref = useRef<APITypes>(null);

  useEffect(() => {
    if (client) initialize();
  }, [client])

  useEffect(() => {
    if (segment && segment.isFinal) {
      setSegments(oldSegments => [...oldSegments, segment])
    }
  }, [segment])

  const sendAudioToSpeechly = async (i: number) => {
    const response = await fetch(demoAudios[i].audioSrc.sources[0].src);
    const buffer =  await response.arrayBuffer();
    client?.sendAudioData(buffer);
  }

  const handleCoverClick = (i: number) => {
    if (i === currentItem) return
    setCurrentItem(i);
    setSegments([]);
    sendAudioToSpeechly(i);
  }

  const handleSegmentClick = (ms: number) => {
    const player = (ref?.current?.plyr as Plyr)
    player.currentTime = ms / 1000
  }

  const classes = classNames({
    "Player__inner": true,
    "Player__inner--disabled": currentItem === undefined
  })

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
        <div className={classes}>
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
              currentTime={currentTime}
              onClick={handleSegmentClick}
            />
          )}
        </div>
        <div className="Empty">
          {currentItem === undefined && segments.length === 0 && <p>Choose an audio source to get started</p>}
          {currentItem !== undefined && segments.length === 0 && <Spinner />}
        </div>
      </div>
    </div>
  )
}
export default App
