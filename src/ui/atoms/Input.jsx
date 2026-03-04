import React from "react";

const Input = ({ type, placeholder, value, onChange, onKeyDown, name, required }) => {
  const baseClass = "text-black font-medium";
  let typeClass = "";

  switch (type) {
    case "text":
    case "email":
    case "password":
      // Neo-brutalist style: bold border, offset shadow, flat colors
      typeClass = "bg-white px-4 py-3 w-full border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] focus:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:translate-x-[-2px] focus:translate-y-[-2px]";
      break;
    case "search":
      typeClass = "bg-white px-4 pr-10 py-2 w-full border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]";
      break;
    case "message":
      typeClass = "flex-grow p-3 border-3 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]";
      break;
    default:
      typeClass = "";
  }

  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      onKeyDown={onKeyDown}
      name={name}
      required={required}
      className={`${baseClass} ${typeClass}`}
    />
  );
};

export default Input;
