import React, { useContext, useState } from "react";
import "./LoadDeviceForm.css";
import { NetworkContext } from "../../../contexts/NetworkContext";

const LoadDevice = () => {
  // 기존 장비를 불러오는 함수
  return [
    {
      key: 1,
      device_alias: "DESKTOP_업무_01",
      device_name: "DESKTOP-P3L1AHM",
      public_ip: "10.10.10.1",
      public_ip_v6: "00:03:EA:19:04:1D",
      os_type: "Windows",
      os_detail: "Microsoft Windows 10 Pro",
      vendor: "SAMSUNG ELECTRONICS CO., LTD.",
      device_type: "1",
      source:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRLwSPrY4-TRKuyeTujdu-_O7MgLPjR79Uhag&s",
    },
    {
      key: 2,
      device_alias: "DESKTOP_업무_02",
      device_name: "DESKTOP-41CBLI8",
      public_ip: "10.10.10.2",
      public_ip_v6: "00:03:EA:19:04:1D",
      os_type: "Windows",
      os_detail: "Microsoft Windows 10 Pro",
      vendor: "SAMSUNG ELECTRONICS CO., LTD.",
      device_type: "1",
      source:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT34w_tApxbp323ePS-g365lCM6ZP3vdhdetQ&s",
    },
    {
      key: 3,
      device_alias: "DESKTOP_업무_03",
      device_name: "DESKTOP-41CBLI8",
      public_ip: "10.10.10.3",
      public_ip_v6: "00:0C:29:59:8B:13",
      os_type: "Windows",
      os_detail: "Microsoft Windows 10 Pro",
      vendor: "SAMSUNG ELECTRONICS CO., LTD.",
      device_type: "1",
      source:
        "https://www.shutterstock.com/image-vector/uninterrupted-power-supply-icon-vector-260nw-2223482595.jpg",
    },
  ];
};

export const LoadDeviceForm = () => {
  const { setIsModalOpen, setCurModalType } = useContext(NetworkContext);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const loadedDeviceData = LoadDevice();

  const LoadedDeviceTag = (data) => {
    return (
      <div
        className="loaded-device-container"
        onClick={() => {
          console.log(data);
          setSelectedDevice(data);
        }}
        key={data.public_ip}
      >
        <div className="loaded-deive-image-container">
          <img
            src={data.source}
            alt={data.device_name}
            className="loaded-device-image"
          />
        </div>
        <p className="loaded-device-info">{data.device_name}</p>
      </div>
    );
  };

  const handleLoadDeviceSubmit = (e) => {
    e.preventDefault();
    if (!selectedDevice) {
      alert("장비를 선택해주세요!");
    }
    setIsModalOpen(false);
    setCurModalType("");
  };

  return (
    <form className="load-device-form" onSubmit={handleLoadDeviceSubmit}>
      <div className="loaded-devices">
        {loadedDeviceData.map((data) => {
          return LoadedDeviceTag(data);
        })}
      </div>
      <div className="form-actions">
        <button type="submit">적용</button>
      </div>
    </form>
  );
};
