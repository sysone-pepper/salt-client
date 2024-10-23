import React, { useContext, useState } from 'react';
import './CreateObjectForm.css';
import ServerIcon from '../../../assets/images/Server-icon2.png';
import NetworkIcon from '../../../assets/images/Network-icon2.png';
import L3SwitchIcon from '../../../assets/images/L3Switch-icon.png';
import L4SwitchIcon from '../../../assets/images/L4Switch-icon.png';
import L7SwitchIcon from '../../../assets/images/L7Switch-icon.png';
import FirewallIcon from '../../../assets/images/Firewall-icon2.png';
import UPSIcon from '../../../assets/images/UPS-icon2.png';
import { NetworkContext } from '../../../contexts/NetworkContext';

import { IconInput } from './IconInput.jsx';
const deviceCategories = [
  'Server',
  'Network',
  'L3Switch',
  'L4Switch',
  'L7Switch',
  'Firewall',
  'UPS',
];

const deviceIcons = {
  Server: ServerIcon,
  Network: NetworkIcon,
  L3Switch: L3SwitchIcon,
  L4Switch: L4SwitchIcon,
  L7Switch: L7SwitchIcon,
  Firewall: FirewallIcon,
  UPS: UPSIcon,
};

const deviceManagementTypes = [
  'SNMP',
  'NetFlow',
  'ICMP',
  'Syslog',
  'SSH',
  'Telnet',
  'TFTP',
  'WMI',
];

export const CreateObjectForm = () => {
  const { nodes, setNodes, setIsModalOpen, setCurModalType } =
    useContext(NetworkContext);

  const [category, setCategory] = useState('device');
  const [deviceName, setDeviceName] = useState();
  const [deviceManagementType, setDeviceManagementType] = useState();
  const [deviceIP, setDeviceIP] = useState();
  const [deviceType, setDeviceType] = useState();
  const [deviceOS, setDeviceOS] = useState();
  const [manufacturedAt, setManufacturedAt] = useState();

  const [iconType, setIconType] = useState('red');

  const handleSubmit = (e) => {
    e.preventDefault();
    let newNodeData;
    switch (category) {
      case 'device':
        newNodeData = {
          id: deviceIP,
          objectType: category,
          deviceName: deviceName,
          deviceManangementType: deviceManagementType,
          publicIp: deviceIP,
          osType: deviceOS,
          vendor: manufacturedAt,
          deviceType: deviceType,
          source: deviceType,
        };
        break;
      case 'icon':
        newNodeData = {
          id: `icon-${Date.now()}`,
          objectType: category,
          iconType: iconType,
        };
    }

    const newNodes = [
      ...nodes,
      {
        group: "nodes",
        data: { ...newNodeData },
        classes: `object ${category}`,
        grabbable: true,
      },
    ];
    setNodes(newNodes);
    setIsModalOpen(false);
    setCurModalType('');
  };

  const formByCategory = () => {
    switch (category) {
      case 'device':
        return (
          <>
            <div className="form-group">
              <label htmlFor="device-name">장비 명</label>
              <input
                type="text"
                id="device-name"
                placeholder="장비 명"
                onChange={(e) => setDeviceName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="managementType">타입</label>
              <select
                id="managementType"
                onChange={(e) => setDeviceManagementType(e.target.value)}
                required
              >
                {deviceManagementTypes.map((managementType) => {
                  return (
                    <option key={managementType} value={managementType}>
                      {managementType}
                    </option>
                  );
                })}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="ip">IP</label>
              <input
                type="text"
                id="ip"
                placeholder="IP"
                onChange={(e) => setDeviceIP(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="device-icons">유형</label>
              <div className="device-icons" id="device-icons">
                {deviceCategories.map((cat, idx) => {
                  return (
                    <label
                      htmlFor={`device-category-${cat}`}
                      key={cat}
                      className="device-category-label"
                      onClick={() => {
                        setDeviceType(cat);
                      }}
                      required={idx === 0}
                    >
                      <div className="device-icon-image-container">
                        <img src={deviceIcons[cat]} alt={cat} />
                      </div>

                      <div className="device-icon-input-text">
                        <input
                          type="radio"
                          name="device-category"
                          value={cat}
                          id={`device-category-${cat}`}
                          className="icon-input"
                        />
                        <span className="device-category-text">{cat}</span>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="os">OS</label>
              <input
                type="text"
                id="os"
                placeholder="OS"
                onChange={(e) => setDeviceOS(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="manufacturer">제조사</label>
              <input
                type="text"
                id="manufacturer"
                placeholder="제조사"
                onChange={(e) => setManufacturedAt(e.target.value)}
                required
              />
            </div>
            <div className="form-actions">
              <button type="submit">적용</button>
            </div>
          </>
        );
      case 'icon':
        return (
          <>
            <IconInput setIconType={setIconType} onSubmit={handleSubmit} />
          </>
        );
      case 'text':
        return <>text</>;
      default:
        return <>default</>;
    }
  };

  return (
    <form className="create-object-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="category">카테고리</label>
        <select
          id="category"
          onChange={(event) => {
            setCategory(event.target.value);
          }}
        >
          <option value="device">장비</option>
          <option value="icon">아이콘</option>
          <option value="text">텍스트</option>
        </select>
      </div>
      {formByCategory()}
    </form>
  );
};
