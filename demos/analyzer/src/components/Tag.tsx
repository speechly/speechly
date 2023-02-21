import clsx from 'clsx';
import React from 'react';
import { ReactComponent as CloseIcon } from '../assets/close.svg';
import { Severity } from '../utils/types';
import './Tag.css';

interface Props {
  onRemove?: React.MouseEventHandler;
  size?: 'normal' | 'small';
  children?: React.ReactNode;
  severity: Severity;
}

export const Tag: React.FC<Props> = ({ children, severity, size, onRemove }) => {
  const classes = clsx('Tag', severity && `Tag--${severity}`, size && `Tag--${size}`);

  return (
    <div className={classes}>
      <span>{children}</span>
      {onRemove && <CloseIcon width={16} height={16} onClick={onRemove} />}
    </div>
  );
};
