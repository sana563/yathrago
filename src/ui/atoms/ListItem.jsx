import React from "react";

const ListItem = ({ children, onClick }) => {
  return (
    <li
      onClick={onClick}
      className="cursor-pointer p-2 hover:bg-gray-100 rounded-md transition-colors"
    >
      {children}
    </li>
  );
};

export default ListItem;
