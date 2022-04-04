import React from "react";
import classNames from "classnames";
import "./Label.css";

type LabelProps = {
  children: React.ReactNode;
  variant: "intent" | "entity";
  type?: string;
  intent?: string;
}

export const Label = ({ children, variant, type, intent }: LabelProps) => {
  const classes = classNames({
    Label: true,
    "Label--danger": variant === "intent" && intent === "offensive",
    "Label--success": variant === "intent" && intent !== "offensive",
    "Label--info": variant === "entity"
  })

  return (
    <span className={classes}>
      {children}
      {type && <small>{type}</small>}
    </span>
  );
};
