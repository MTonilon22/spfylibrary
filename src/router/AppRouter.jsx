import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "../index.css";
// import { HomePageAdmin } from "../adminAccess/HomePageAdmin";
// import { EditBookAdmin } from "../adminAccess/EditBookAdmin";
// import { AddBookAdmin } from "../adminAccess/AddBookAdmin";
import LandingPage from "../components/LandingPage";
import FindBook from "../components/FindBook";
import HomePageAdmin from "../adminAccess/HomePageAdmin";
import EditBookAdmin from "../adminAccess/EditBookAdmin";
import AddBookAdmin from "../adminAccess/AddBookAdmin";
import HomePageGuest from "../guestAccess/HomePageGuest";
import FindBookGuest from "../guestAccess/FindBookGuest";

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/findBook" element={<FindBook />} />
        {/* For Guest Users */}
        <Route path="/findBookGuest" element={<FindBookGuest />} />
        <Route path="/homePageGuest" element={<HomePageGuest />} />
        {/* For Guest Admin Users */}
        <Route path="/homePageAdmin" element={<HomePageAdmin />} />
        <Route path="/addBookAdmin" element={<AddBookAdmin />} />
        <Route path="/editBookAdmin" element={<EditBookAdmin />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
