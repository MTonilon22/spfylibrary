import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Books from "../assets/book2.jpeg";
const LandingPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username === "spfyadmin" && password === "spfylibraryadmin") {
      navigate("/homePageAdmin");
    } else {
      setErrorMessage("Invalid username or password");
    }
  };

  return (
    <div
      className="flex items-center justify-center h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${Books})` }}
    >
      <div className="bg-white  p-8 rounded-lg shadow-lg w-full max-w-md h-[36%]  md:h-[52%]">
        <h1 className="text-xl font-bold mb-4 text-primary">
          Welcome to <span className="text-ternary">SPFY Library!</span>
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="relative">
            <input
              type="text"
              id="floating_outlined"
              value={username}
              onChange={handleUsernameChange}
              className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-primary bg-transparent rounded-lg border-1 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-primary peer"
              placeholder=" "
              required
            />
            <label
              for="floating_outlined"
              className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-primary px-2 peer-focus:px-2 peer-focus:text-primary peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
            >
              Username
            </label>
          </div>
          <div className="relative">
            <input
              type="text"
              id="floating_outlined1"
              value={password}
              onChange={handlePasswordChange}
              className="block my-6 px-2.5 pb-2.5 pt-4 w-full text-sm text-primary bg-transparent rounded-lg border-1 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-primary  peer"
              placeholder=" "
              required
            />
            <label
              for="floating_outlined1"
              className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-primary px-2 peer-focus:px-2 peer-focus:text-primary peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
            >
              Password
            </label>
          </div>

          {errorMessage && (
            <p className="text-red-500 text-sm mb-4">{errorMessage}</p>
          )}
          <button
            type="submit"
            className="w-full bg-primary font-medium text-ternary py-2 rounded hover:bg-ternary hover:text-primary  ease-in-out duration-300"
          >
            Continue
          </button>
          <p className="text-sm flex gap-2 flex-row mt-[8%] text-primary font-medium dark:text-gray-400">
            Access as Guest?
            <div className="font-bold hover:text-ternary hover:cursor-pointer text-primary">
              <Link to="/homePageGuest"> Click Here</Link>
            </div>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LandingPage;
