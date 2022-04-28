import React, { ReactNode } from "react";
import "./MegaMenu.css";

const MegaMenu: React.FC<{
  title: string;
  children?: ReactNode;
}> = (props) => {

  return (
    <div className="Megamenu">
      <div className="Megamenu__content">
        <ul className="Megamenu__list">
          {props.children}
        </ul>
      </div>
    </div>
  );
};

export const MegaMenuItem: React.FC<{ key: string; onChange: () => void; children?: React.ReactNode }> = (
  props
) => {
  return (
    <li>
      <div className="Megamenu__item" onClick={props.onChange}>
        {props.children}
      </div>
    </li>
  );
};

export default MegaMenu;
