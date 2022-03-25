import React, { useState } from "react";
import Plyr from "plyr-react";
import { Segment } from "./Segment";
import { Cover } from "./Cover";
import 'plyr-react/dist/plyr.css';
import "./App.css";

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
          <Segment
            timestamp="0:00"
            transcript={"THE QUICK BROWN FOX JUMPS OVER THE LAZY DOG THE QUICK BROWN FOX JUMPS OVER THE LAZY DOG THE QUICK BROWN FOX JUMPS OVER THE LAZY DOG THE QUICK BROWN FOX JUMPS OVER THE LAZY DOG THE QUICK BROWN FOX JUMPS OVER THE LAZY DOG THE QUICK BROWN FOX JUMPS OVER THE LAZY DOG".split(" ")}
            labels={[{ text: "not offensive", variant: "success" }]}
          />
          <Segment
            timestamp="0:00"
            transcript={"THE QUICK BROWN FOX JUMPS OVER THE LAZY DOG".split(" ")}
            labels={[{ text: "offensive", variant: "danger" }]}
          />
          <Segment
            timestamp="0:00"
            transcript={"THE QUICK BROWN FOX JUMPS OVER THE LAZY DOG".split(" ")}
            labels={[{ text: "unknown", variant: "undefined" }]}
          />
        </div>
      </div>
    </div>
  )
}
export default App
