import React, { useState } from "react";
import Plyr from "plyr-react";
import { Segment } from "./Segment";
import { Cover } from "./Cover";
import 'plyr-react/dist/plyr.css';
import "./App.css";
import { SpeechSegment } from "@speechly/react-client";

const items: {
  audioSrc: Plyr.SourceInfo;
  title: string;
  duration: string;
  thumbnail: string;
}[] = [
  {
    audioSrc: {
      type: "audio",
      sources: [{ src: "audio/sample-3s.mp3" }]
    },
    title: "Title goes here",
    duration: "0:03",
    thumbnail: "https://picsum.photos/seed/1/640/360"
  },
  {
    audioSrc: {
      type: "audio",
      sources: [{ src: "audio/sample-15s.mp3" }]
    },
    title: "Title goes here",
    duration: "0:19",
    thumbnail: "https://picsum.photos/seed/2/640/360"
  },
  {
    audioSrc: {
      type: "audio",
      sources: [{ src: "audio/sample-9s.mp3" }]
    },
    title: "Title goes here",
    duration: "0:09",
    thumbnail: "https://picsum.photos/seed/3/640/360"
  },
  {
    audioSrc: {
      type: "audio",
      sources: [{ src: "audio/sample-12s.mp3" }]
    },
    title: "Title goes here",
    duration: "0:12",
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
    id: 0,
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
};


const App= () => {
  const [currentItem, setCurrentItem] = useState(0);

  return (
    <div className="App">
      <div className="Header">
        <div className="Header__inner">
          {items.map((item, i) =>
            <Cover
              key={item.title + i}
              title={item.title}
              duration={item.duration}
              thumbnail={item.thumbnail}
              isSelected={i === currentItem}
              onClick={() => setCurrentItem(i)}
            />
          )}
        </div>
      </div>
      <div className="Player">
        <div className="Player__inner">
          <Plyr source={items[currentItem].audioSrc} options={playerOptions} />
        </div>
      </div>
      <div className="Content">
        <div className="Transcripts">
          {segments.map(segment =>
            <Segment
              isFinal={segment.isFinal}
              words={segment.words}
              intent={segment.intent}
            />
          )}
        </div>
      </div>
    </div>
  )
}
export default App
