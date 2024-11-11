import React, { useState } from 'react';
import ServerIcon from '../../../assets/images/Server-icon2.png';
import NetworkIcon from '../../../assets/images/Network-icon2.png';
import L3SwitchIcon from '../../../assets/images/L3Switch-icon.png';
import L4SwitchIcon from '../../../assets/images/L4Switch-icon.png';
import L7SwitchIcon from '../../../assets/images/L7Switch-icon.png';
import FirewallIcon from '../../../assets/images/Firewall-icon2.png';
import UPSIcon from '../../../assets/images/UPS-icon2.png';
import './ExistDeviceCard.css';

const deviceIcons = [
  ServerIcon,
  NetworkIcon,
  undefined,
  L3SwitchIcon,
  L4SwitchIcon,
  L7SwitchIcon,
  FirewallIcon,
  UPSIcon,
];

export const ExistDeviceCard = ({ deviceData, isSelected, onSelect }) => {
  return (
    <div
      className={`exist-device-card-container ${isSelected ? 'selected' : ''}`}
      onClick={onSelect}
    >
      <div className="device-image-container">
        <img
          src={deviceIcons[Number(deviceData.deviceType)]}
          alt="Device Icon"
        />
      </div>
      <div className="device-info-container">
        <div className="device-alias">{deviceData.deviceAlias}</div>
        <div className="device-name">{deviceData.deviceName}</div>
        <div className="device-public-ip">{deviceData.publicIp}</div>
      </div>
    </div>
  );
};
