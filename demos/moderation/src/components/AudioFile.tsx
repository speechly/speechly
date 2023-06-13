import React from 'react';
import clsx from 'clsx';
import { ReactComponent as AudioFileIcon } from '../assets/audio-file.svg';
import './AudioFile.css';

interface Props extends React.HTMLAttributes<HTMLButtonElement> {
  isSelected: boolean;
  children?: React.ReactNode;
}

export const AudioFile: React.FC<Props> = ({ children, isSelected, onClick }) => {
  const classes = clsx('AudioFile', isSelected && 'AudioFile--selected');

  return (
    <button type="button" className={classes} onClick={onClick}>
      <AudioFileIcon width={18} height={18} />
      <span>{children}</span>
    </button>
  );
};
