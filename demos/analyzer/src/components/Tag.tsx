import clsx from 'clsx';
import React from 'react';
import { ReactComponent as CloseIcon } from '../assets/close.svg';
import { TextLabel } from '../types';
import './Tag.css';

interface Props extends TextLabel {
  onRemove: React.MouseEventHandler;
}

export const Tag: React.FC<Props> = ({ label, severity = 'neutral', onRemove }) => {
  const classes = clsx('Tag', `Tag--${severity}`);
  return (
    <div className={classes}>
      <span>{label}</span>
      <CloseIcon width={16} height={16} onClick={onRemove} />
    </div>
  );
};
