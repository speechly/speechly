import React, { useCallback, useRef, useState } from 'react';
import clsx from 'clsx';
import { ReactComponent as Upload } from '../assets/upload.svg';
import './FileInput.css';

interface Props {
  acceptMimes: string;
  onFileSelected: (file: File) => void;
  disabled?: boolean;
}

export const FileInput: React.FC<Props> = ({ acceptMimes, disabled = false, onFileSelected }) => {
  const [isActive, setIsActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onChange = useCallback(() => {
    if (fileInputRef && fileInputRef.current && fileInputRef.current.files && fileInputRef.current.files.length > 0) {
      onFileSelected(fileInputRef.current.files[0]);
    }
  }, [onFileSelected]);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    const file = e.dataTransfer.files[0];
    if (acceptMimes.includes(file.type)) {
      onFileSelected(file);
    }
    e.stopPropagation();
    e.preventDefault();
    setIsActive(false);
  };

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.stopPropagation();
    e.preventDefault();
    if (disabled) return;
    setIsActive(true);
  };

  return (
    <div
      className={clsx('FileInput', isActive && 'FileInput--active')}
      onDrop={handleDrop}
      onDragOver={handleDrag}
      onDragLeave={() => setIsActive(false)}
      onDragEnd={() => setIsActive(false)}
      onClick={() => fileInputRef.current?.click()}
    >
      <Upload className="FileInput__icon" width={28} height={28} />
      <span className="FileInput__title">{isActive ? 'Drop here to upload' : 'Use your own audio file'}</span>
      <span className="FileInput__description">English audio only, max 5 min</span>
      <input
        ref={fileInputRef}
        accept={acceptMimes}
        disabled={disabled}
        onChange={onChange}
        style={{ display: 'none' }}
        type="file"
      />
    </div>
  );
};
