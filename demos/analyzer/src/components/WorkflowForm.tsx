import React, { useRef } from 'react';
import { Classification } from '../utils/types';
import './Form.css';

interface Props {
  onSubmit: React.FormEventHandler<HTMLFormElement>;
  tags: Classification[];
}

export const WorkflowForm: React.FC<Props> = ({ tags, onSubmit }) => {
  const actions = ['warn', 'mute', 'ban', 'reward'];
  const inputRef: { current: HTMLInputElement | null } = useRef(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(e);
  };

  return (
    <form className="Form" onSubmit={handleSubmit}>
      <div className="Form__input">
        <input ref={inputRef} name="count" type="number" min={0} max={10} step={1} />
      </div>
      <div className="Form__select">
        <select name="event">
          {tags.map((tag) => (
            <option key={tag.label} value={tag.label}>
              {tag.label}
            </option>
          ))}
        </select>
      </div>
      <div className="Form__select">
        <select name="action">
          {actions.map((action) => (
            <option key={action} value={action}>
              {action}
            </option>
          ))}
        </select>
      </div>
      <button type="submit">Add</button>
    </form>
  );
};
