import React from 'react';
import clsx from 'clsx';
import { ReactComponent as AudioFileIcon } from '../assets/audio-file.svg';
import './AudioFile.css';

interface Props extends React.HTMLAttributes<HTMLButtonElement> {
  isSelected: boolean;
  children?: React.ReactNode;
}

export const AudioFile: React.FC<Props> = ({ children, isSelected, onClick }) => {
  return (
    <button type="button" className={clsx('AudioFile', isSelected && 'AudioFile--selected')} onClick={onClick}>
      <AudioFileIcon width={18} height={18} />
      <span>{children}</span>
    </button>
  );
};
