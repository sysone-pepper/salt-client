import React from 'react';
import PropTypes from 'prop-types';
import './Dropdown.css';
import { FaChevronDown } from 'react-icons/fa';

const Dropdown = ({
  title,
  menuTitles,
  menuDetails = [], // 기본값 설정
  menuIcons = [], // 기본값 설정
  menuFunctions,
  menuHasChild = [],
}) => {
  return (
    <div className="dropdown toolbar-button">
      <div className="dropdown-title">{title}</div>
      <ul className="dropdown-menu">
        {menuTitles.map((menuTitle, index) => (
          <li
            key={index}
            className="dropdown-menu-item"
            onClick={menuFunctions[index]}
          >
            <div className="menu-icon">{menuIcons[index]}</div>
            <div className="menu-content">
              <div className="menu-title">{menuTitle}</div>
              {menuDetails[index] && (
                <div className="menu-detail">{menuDetails[index]}</div>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

Dropdown.propTypes = {
  title: PropTypes.string.isRequired,
  menuTitles: PropTypes.arrayOf(PropTypes.string).isRequired,
  menuDetails: PropTypes.arrayOf(PropTypes.string),
  menuIcons: PropTypes.arrayOf(PropTypes.element),
  menuFunctions: PropTypes.arrayOf(PropTypes.func).isRequired,
};

export default Dropdown;
