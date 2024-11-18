import React, { useState } from 'react';
import { MonitoringOptions } from '../../../constants/MonitoringOptions';

export const MonitoringStatusContent = ({
  existDevices,
  monitorDevices,
  setMonitorDevices,
  monitorDeviceOption,
  setMonitorDeviceOption,
  closeModal,
}) => {
  const [selectedDevices, setSelectedDevices] = useState(monitorDevices);
  const [selectedOption, setSelectedOption] = useState(monitorDeviceOption);

  const toggleDevice = (device) => {
    const isSelected = selectedDevices.includes(device);
    const updatedDevices = isSelected
      ? selectedDevices.filter((d) => d !== device) // 선택 해제
      : [...selectedDevices, device]; // 선택 추가

    setSelectedDevices(updatedDevices);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setMonitorDevices(selectedDevices);
    setMonitorDeviceOption(selectedOption);
    closeModal();
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>모니터링 옵션</h3>
      <select
        id="monitoring-status-option-select"
        onChange={(event) => {
          setSelectedOption(event.target.value);
        }}
      >
        {Object.keys(MonitoringOptions).map((item) => {
          if (item === selectedOption) {
            return (
              <option value={item} selected>
                {item}
              </option>
            );
          } else {
            return <option value={item}>{item}</option>;
          }
        })}
      </select>
      <h3>장비 선택</h3>
      <ul>
        {existDevices.map((device) => (
          <li key={device}>
            <label>
              <input
                type="checkbox"
                checked={selectedDevices.includes(device)}
                onChange={() => toggleDevice(device)}
              />
              {device}
            </label>
          </li>
        ))}
      </ul>
      <button type="submit">확인</button>
    </form>
  );
};
