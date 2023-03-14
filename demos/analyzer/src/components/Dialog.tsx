import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import clsx from 'clsx';
import { useTransition } from 'transition-hook';
import { ReactComponent as AddIcon } from '../assets/add.svg';
import { ReactComponent as CloseIcon } from '../assets/close.svg';
import './Dialog.css';

interface Props {
  title: string;
  children: React.ReactNode;
  close?: boolean;
}

export const Dialog: React.FC<Props> = ({ title, children, close }) => {
  const [isVisible, setVisible] = useState(false);
  const { stage, shouldMount } = useTransition(isVisible, 200);
  const classes = clsx('Dialog', stage === 'enter' && 'Dialog--visible');

  useEffect(() => {
    if (close) {
      setVisible(false);
    }
  }, [close]);

  return (
    <>
      <button
        className="Dialog__trigger"
        onClick={() => setVisible(!isVisible)}
      >
        <span>Add</span>
        <AddIcon
          width={16}
          height={16}
        />
      </button>
      {shouldMount &&
        createPortal(
          <div className={classes}>
            <div
              className="Dialog__bg"
              onClick={() => setVisible(false)}
            />
            <div className="Dialog__content">
              <CloseIcon
                className="Dialog__close"
                onClick={() => setVisible(false)}
              />
              <h2>{title}</h2>
              {children}
            </div>
          </div>,
          document.body
        )}
    </>
  );
};
