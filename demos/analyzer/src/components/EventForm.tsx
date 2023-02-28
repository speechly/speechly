import React, { useState } from 'react';
import { Classification, Severity } from '../utils/types';
import { MAX_TAGS } from '../utils/variables';
import './Form.css';

interface Props {
  onSubmit: React.FormEventHandler<HTMLFormElement>;
  tags: Classification[];
}

export const EventForm: React.FC<Props> = ({ tags, onSubmit }) => {
  const [label, setLabel] = useState('');
  const [isEnabled, setEnabled] = useState(false);
  const severities: Severity[] = ['positive', 'neutral', 'negative'];

  const handleTagLabel = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setLabel(value);
    const isDuplicate = tags.find((t) => t.label === value);
    setEnabled(!!value && !isDuplicate);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(e);
    setLabel('');
    setEnabled(false);
  };

  return (
    <form className="Form" onSubmit={handleSubmit}>
      <div className="Form__input" style={{ width: '100%' }}>
        <input name="label" type="text" placeholder="Add a label" value={label} onChange={handleTagLabel} />
      </div>
      <div className="Form__select">
        <select name="severity">
          {severities.map((severity) => (
            <option key={severity} value={severity}>
              {severity}
            </option>
          ))}
        </select>
      </div>
      <div className="Form__input">
        <input name="threshold" type="number" defaultValue={75} min={0} max={100} step={5} />
      </div>
      <button type="submit" disabled={!isEnabled}>
        Add
      </button>
      {label && tags.length >= MAX_TAGS && <p>Max {MAX_TAGS} labels allowed</p>}
    </form>
  );
};
