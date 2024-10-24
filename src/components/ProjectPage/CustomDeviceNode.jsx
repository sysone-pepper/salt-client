import React from "react";
import "./CustomDeviceNode.css";
import ServerIcon from "../../assets/images/Server-icon2.png";
import NetworkIcon from "../../assets/images/Network-icon2.png";
import L3SwitchIcon from "../../assets/images/L3Switch-icon.png";
import L4SwitchIcon from "../../assets/images/L4Switch-icon.png";
import L7SwitchIcon from "../../assets/images/L7Switch-icon.png";
import FirewallIcon from "../../assets/images/Firewall-icon2.png";
import UPSIcon from "../../assets/images/UPS-icon2.png";

const deviceIcons = {
  Server: ServerIcon,
  Network: NetworkIcon,
  L3Switch: L3SwitchIcon,
  L4Switch: L4SwitchIcon,
  L7Switch: L7SwitchIcon,
  Firewall: FirewallIcon,
  UPS: UPSIcon,
};

export const CustomDeviceNode = ({ node, data }) => {
  return (
    <div
      className="outer-device-node"
      style={{ width: node?.width(), height: node?.height() }} // 바깥노드도 data의 크기를 반영하도록 변경
    >
      <div
        className="inner-device-node"
        style={{ width: node?.width(), height: node?.height() }}
      >
        <img
          className="device-node-icon"
          src={deviceIcons[data?.deviceType]}
          alt={data?.deviceType}
        />
      </div>
      <p className="device-node-info">{data?.id}</p>
    </div>
  );
};
