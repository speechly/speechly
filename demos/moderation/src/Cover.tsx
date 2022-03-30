import React from "react";
import classNames from "classnames";
import formatDuration from "format-duration";
import "./Cover.css";

type CoverProps = {
  title: string;
  duration: number;
  thumbnail: string;
  isSelected: boolean;
  onClick: () => void;
};

export const Cover = ({ title, duration, thumbnail, isSelected, onClick }: CoverProps) => {
  const classes = classNames({
    Cover: true,
    "Cover--selected": isSelected
  });

  return (
    <div className={classes} onClick={onClick}>
      <img className="Cover__image" src={thumbnail} alt={title} />
      <div className="Cover__info">
        <span className="Cover__title">{title}</span>
        <span className="Cover__duration">{formatDuration(duration, { leading: true })}</span>
      </div>
    </div>
  );
};
