import React from "react";
import "./Header.css";
import ImageLogo from "../assets/images/salt-Logo-white-rm.png";

const Header = () => {
  return (
    <header className="header">
      <div className="logo-container">
        <img src={ImageLogo} alt="SALT Logo" className="logo-image"></img>
      </div>
      <button className="logout-button">Logout</button>
    </header>
  );
};

export default Header;
