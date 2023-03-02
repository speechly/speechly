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
  const severities: Severity[] = ['negative', 'neutral', 'positive'];

  const isAddEnabled = () => {
    const isDuplicate = tags.find((t) => t.label === label);
    return label && !isDuplicate && tags.length < MAX_TAGS;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(e);
    setLabel('');
  };

  return (
    <form
      className="EventForm Form"
      onSubmit={handleSubmit}
      noValidate
    >
      <div className="Form__input">
        <input
          name="label"
          type="text"
          placeholder="Event label"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
        />
      </div>
      <div className="Form__select">
        <select name="severity">
          {severities.map((severity) => (
            <option
              key={severity}
              value={severity}
            >
              {severity}
            </option>
          ))}
        </select>
      </div>
      <button
        type="submit"
        disabled={!isAddEnabled()}
      >
        Add
      </button>
      {label && tags.length >= MAX_TAGS && <p>Max {MAX_TAGS} labels allowed</p>}
    </form>
  );
};
