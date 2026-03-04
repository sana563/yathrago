import React from "react";

const Texts = ({ type, children, className = "" }) => {
  const baseClass = "";
  let typeClass = "";

  switch (type) {
    case "heading":
      typeClass = "text-5xl font-black uppercase tracking-tight text-black";
      break;
    case "subheading":
      typeClass = "text-2xl font-bold text-black mb-8";
      break;
    case "label":
      typeClass = "block text-base font-black mb-2 text-black uppercase tracking-wide";
      break;
    case "error":
      typeClass = "text-[#FF6B6B] text-sm font-bold";
      break;
    case "success":
      typeClass = "text-[#4ADE80] text-sm font-bold";
      break;
    case "info":
      typeClass = "text-base font-medium text-black mt-4";
      break;
    default:
      typeClass = "";
  }
  return <p className={`${baseClass} ${typeClass} ${className}`}>{children}</p>;
};

export default Texts;
