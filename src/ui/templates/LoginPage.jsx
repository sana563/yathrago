// LoginTemplate.jsx
import React from "react";
import LoginForm from "../organisms/LoginForm";
import SignupForm from "../organisms/SignupForm";

const LoginTemplate = ({ type }) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'linear-gradient(135deg, #FFC700 0%, #FF6B6B 50%, #00D9FF 100%)' }}>
      {/* Decorative Elements */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-white border-4 border-black rotate-12 hidden md:block"></div>
      <div className="absolute bottom-20 right-20 w-16 h-16 bg-[#4ADE80] border-4 border-black -rotate-12 hidden md:block"></div>
      <div className="absolute top-1/3 right-10 w-12 h-12 rounded-full bg-[#00D9FF] border-4 border-black hidden md:block"></div>
      <div className="absolute bottom-1/4 left-20 w-14 h-14 bg-[#FF6B6B] border-4 border-black rotate-45 hidden md:block"></div>
      
      {/* Main Content */}
      <div className="relative z-10">
        {type === "login" ? <LoginForm /> : <SignupForm />}
      </div>
    </div>
  );
};

export default LoginTemplate;
