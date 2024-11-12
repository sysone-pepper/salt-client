import React, { useContext } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ThemeContext } from '../contexts/ThemeContext';
import './Header.css';
import ImageLogoDark from '../assets/images/salt-Logo-white-rm.png';
import ImageLogoLight from '../assets/images/salt-Logo-color.png';

const Header = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useContext(ThemeContext);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const logoImage = theme === 'dark' ? ImageLogoDark : ImageLogoLight;

  return (
    <header className="header">
      <div className="logo-container">
        <img src={logoImage} alt="SALT Logo" className="logo-image" />
      </div>
      <div className="button-container">
        <button className="theme-toggle-button" onClick={toggleTheme}>
          {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
        </button>
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;

// import React from 'react';
// import { useAuth } from '../contexts/AuthContext';
// import { useNavigate } from 'react-router-dom';
// import './Header.css';
// import ImageLogo from '../assets/images/salt-Logo-white-rm.png';

// const Header = () => {
//   const { logout } = useAuth();
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     logout();
//     navigate('/');
//   };

//   return (
//     <header className="header">
//       <div className="logo-container">
//         <img src={ImageLogo} alt="SALT Logo" className="logo-image"></img>
//       </div>
//       <button className="logout-button" onClick={handleLogout}>
//         Logout
//       </button>
//     </header>
//   );
// };

// export default Header;
