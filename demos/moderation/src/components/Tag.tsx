import React from 'react';
import clsx from 'clsx';
import './Tag.css';

interface Props {
  label: string;
  isFlagged?: boolean;
  score?: number;
}

export const Tag: React.FC<Props> = ({ label, score, isFlagged }) => {
  const classes = clsx('Tag', isFlagged && `Tag--negative`);

  return (
    <div className={classes}>
      <div className="Tag__content">
        <span>{label}</span>
        {score && <small>: {score}</small>}
      </div>
    </div>
  );
};
