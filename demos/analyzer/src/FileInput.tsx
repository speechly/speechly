import React, { useCallback, useRef, useState } from "react";
import clsx from "clsx";
import { ReactComponent as AudioFile } from "./assets/audio-file.svg";
import "./FileInput.css";

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

  const classes = clsx("FileInput", isActive && "FileInput--active");

  return (
    <div
      className={classes}
      onDrop={(e) => {
        onFileSelected(e.dataTransfer.files[0]);
        e.stopPropagation();
        e.preventDefault();
        setIsActive(false);
      }}
      onDragOver={(e) => {
        e.stopPropagation();
        e.preventDefault();
        setIsActive(true);
      }}
      onDragLeave={() => setIsActive(false)}
      onDragEnd={() => setIsActive(false)}
      onClick={() => fileInputRef.current?.click()}
    >
      <AudioFile width={24} height={24} />
      <span>Select your own audio file</span>
      <small>or drag and drop it here</small>
      <input
        ref={fileInputRef}
        accept={acceptMimes}
        disabled={disabled}
        onChange={onChange}
        style={{ display: "none" }}
        type="file"
      />
    </div>
  );
};
