"use client"; // Ensure this component is client-side rendered
import React from "react";
import { signOut } from "next-auth/react";

const Button = ({ children, onClick, name, type = "button" }) => {
  let baseClass = "px-6 py-3 font-bold text-lg cursor-pointer border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px]";
  let typeClass = "";

  switch (name) {
    case "login":
      typeClass = "bg-[#00D9FF] text-black hover:bg-[#00C4E6]";
      break;
    case "logout":
      typeClass = "bg-[#FF6B6B] text-white hover:bg-[#FF5252]";
      onClick = () => signOut({ callbackUrl: "/" });
      break;
    case "register":
      typeClass = "bg-[#4ADE80] text-black hover:bg-[#22C55E]";
      break;
    default:
      typeClass = "bg-[#FFC700] text-black hover:bg-[#FFB800]";
  }

  return (
    <button 
      type={type}
      className={`${baseClass} ${typeClass}`} 
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
