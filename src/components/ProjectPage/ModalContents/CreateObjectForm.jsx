import React, { useContext, useState } from 'react';
import './CreateObjectForm.css';
import ServerIcon from '../../../assets/images/Server-icon2.png';
import NetworkIcon from '../../../assets/images/Network-icon2.png';
import L3SwitchIcon from '../../../assets/images/L3Switch-icon.png';
import L4SwitchIcon from '../../../assets/images/L4Switch-icon.png';
import L7SwitchIcon from '../../../assets/images/L7Switch-icon.png';
import FirewallIcon from '../../../assets/images/Firewall-icon2.png';
import UPSIcon from '../../../assets/images/UPS-icon2.png';
import { NetworkContext } from '../../../contexts/NetworkContext.jsx';
import { IconInput } from './IconInput.jsx';
import { TextInput } from './TextInput.jsx';

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

export const CreateObjectForm = ({ closeModal }) => {
  const { curProjectId, createNodeId, nodes, setNodes, selectedSize } =
    useContext(NetworkContext);

  const [category, setCategory] = useState('device');
  const [deviceName, setDeviceName] = useState();
  const [deviceManagementType, setDeviceManagementType] = useState();
  const [deviceIP, setDeviceIP] = useState();
  const [deviceType, setDeviceType] = useState();
  const [deviceOS, setDeviceOS] = useState();
  const [manufacturedAt, setManufacturedAt] = useState();
  const [iconType, setIconType] = useState('#000000');
  const [textContent, setTextContent] = useState('');
  const [textColor, setTextColor] = useState('#000000');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (category === 'text' && textContent.trim() === '') {
      alert('최소 1글자 이상 입력해주세요.');
      return;
    }
    let newNodeData;
    switch (category) {
      case 'device':
        newNodeData = {
          nodeType: 'NEW_DEVICE',
          positionX: 0,
          positionY: 0,
          nodeSize: selectedSize,
          newDeviceName: deviceName,
          newDeviceAlias: deviceName,
          newDeviceType: deviceType,
          newDevicePublicIp: deviceIP,
          newDeviceOs: deviceOS,
          newDeviceVendor: manufacturedAt,
        };
        break;
      case 'icon':
        newNodeData = {
          nodeType: 'ICON',
          positionX: 0,
          positionY: 0,
          nodeSize: selectedSize,
          iconType: iconType,
        };
        break;
      case 'text':
        const defaultSize = Number(selectedSize);
        const avgWidth = {
          korean: defaultSize, // 한글은 보통 정사각형에 가깝게 표현
          english: defaultSize * 0.6, // 영어는 상대적으로 좁음
          number: defaultSize * 0.6, // 숫자도 영어와 비슷한 폭
        };

        let calculatedWidth = 0;
        for (const char of textContent) {
          if (/[가-힣ㄱ-ㅎㅏ-ㅣ]/.test(char)) {
            calculatedWidth += avgWidth.korean;
          } else if (/[a-zA-Z]/.test(char)) {
            calculatedWidth += avgWidth.english;
          } else if (/[0-9]/.test(char)) {
            calculatedWidth += avgWidth.number;
          } else {
            calculatedWidth += avgWidth.english;
          }
        }
        console.log(calculatedWidth);

        newNodeData = {
          nodeType: 'TEXT',
          positionX: 0,
          positionY: 0,
          nodeSize: selectedSize,
          textContent,
          textColor,
          calculatedWidth,
        };
        break;
    }

    let nodeId = await createNodeId(newNodeData);

    let newNode = {
      group: 'nodes',
      data: {
        id: nodeId,
        nodeId,
        projectId: curProjectId,
        ...newNodeData,
      },
      position: { x: newNodeData.positionX, y: newNodeData.positionY },
      style: { width: newNodeData.nodeSize, height: newNodeData.nodeSize },
      classes: `object ${newNodeData.nodeType + ' noControlsMode'}`,
      grabbable: true,
    };

    delete newNode.data.positionX;
    delete newNode.data.positionY;

    setNodes([...nodes, newNode]);
    closeModal();
  };

  const formByCategory = () => {
    switch (category) {
      case 'device':
        return (
          <>
            <div className="form-group">
              <label htmlFor="device-name">장비 명</label>
              <div className="node-modal-content">
                <input
                  type="text"
                  id="device-name"
                  placeholder="장비 명"
                  onChange={(e) => setDeviceName(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="managementType">타입</label>
              <div className="node-modal-content">
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
            </div>
            <div className="form-group">
              <label htmlFor="ip">IP</label>
              <div className="node-modal-content">
                <input
                  type="text"
                  id="ip"
                  placeholder="IP"
                  onChange={(e) => setDeviceIP(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="device-icons">유형</label>
              <div className="node-modal-content">
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
            </div>
            <div className="form-group">
              <label htmlFor="os">OS</label>
              <div className="node-modal-content">
                <input
                  type="text"
                  id="os"
                  placeholder="OS"
                  onChange={(e) => setDeviceOS(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="manufacturer">제조사</label>
              <div className="node-modal-content">
                <input
                  type="text"
                  id="manufacturer"
                  placeholder="제조사"
                  onChange={(e) => setManufacturedAt(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="form-actions">
              <button type="submit">적용</button>
            </div>
          </>
        );
      case 'icon':
        return (
          <>
            <IconInput
              iconType={iconType}
              setIconType={setIconType}
              onSubmit={handleSubmit}
            />
          </>
        );
      case 'text':
        return (
          <TextInput
            textContent={textContent}
            setTextContent={setTextContent}
            textColor={textColor}
            setTextColor={setTextColor}
            onSubmit={handleSubmit}
          />
        );
      default:
        return <>default</>;
    }
  };

  return (
    <form className="create-object-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="category">카테고리</label>
        <div className="node-modal-content">
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
      </div>
      {formByCategory()}
    </form>
  );
};
