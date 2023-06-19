import React from 'react';
import clsx from 'clsx';
import { ReactComponent as MicIcon } from '../assets/mic.svg';
import './MicButton.css';

interface Props {
  isListening: boolean;
  isVadEnabled: boolean;
  onStartStop: React.MouseEventHandler<HTMLButtonElement>;
  onVadCheck: React.ChangeEventHandler<HTMLInputElement>;
}

export const MicButton: React.FC<Props> = ({ isListening, isVadEnabled, onStartStop, onVadCheck }) => {
  return (
    <div className="MicButton">
      <button
        type="button"
        className={clsx('MicButton__button', isListening && 'MicButton__button--active')}
        onClick={onStartStop}
      >
        <MicIcon width={28} height={28} />
      </button>
      <span className={clsx('MicButton__title', isListening && 'MicButton__title--active')}>
        {isListening ? 'Listening…' : isVadEnabled ? 'Speak to activate' : 'Press to talk'}
      </span>
      <span className="MicButton__description">
        <input type="checkbox" id="vad" name="vad" checked={isVadEnabled} onChange={onVadCheck} />
        <label htmlFor="vad">Enable VAD</label>
      </span>
    </div>
  );
};
