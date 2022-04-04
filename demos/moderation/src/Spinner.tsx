import React from "react";
import "./Spinner.css";

export const Spinner = () => {
  return (
    <div className="Spinner">
      <svg viewBox="0 0 50 50">
        <circle cx="25" cy="25" r="20" fill="none" strokeWidth="5"></circle>
      </svg>
      <p>Processing audio…</p>
    </div>
  )
}