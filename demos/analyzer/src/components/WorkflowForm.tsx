import React, { useRef, useState } from 'react';
import { Classification } from '../utils/types';
import './Form.css';
import './WorkflowForm.css';

interface Props {
  onSubmit: React.FormEventHandler<HTMLFormElement>;
  tags: Classification[];
}

export const WorkflowForm: React.FC<Props> = ({ tags, onSubmit }) => {
  const [count, setCount] = useState(0);
  const actions = ['warn', 'mute', 'ban', 'reward'];
  const inputRef: { current: HTMLInputElement | null } = useRef(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(e);
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
        disabled={!count}
      >
        Add
      </button>
      {inputRef.current?.value}
    </form>
  );
};
