import React, { ReactNode } from "react";
import "./MegaMenu.css";
import RoundButton from "./RoundButton";

const MegaMenu: React.FC<{
  title: string;
  onClose: () => void;
  children?: ReactNode;
}> = (props) => {

  return (
    <div className="megamenu">
      <div className="megamenucontent">
        <div className="MegaMenuClose">
          <RoundButton onClick={props.onClose}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" style={{width: "0.60rem", height: "0.60rem"}} overflow="visible" stroke="currentColor" strokeWidth="10" strokeLinecap="round">
              <line x1="0" y1="0" x2="50" y2="50" />
              <line x1="50" y1="0" x2="0" y2="50" />
            </svg>
          </RoundButton>
        </div>
        <ul className="megamenulist">
          {props.children}
        </ul>
      </div>
    </div>
  );
};

export const MegaMenuItem: React.FC<{ key: string; onChange: () => void }> = (
  props
) => {
  return (
    <li>
      <div className="tag" onClick={props.onChange}>
        {props.children}
      </div>
    </li>
  );
};

export default MegaMenu;
