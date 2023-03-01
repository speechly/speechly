import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import clsx from 'clsx';
import './Popover.css';

interface Props {
  label?: string;
  children: React.ReactNode;
}

const Menu: React.FC<Props> = ({ children }) => {
  return createPortal(<div className="Popover__menu">{children}</div>, document.body);
};

export const Popover: React.FC<Props> = ({ label, children }) => {
  const [isActive, setActive] = useState(false);
  const menuClasses = clsx('Popover__menu', isActive && 'Popover__menu--active');
  const bgClasses = clsx('Popover__container', isActive && 'Popover__container--active');

  return (
    <div className="Popover">
      <button
        className="Popover__trigger"
        onClick={() => setActive(!isActive)}
      >
        {label}
      </button>
      {createPortal(
        <div className={bgClasses}>
          <div
            className="Popover__bg"
            onClick={() => setActive(!isActive)}
          />
          <div className={menuClasses}>
            <h2>{label}</h2>
            {children}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};
