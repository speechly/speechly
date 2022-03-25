import React, { useRef, useState } from "react";
import Plyr, { APITypes } from "plyr-react";
import { SpeechSegment } from "@speechly/react-client";
import { Segment } from "./Segment";
import { Cover } from "./Cover";
import 'plyr-react/dist/plyr.css';
import "./App.css";

const mockCovers: {
  audioSrc: Plyr.SourceInfo;
  title: string;
  duration: number;
  thumbnail: string;
}[] = [
    {
      audioSrc: {
        type: "audio",
        sources: [{ src: "audio/sample-3s.mp3" }]
      },
      title: "Title goes here",
      duration: 3000,
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

const mockSegment: SpeechSegment[] = [
  {
    id: 0,
    contextId: "345a08bf-c9ae-4979-953a-dc01e29b05f8",
    isFinal: true,
    words: [
      {
        value: "IN",
        index: 2,
        startTimestamp: 720,
        endTimestamp: 960,
        isFinal: true
      },
      {
        value: "THE",
        index: 3,
        startTimestamp: 960,
        endTimestamp: 1080,
        isFinal: true
      },
      {
        value: "MORNINGS",
        index: 4,
        startTimestamp: 1080,
        endTimestamp: 1500,
        isFinal: true
      },
      {
        value: "I",
        index: 5,
        startTimestamp: 1500,
        endTimestamp: 1680,
        isFinal: true
      },
      {
        value: "LIKE",
        index: 6,
        startTimestamp: 1680,
        endTimestamp: 1920,
        isFinal: true
      },
      {
        value: "TO",
        index: 7,
        startTimestamp: 1920,
        endTimestamp: 2040,
        isFinal: true
      },
      {
        value: "DRINK",
        index: 8,
        startTimestamp: 2040,
        endTimestamp: 2280,
        isFinal: true
      },
      {
        value: "COFFEE",
        index: 9,
        startTimestamp: 2280,
        endTimestamp: 2760,
        isFinal: true
      }
    ],
    entities: [],
    intent: {
      intent: "not_offensive",
      isFinal: true
    }
  },
  {
    id: 1,
    contextId: "345a08bf-c9ae-4979-953a-dc01e29b05f8",
    isFinal: true,
    words: [
      {
        value: "WHAT",
        index: 2,
        startTimestamp: 2720,
        endTimestamp: 2960,
        isFinal: true
      },
      {
        value: "THE",
        index: 3,
        startTimestamp: 2960,
        endTimestamp: 2080,
        isFinal: true
      },
      {
        value: "FUCK",
        index: 4,
        startTimestamp: 2080,
        endTimestamp: 2500,
        isFinal: true
      },
      {
        value: "TONY",
        index: 5,
        startTimestamp: 2500,
        endTimestamp: 2680,
        isFinal: true
      },
      {
        value: "YOU",
        index: 6,
        startTimestamp: 2680,
        endTimestamp: 2920,
        isFinal: true
      },
      {
        value: "COCKSUCKING",
        index: 7,
        startTimestamp: 2920,
        endTimestamp: 3040,
        isFinal: true
      },
      {
        value: "MUTHERFUCKING",
        index: 8,
        startTimestamp: 3040,
        endTimestamp: 3280,
        isFinal: true
      },
      {
        value: "SNITCH",
        index: 9,
        startTimestamp: 3280,
        endTimestamp: 3760,
        isFinal: true
      }
    ],
    entities: [],
    intent: {
      intent: "offensive",
      isFinal: true
    }
  }
]

const playerOptions: Plyr.Options = {
  controls: ['play', 'progress', 'current-time', 'mute', 'volume'],
  invertTime: true
};

const App = () => {
  const [currentItem, setCurrentItem] = useState(0);
  const [segments, setSegments] = useState<SpeechSegment[]>(mockSegment);
  const currentAudioSrc = mockCovers[currentItem].audioSrc;
  const ref = useRef<APITypes>(null);

  const handleCoverClick = (i: number) => {
    // TODO
    // send currentAudioSrc.sources[0].src to speechly
    // listen for changes and populate the transcript
    setCurrentItem(i)
  }

  const handleSegmentClick = (ms: number) => {
    const player = (ref?.current?.plyr as Plyr)
    player.currentTime = ms / 1000
  }

  return (
    <div className="App">
      <div className="Header">
        <div className="Header__inner">
          {mockCovers.map((item, i) =>
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
        <div className="Player__inner">
          <Plyr source={currentAudioSrc} options={playerOptions} ref={ref} />
        </div>
      </div>
      <div className="Content">
        <div className="Transcripts">
          {segments.map(segment =>
            <Segment
              key={segment.id}
              words={segment.words}
              intent={segment.intent}
              onClick={handleSegmentClick}
            />
          )}
        </div>
      </div>
    </div>
  )
}
export default App
