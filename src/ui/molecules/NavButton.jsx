import React from "react";
import Icons from "../atoms/Icons";
import Button from "../atoms/Button";

const NavButton = () => {
  return (
    <div className="flex items-center space-x-4">
      <Icons name="profile" />
      <Button name="logout">Logout</Button>
    </div>
  );
};

export default NavButton;
