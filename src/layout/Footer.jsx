import React from "react";
import "./Footer.css";
import ImageLogo from "../assets/images/salt-Logo-color.png";

const Footer = () => {
  return (
    <footer className="ft-container">
      <div className="ft-content">
        <div className="ft-left">
          <div className="ft-logo">
            <img
              src={ImageLogo}
              alt="SALT Logo"
              className="ft-logo-image"
            ></img>
          </div>
          <div className="ft-contact-info">
            <div className="ft-contact-item">
              <p className="ft-contact-label">Email</p>
              <p className="ft-contact-value">salt@salt.co.kr</p>
            </div>
            <div className="ft-contact-item">
              <p className="ft-contact-label">Phone Number</p>
              <p className="ft-contact-value">010-2054-6861</p>
            </div>
          </div>
        </div>
        <div className="ft-right">
          <h2 className="ft-cta-title">모니터링을 통한 안전한 네트워크 관리</h2>
          <div className="ft-cta-buttons">
            <button className="ft-button ft-button-primary">문의하기</button>
            <button className="ft-button ft-button-secondary">계정 신청</button>
          </div>
        </div>
      </div>
      <div className="ft-bottom">
        <p className="ft-platforms-title">About Team</p>
        <div className="ft-platforms-list">
          <a
            href="https://github.com/sysone-pepper"
            target="_blank"
            rel="noopener noreferrer"
            className="ft-platform-item"
          >
            Github
          </a>
          <a
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            className="ft-platform-item"
          >
            Team Page
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
