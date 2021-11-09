import React, { ReactNode } from "react";
import "./MegaMenu.css";
//import CloseIcon from "@material-ui/icons/Close";
//import { IconButton } from "@material-ui/core";

const MegaMenu: React.FC<{
  title: string;
  onClose: () => void;
  children?: ReactNode;
}> = (props) => {

  return (
    <div className="megamenu">
      <div className="megamenucontent">
        <div className="MegaMenuClose">
          {/*
          <IconButton onClick={props.onClose}>
            <CloseIcon />
          </IconButton>
          */}
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
