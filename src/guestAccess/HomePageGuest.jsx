import React from "react";
import "flowbite";
import { Link } from "react-router-dom";
import FindBookGuest from "./FindBookGuest";
const HomePageGuest = () => {
  return (
    <div>
      <nav className="bg-gray-800 p-2">
        <div className="container mx-auto flex flex-wrap items-center justify-between">
          <a href="/" className="text-white text-lg font-semibold">
            Exit Library
          </a>

          <div className=" w-[100%]  md:w-auto" id="navbar-default">
            <ul className="flex flex-col md:flex-row md:space-x-8 mt-4 md:mt-0 md:text-sm md:font-medium">
              <li></li>
            </ul>
          </div>
        </div>
      </nav>
      <FindBookGuest />
    </div>
  );
};

export default HomePageGuest;
