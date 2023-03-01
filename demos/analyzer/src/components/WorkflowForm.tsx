import React, { useState } from 'react';
import { Classification } from '../utils/types';
import './Form.css';

interface Props {
  onSubmit: React.FormEventHandler<HTMLFormElement>;
  tags: Classification[];
}

export const WorkflowForm: React.FC<Props> = ({ tags, onSubmit }) => {
  const [count, setCount] = useState(0);
  const [threshold, setThreshold] = useState(0);
  const actions = ['warn', 'mute', 'ban', 'reward'];

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(e);
    setCount(0);
    setThreshold(0);
  };

  return (
    <form
      className="WorkflowForm Form"
      onSubmit={handleSubmit}
    >
      <div className="Form__input">
        <input
          name="count"
          type="number"
          min={0}
          max={10}
          step={1}
          placeholder="count"
          value={count || ''}
          onChange={(e) => setCount(Number(e.target.value))}
        />
      </div>
      <div className="Form__select">
        <select name="event">
          {tags.map(({ label }) => (
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
          placeholder="threshold"
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
        disabled={!count || !threshold}
      >
        Add
      </button>
    </form>
  );
};
