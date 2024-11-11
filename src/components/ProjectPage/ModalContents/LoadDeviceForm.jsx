import React, { useContext, useEffect, useState } from 'react';
import './LoadDeviceForm.css';
import { NetworkContext } from '../../../contexts/NetworkContext';
import { ExistDeviceCard } from './ExistDeviceCard';

export const LoadDeviceForm = ({ closeModal }) => {
  const {
    fetchExistDeviceInfo,
    existDevices,
    curProjectId,
    createNodeId,
    nodes,
    setNodes,
    selectedSize,
  } = useContext(NetworkContext);
  const [dataReady, setDataReady] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [search, setSearch] = useState('');

  // 실장비 데이터 로드
  useEffect(() => {
    fetchExistDeviceInfo();
  }, []);

  // 실장비 데이터 로드 이후, 장비 카드 생성
  useEffect(() => {
    setDataReady(true);
  }, [existDevices]);

  const handleLoadDeviceSubmit = async (e) => {
    e.preventDefault();
    if (!selectedDevice) {
      alert('장비를 선택해주세요!');
    }
    const newNodeData = {
      nodeType: 'EXIST_DEVICE',
      positionX: 0,
      positionY: 0,
      nodeSize: selectedSize,
      deviceId: selectedDevice.id,
    };

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

  const filteredDevices = existDevices.filter((deviceData) => {
    const lowerCaseQuery = search.toLowerCase();
    return (
      deviceData.deviceName.toLowerCase().includes(lowerCaseQuery) ||
      deviceData.deviceAlias.toLowerCase().includes(lowerCaseQuery) ||
      deviceData.publicIp.toLowerCase().includes(lowerCaseQuery)
    );
  });

  return (
    <form className="load-device-form" onSubmit={handleLoadDeviceSubmit}>
      <input
        className="search-device-info"
        type="text"
        placeholder="장비 이름, 별칭 또는 아이피 검색 "
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className="loaded-devices">
        {dataReady &&
          filteredDevices.map((deviceData) => (
            <ExistDeviceCard
              key={deviceData.id}
              deviceData={deviceData}
              isSelected={selectedDevice?.id === deviceData.id}
              onSelect={() => setSelectedDevice(deviceData)}
            />
          ))}
      </div>
      <div className="form-actions">
        <button type="submit">적용</button>
      </div>
    </form>
  );
};
