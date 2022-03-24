import Plyr from "plyr-react";
import React from "react";
import 'plyr-react/dist/plyr.css';
import "./App.css";

const audioSrc: Plyr.SourceInfo = {
  type: 'audio',
  sources: [
    {
      src: 'https://storage.googleapis.com/media-session/elephants-dream/the-wires.mp3',
    },
  ],
};

const playerOptions: Plyr.Options = {
  controls: ['play', 'progress', 'current-time', 'mute', 'volume'],
};

const App: React.FC = (): JSX.Element => {
  return (
    <div className="App">
      <div className="Header">
        <div className="Header__inner">
          <div className="Item Item--selected">
            <img className="Item__image" src="https://i.ytimg.com/vi/pyTHNeRAFwo/mqdefault.jpg" alt="description" />
            <div className="Item__info">
              <span className="Item__title">Title</span>
              <span className="Item__duration">0:00</span>
            </div>
          </div>
          <div className="Item">
            <img className="Item__image" src="https://i.ytimg.com/vi/pyTHNeRAFwo/mqdefault.jpg" alt="description" />
            <div className="Item__info">
              <span className="Item__title">Title</span>
              <span className="Item__duration">0:00</span>
            </div>
          </div>
          <div className="Item">
            <img className="Item__image" src="https://i.ytimg.com/vi/pyTHNeRAFwo/mqdefault.jpg" alt="description" />
            <div className="Item__info">
              <span className="Item__title">Title</span>
              <span className="Item__duration">0:00</span>
            </div>
          </div>
          <div className="Item">
            <img className="Item__image" src="https://i.ytimg.com/vi/pyTHNeRAFwo/mqdefault.jpg" alt="description" />
            <div className="Item__info">
              <span className="Item__title">Title</span>
              <span className="Item__duration">0:00</span>
            </div>
          </div>
        </div>
      </div>
      <div className="Player">
        <div className="Player__inner">
          <Plyr source={audioSrc} options={playerOptions} />
        </div>
      </div>
      <div className="Content">
        <div className="Transcripts">
          <div className="Transcript">
            <div className="Transcript__timestamp">00:00</div>
            <div className="Transcript__utterance">
              The quick brown fox jumps over the lazy dog
            </div>
            <div className="Transcript__labels">
              <div className="Label Label--red">offensive</div>
            </div>
          </div>
          <div className="Transcript">
            <div className="Transcript__timestamp">00:00</div>
            <div className="Transcript__utterance">
              The quick brown fox jumps over the lazy dog. The quick brown fox jumps over the lazy dog. The quick brown fox jumps over the lazy dog. The quick brown fox jumps over the lazy dog.
            </div>
            <div className="Transcript__labels">
              <div className="Label Label--green">not offensive</div>
            </div>
          </div>
          <div className="Transcript">
            <div className="Transcript__timestamp">00:00</div>
            <div className="Transcript__utterance">
              The quick brown fox jumps over the lazy dog. The quick brown fox jumps over the lazy dog. The quick brown fox jumps over the lazy dog. The quick brown fox jumps over the lazy dog.
            </div>
            <div className="Transcript__labels">
              <div className="Label Label--gray">undefined</div>
            </div>
          </div>
          <div className="Transcript">
            <div className="Transcript__timestamp">00:00</div>
            <div className="Transcript__utterance">
              The quick brown fox jumps over the lazy dog
            </div>
            <div className="Transcript__labels">
              <div className="Label Label--red">offensive</div>
            </div>
          </div>
          <div className="Transcript">
            <div className="Transcript__timestamp">00:00</div>
            <div className="Transcript__utterance">
              The quick brown fox jumps over the lazy dog. The quick brown fox jumps over the lazy dog. The quick brown fox jumps over the lazy dog. The quick brown fox jumps over the lazy dog.
            </div>
            <div className="Transcript__labels">
              <div className="Label Label--green">not offensive</div>
            </div>
          </div>
          <div className="Transcript">
            <div className="Transcript__timestamp">00:00</div>
            <div className="Transcript__utterance">
              The quick brown fox jumps over the lazy dog. The quick brown fox jumps over the lazy dog. The quick brown fox jumps over the lazy dog. The quick brown fox jumps over the lazy dog.
            </div>
            <div className="Transcript__labels">
              <div className="Label Label--gray">undefined</div>
            </div>
          </div>
          <div className="Transcript">
            <div className="Transcript__timestamp">00:00</div>
            <div className="Transcript__utterance">
              The quick brown fox jumps over the lazy dog
            </div>
            <div className="Transcript__labels">
              <div className="Label Label--red">offensive</div>
            </div>
          </div>
          <div className="Transcript">
            <div className="Transcript__timestamp">00:00</div>
            <div className="Transcript__utterance">
              The quick brown fox jumps over the lazy dog. The quick brown fox jumps over the lazy dog. The quick brown fox jumps over the lazy dog. The quick brown fox jumps over the lazy dog.
            </div>
            <div className="Transcript__labels">
              <div className="Label Label--green">not offensive</div>
            </div>
          </div>
          <div className="Transcript">
            <div className="Transcript__timestamp">00:00</div>
            <div className="Transcript__utterance">
              The quick brown fox jumps over the lazy dog. The quick brown fox jumps over the lazy dog. The quick brown fox jumps over the lazy dog. The quick brown fox jumps over the lazy dog.
            </div>
            <div className="Transcript__labels">
              <div className="Label Label--gray">undefined</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default App
