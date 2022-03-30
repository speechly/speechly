import React, { useEffect, useRef, useState } from "react";
import Plyr, { APITypes } from "plyr-react";
import { SpeechSegment, useSpeechContext } from "@speechly/react-client";
import classNames from "classnames";
import { Segment } from "./Segment";
import { Cover } from "./Cover";
import { Spinner } from "./Spinner";
import "./plyr.css";
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
        sources: [{ src: "audio/restaurant.wav" }]
      },
      title: "Title goes here",
      duration: 5000,
      thumbnail: "https://picsum.photos/seed/1/640/360"
    },
    {
      audioSrc: {
        type: "audio",
        sources: [{ src: "audio/sample-15s.mp3" }]
      },
      title: "Title goes here",
      duration: 19000,
      thumbnail: "https://picsum.photos/seed/2/640/360"
    },
    {
      audioSrc: {
        type: "audio",
        sources: [{ src: "audio/sample-9s.mp3" }]
      },
      title: "Title goes here",
      duration: 9000,
      thumbnail: "https://picsum.photos/seed/3/640/360"
    },
    {
      audioSrc: {
        type: "audio",
        sources: [{ src: "audio/sample-12s.mp3" }]
      },
      title: "Title goes here",
      duration: 12000,
      thumbnail: "https://picsum.photos/seed/4/640/360"
    },
  ]

const playerOptions: Plyr.Options = {
  controls: ['play', 'progress', 'current-time', 'mute', 'volume'],
  invertTime: false,
  keyboard: { focused: false, global: false }
};

const App = () => {
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

  const handleCoverClick = (i: number) => {
    setCurrentItem(i);
    setSegments([]);
    sendAudioToSpeechly(i);
  }

  const sendAudioToSpeechly = async (i: number) => {
    const response = await fetch(demoAudios[i].audioSrc.sources[0].src);
    const buffer =  await response.arrayBuffer();
    client?.sendAudioData(buffer);
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
          <Plyr source={demoAudios[currentItem].audioSrc} options={playerOptions} ref={ref} />
        <div className={classes}>
        </div>
      </div>
      <div className="Content">
        <div className="Transcripts">
          {segments.map((segment, i) =>
            <Segment
              key={segment.id + i}
              words={segment.words}
              intent={segment.intent}
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
