import React from "react";
import { PushToTalkButton } from "@speechly/react-ui";
import "./Input.css";
import searchIconGray from "./assets/search-gray.svg";
import closeIconGray from "./assets/close-gray.svg";

export const Input: React.FC <{
  value: string,
  small?: boolean,
  clearFn: () => void,
  onChangeFn: (e: React.ChangeEvent<HTMLInputElement>) => void,
  onKeyPressFn: (e: React.KeyboardEvent<HTMLInputElement>) => void,
}> = ({ value, small, clearFn, onChangeFn, onKeyPressFn }) => {
  const classes = small ? "Input Input--small" : "Input"
  const buttonSize = small ? "32px" : "48px"

  return (
    <div className={classes}>
      <input
        className="Input__textfield"
        placeholder="Search the web"
        onChange={onChangeFn}
        value={value}
        onKeyPress={onKeyPressFn}
      />
      <img className="Input__icon" src={value ? closeIconGray : searchIconGray} alt="icon" onClick={() => clearFn()} />
      <div className="Input__button">
        <PushToTalkButton
          gradientStops={["#508CFF", "#009FFA", "#00E48F"]}
          size={buttonSize}
          showTime={2000}
          tapToTalkTime={0}
        />
      </div>
    </div>
  )
}
