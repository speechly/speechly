import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import clsx from 'clsx';
import { ReactComponent as AddIcon } from '../assets/add.svg';
import './Popover.css';

interface Props {
  title: string;
  children: React.ReactNode;
  close?: boolean;
}

export const Popover: React.FC<Props> = ({ title, children, close }) => {
  const [isActive, setActive] = useState(close);
  const popoverClasses = clsx('Popover', isActive && 'Popover--active');
  const contentClasses = clsx('Popover__content', isActive && 'Popover__content--active');

  useEffect(() => {
    if (close) {
      setActive(false);
    }
  }, [close]);

  return (
    <>
      <button
        className="Popover__trigger"
        onClick={() => setActive(!isActive)}
      >
        <span>Add</span>
        <AddIcon
          width={16}
          height={16}
        />
      </button>
      {createPortal(
        <div className={popoverClasses}>
          <div
            className="Popover__bg"
            onClick={() => setActive(!isActive)}
          />
          <div className={contentClasses}>
            <h2>{title}</h2>
            {children}
          </div>
        </div>,
        document.body
      )}
    </>
  );
};
