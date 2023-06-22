import React from 'react';
import './Tooltip.css';

interface Props {
  title?: string;
  children?: React.ReactNode;
}

export const Tooltip: React.FC<Props> = ({ children, title }) => {
  return (
    <div className="Tooltip">
      {children}
      {title && <div className="Tooltip__item">{title}</div>}
    </div>
  );
};
