import React from 'react';
import './ToggleSwitch.css';

interface Props {
  checked: boolean;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
}

export const ToggleSwitch: React.FC<Props> = ({ checked, onChange }) => {
  return (
    <label className="ToggleSwitch">
      <input className="ToggleSwitch__input" type="checkbox" checked={checked} onChange={onChange} />
      <span className="ToggleSwitch__slider"></span>
    </label>
  );
};
