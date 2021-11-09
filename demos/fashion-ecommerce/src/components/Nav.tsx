import React from "react";

const Nav: React.FC = (props) => {
  return <nav className="Nav">{props.children}</nav>;
};

export default Nav;