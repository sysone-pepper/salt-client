import React, { useContext } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { ThemeContext } from '../contexts/ThemeContext';
import './Header.css';
import ImageLogo from '../assets/images/salt-Logo-white-rm.png';
import ImageThemeDark from '../assets/images/moon.png';
import ImageThemeLight from '../assets/images/sun.png';

const Header = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useContext(ThemeContext);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const themeIcon = theme === 'dark' ? ImageThemeDark : ImageThemeLight;

  return (
    <header className="header">
      <div className="logo-container">
        <Link to="/">
          <img src={ImageLogo} alt="SALT Logo" className="logo-image" />
        </Link>
      </div>
      <div className="button-container">
        <img
          src={themeIcon}
          alt="Theme Icon"
          className="icon-image"
          onClick={toggleTheme}
        />
        {/* <button className="theme-toggle-button" onClick={toggleTheme}>
          {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
        </button> */}
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;
