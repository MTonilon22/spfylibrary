import React from "react";
import "flowbite";
import { Link } from "react-router-dom";
const HeaderAdmin = () => {
  return (
    <nav className="bg-gray-800 p-2">
      <div className="container mx-auto flex flex-wrap items-center justify-center gap-10">
        <a href="/" className="text-white text-lg">
          Logout
        </a>

        <div className=" w-[100%]  md:w-auto" id="navbar-default">
          <ul className="flex flex-col md:flex-row md:space-x-8 mt-4 md:mt-0 md:text-sm md:font-medium">
            <li>
              <Link
                to="/findBook"
                className="block py-2 pr-4 pl-3 text-lg text-white rounded md:bg-transparent md:p-0"
              >
                Search a Book
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default HeaderAdmin;
