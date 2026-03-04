import React from "react";
import { FaSearch } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import { IoMdSettings } from "react-icons/io";
import { IoIosArrowBack } from "react-icons/io";

const Icons = ({ name }) => {
  const iconSize = 20;
  switch (name) {
    case "search":
      return (
        <FaSearch
          size={iconSize}
          className="absolute right-12 top-1/2 transform -translate-y-1/2 text-gray-600"
        />
      );
    case "profile":
      return <CgProfile size={iconSize} />;
    case "message":
      return <div>Message</div>;
    case "settings":
      return <IoMdSettings size={iconSize} />;
    case "back":
      return <IoIosArrowBack size={iconSize} />;
    default:
      return <div>Icons</div>;
  }
};

export default Icons;
