import React, { useState } from "react";
import Plyr from "plyr-react";
import classNames from "classnames";
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


type CoverProps = {
  title: string;
  duration: string;
  thumbnail: string;
  isSelected: boolean;
  onClick: () => void;
};

const Cover = ({ title, duration, thumbnail, isSelected, onClick } : CoverProps) => {
  const classes = classNames({
    Item: true,
    "Item--selected": isSelected
  });

  return (
    <div className={classes} onClick={onClick}>
      <img className="Item__image" src={thumbnail} alt={title} />
      <div className="Item__info">
        <span className="Item__title">{title}</span>
        <span className="Item__duration">{duration}</span>
      </div>
    </div>
  )
}

type TranscriptProps = {
  timestamp: string;
  utterance: string;
  labels: [
    {
      text: string,
      variant: "success" | "danger" | "undefined";
    }
  ]
}

const Transcript = ({ timestamp, utterance, labels } : TranscriptProps) => {
  return (
    <div className="Transcript">
      <div className="Transcript__timestamp">{timestamp}</div>
      <div className="Transcript__utterance">{utterance}</div>
      {labels?.length > 0 && (
        <div className="Transcript__labels">
          {labels?.map((label, index) =>
            <div key={label.text + index} className={`Label Label--${label.variant}`}>offensive</div>
          )}
        </div>
      )}
    </div>
  )
}

const App= () => {
  const [currentItem, setCurrentItem] = useState(0);

  return (
    <div className="App">
      <div className="Header">
        <div className="Header__inner">
          {items.map((item, index) =>
            <Cover
              key={item.title + index}
              title={item.title}
              duration={item.duration}
              thumbnail={item.thumbnail}
              isSelected={index === currentItem}
              onClick={() => setCurrentItem(index)}
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
          <Transcript
            timestamp="0:00"
            utterance="The quick brown fox jumps over the lazy dog"
            labels={[{ text: "not offensive", variant: "success" }]}
          />
          <Transcript
            timestamp="0:00"
            utterance="The quick brown fox jumps over the lazy dog"
            labels={[{ text: "offensive", variant: "danger" }]}
          />
          <Transcript
            timestamp="0:00"
            utterance="The quick brown fox jumps over the lazy dog"
            labels={[{ text: "unknown", variant: "undefined" }]}
          />
        </div>
      </div>
    </div>
  )
}
export default App
