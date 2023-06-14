import React from 'react';
import { ReactComponent as MicIcon } from '../assets/mic.svg';
import clsx from 'clsx';
import './MicButton.css';

interface Props {
  isListening: boolean;
  onPointerDown: React.PointerEventHandler<HTMLButtonElement>;
  onPointerUp: React.PointerEventHandler<HTMLButtonElement>;
}

export const MicButton: React.FC<Props> = ({ isListening, onPointerDown, onPointerUp }) => {
  return (
    <div className="MicButton">
      <button
        type="button"
        className={clsx('MicButton__button', isListening && 'MicButton__button--active')}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
      >
        <MicIcon width={28} height={28} />
      </button>
      <span className={clsx('MicButton__description', isListening && 'MicButton__description--active')}>
        {isListening ? 'Listening…' : 'Press to talk'}
      </span>
    </div>
  );
};
