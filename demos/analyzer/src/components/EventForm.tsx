import React, { useState } from 'react';
import { Classification, Severity } from '../utils/types';
import { MAX_TAGS } from '../utils/variables';
import './Form.css';
import './EventForm.css';

interface Props {
  onSubmit: React.FormEventHandler<HTMLFormElement>;
  tags: Classification[];
}

export const EventForm: React.FC<Props> = ({ tags, onSubmit }) => {
  const [label, setLabel] = useState('');
  const [threshold, setThreshold] = useState(0);
  const severities: Severity[] = ['negative', 'neutral', 'positive'];

  const isAddEnabled = () => {
    const isDuplicate = tags.find((t) => t.label === label);
    return label && threshold && !isDuplicate;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(e);
    setLabel('');
    setThreshold(0);
  };

  return (
    <form className="EventForm Form" onSubmit={handleSubmit}>
      <div className="Form__input">
        <input
          name="label"
          type="text"
          placeholder="event label"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
        />
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
        <input
          name="threshold"
          type="number"
          min={0}
          max={100}
          step={5}
          placeholder="threshold"
          value={threshold || ''}
          onChange={(e) => setThreshold(Number(e.target.value))}
        />
      </div>
      <button type="submit" disabled={!isAddEnabled()}>
        Add
      </button>
      {label && tags.length >= MAX_TAGS && <p>Max {MAX_TAGS} labels allowed</p>}
    </form>
  );
};
