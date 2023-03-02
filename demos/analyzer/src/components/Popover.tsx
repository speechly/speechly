import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { ReactComponent as AddIcon } from '../assets/add.svg';
import './Popover.css';

interface Props {
  title: string;
  children: React.ReactNode;
  close?: boolean;
}

export const Popover: React.FC<Props> = ({ title, children, close }) => {
  const [isVisible, setVisible] = useState(false);

  useEffect(() => {
    if (close) {
      setVisible(false);
    }
  }, [close]);

  return (
    <>
      <button
        className="Popover__trigger"
        onClick={() => setVisible(!isVisible)}
      >
        <span>Add</span>
        <AddIcon
          width={16}
          height={16}
        />
      </button>
      {isVisible &&
        createPortal(
          <div className="Popover">
            <div
              className="Popover__bg"
              onClick={() => setVisible(!isVisible)}
            />
            <div className="Popover__content">
              <h2>{title}</h2>
              {children}
            </div>
          </div>,
          document.body
        )}
    </>
  );
};
