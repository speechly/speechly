import React, { useState } from 'react';
import { Classification } from '../utils/types';
import './Form.css';

interface Props {
  onSubmit: React.FormEventHandler<HTMLFormElement>;
  textEvents: Classification[];
}

export const WorkflowForm: React.FC<Props> = ({ textEvents, onSubmit }) => {
  const [count, setCount] = useState(0);
  const [threshold, setThreshold] = useState(0);
  const actions = ['warn', 'mute', 'ban', 'reward'];

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(e);
    setCount(0);
    setThreshold(0);
  };

  const isAddEnabled = !count || !threshold || !textEvents.length;

  return (
    <form
      className="Form"
      onSubmit={handleSubmit}
      noValidate
    >
      <div className="Form__input">
        <input
          name="count"
          type="number"
          min={0}
          max={10}
          step={1}
          placeholder="Count"
          value={count || ''}
          onChange={(e) => setCount(Number(e.target.value))}
        />
      </div>
      <div className="Form__select">
        <select
          name="event"
          style={{ textTransform: 'none' }}
          disabled={textEvents.length === 0}
        >
          {textEvents.map(({ label }) => (
            <option
              key={label}
              value={label}
            >
              {label}
            </option>
          ))}
        </select>
      </div>
      <div className="Form__input">
        <input
          name="threshold"
          type="number"
          min={0}
          max={100}
          step={5}
          placeholder="Threshold"
          value={threshold || ''}
          onChange={(e) => setThreshold(Number(e.target.value))}
        />
      </div>
      <div className="Form__select">
        <select name="action">
          {actions.map((action) => (
            <option
              key={action}
              value={action}
            >
              {action}
            </option>
          ))}
        </select>
      </div>
      <button
        type="submit"
        disabled={isAddEnabled}
      >
        Add
      </button>
    </form>
  );
};
