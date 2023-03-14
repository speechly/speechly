import clsx from 'clsx';
import React from 'react';
import { ReactComponent as CloseIcon } from '../assets/close.svg';
import { Severity } from '../utils/types';
import './Tag.css';

interface Props {
  label: string;
  size?: 'normal' | 'small';
  children?: React.ReactNode;
  severity?: Severity;
  score?: number;
  onRemove?: React.MouseEventHandler;
}

export const Tag: React.FC<Props> = ({ label, score, severity, size, onRemove }) => {
  const classes = clsx('Tag', severity && `Tag--${severity}`, size && `Tag--${size}`);

  return (
    <div className={classes}>
      <div className="Tag__content">
        <span>{label}</span>
        {score && <small>: {(score * 100).toFixed(2)}%</small>}
      </div>
      {onRemove && (
        <CloseIcon
          width={18}
          height={18}
          onClick={onRemove}
        />
      )}
    </div>
  );
};
