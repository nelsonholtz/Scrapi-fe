import React from "react";
import { Link } from "react-router-dom";
import "../styles/NavBar.css";
import scrapiLogo from "../assets/paperclip-a.svg";
import scrapiLogoFull from "../assets/scrapi-logo-full.png";
import LogOut from "./LoginComponents/LogOut";

const Navbar = () => {
  return (
    <nav className="navbar">
      <h1 className="logo">
        <Link to="/create">
          <img src={scrapiLogoFull} alt="a" className="logo-icon" />
        </Link>
      </h1>
      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/create">Create Board</Link>
        <Link to="/profile">Profile</Link>
        <Link to="/explore">Explore Page</Link>
      </div>
    </nav>
  );
};

export default Navbar;
