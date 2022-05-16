import React, { useCallback, useEffect, useState } from "react";
import { PushToTalkButton } from "@speechly/react-ui";
import "./Input.css";
import searchIconGray from "./assets/search.svg";
import closeIconGray from "./assets/close.svg";
import checkIcon from "./assets/check.svg";

export const Input: React.FC <{
  value: string,
  small?: boolean,
  clearFn: () => void,
  onChangeFn: (e: React.ChangeEvent<HTMLInputElement>) => void,
  onKeyPressFn: (e: React.KeyboardEvent<HTMLInputElement>) => void,
}> = ({ value, small, clearFn, onChangeFn, onKeyPressFn }) => {
  const [isActive, setIsActive] = useState(false);
  const [isHandled, setIsHandled] = useState(false);

  const onMessageReceived = useCallback(
    (event: MessageEvent) => {
      if (event.data?.type === "holdstart") setIsActive(true);
      if (event.data?.type === "holdend") setIsActive(false);
      if (event.data?.type === "speechhandled") setIsHandled(true);
    }, []);

  useEffect(() => {
    window.addEventListener("message", onMessageReceived);
    return () =>
      window.removeEventListener("message", onMessageReceived);
  }, [onMessageReceived]);

  useEffect(() => {
    if (!isHandled) return
    const timer = setTimeout(() => setIsHandled(false), 1500);
    return () => clearTimeout(timer);
  }, [isHandled])

  const containerClasses = small ? "Input Input--small" : "Input"
  const inputClasses = isActive ? "Input__textfield Input__textfield--active" : "Input__textfield"
  const buttonSize = small ? "36px" : "48px"

  return (
    <div className={containerClasses}>
      <input
        className={inputClasses}
        placeholder="Search the web using voice"
        onChange={onChangeFn}
        value={value}
        onKeyPress={onKeyPressFn}
      />
      <img className="Input__icon" src={value ? closeIconGray : searchIconGray} alt="icon" onClick={() => clearFn()} />
      {isHandled && <img className="Input__handled" src={checkIcon} alt="icon" />}
      <div className="Input__button">
        <PushToTalkButton
          gradientStops={["#508CFF", "#009FFA", "#00E48F"]}
          size={buttonSize}
          showTime={2000}
          intro=""
          powerOn="auto"
        />
      </div>
    </div>
  )
}
