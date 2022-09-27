import React from "react";
import classNames from "classnames";
import "./Label.css";

type LabelProps = {
  children: React.ReactNode;
  variant: "intent" | "entity" | "time";
  type?: string;
  intent?: string;
  isFinal?: boolean;
}

export const Label = ({ children, variant, type, intent, isFinal }: LabelProps) => {
  const classes = classNames({
    Label: true,
    "Label--danger": variant === "intent" && intent === "offensive" && isFinal,
    "Label--success": variant === "intent" && intent !== "offensive" && isFinal,
    "Label--info": variant === "entity",
    "Label--number": variant === "time"
  })

  return (
    <span className={classes}>
      {children}
      {type && <small>{type}</small>}
    </span>
  );
};
