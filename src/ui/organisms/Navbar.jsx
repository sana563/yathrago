import React from "react";
import Logo from "../molecules/Logo";
import NavButton from "../molecules/NavButton";
import SearchFriend from "../molecules/SearchFriend";
import SearchBar from "../molecules/SearchBar";

const Navbar = () => {
  return (
    <div>
      <div className="flex justify-between items-center bg-gray-800 p-4 max-[340px]:justify-center">
        <div className="max-sm:hidden">
          <Logo />
        </div>
        <div className="">
          <SearchBar />
        </div>
        <div className="max-[340px]:hidden">
          <NavButton />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
