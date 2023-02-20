import React from 'react';
import { ReactComponent as CloseIcon } from '../assets/close.svg';
import './Tag.css';

interface Props {
  label: string;
  onClick: React.MouseEventHandler;
}

export const Tag: React.FC<Props> = ({ label, onClick }) => {
  return (
    <div className="Tag">
      {label}
      <CloseIcon width={16} height={16} onClick={onClick} />
    </div>
  );
};
