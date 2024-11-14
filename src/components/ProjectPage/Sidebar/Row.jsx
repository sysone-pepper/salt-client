import ServerIcon from '../../../assets/images/Server-icon2.png';
import NetworkIcon from '../../../assets/images/Network-icon2.png';
import L3SwitchIcon from '../../../assets/images/L3Switch-icon.png';
import L4SwitchIcon from '../../../assets/images/L4Switch-icon.png';
import L7SwitchIcon from '../../../assets/images/L7Switch-icon.png';
import FirewallIcon from '../../../assets/images/Firewall-icon2.png';
import UPSIcon from '../../../assets/images/UPS-icon2.png';
import { useEffect, useState } from 'react';

const iconLookup = {
  Server: (
    <img className="sb-icon-image" key="ServerImg" src={ServerIcon} alt="" />
  ),
  Network: (
    <img className="sb-icon-image" key="NetworkImg" src={NetworkIcon} alt="" />
  ),
  L2Switch: (
    <img
      className="sb-icon-image"
      key="L2SwitchImg"
      src={L3SwitchIcon}
      alt=""
    />
  ),
  L3Switch: (
    <img
      className="sb-icon-image"
      key="L3SwitchImg"
      src={L3SwitchIcon}
      alt=""
    />
  ),
  L4Switch: (
    <img
      className="sb-icon-image"
      key="L4SwitchImg"
      src={L4SwitchIcon}
      alt=""
    />
  ),
  L7Switch: (
    <img
      className="sb-icon-image"
      key="L7SwitchImg"
      src={L7SwitchIcon}
      alt=""
    />
  ),
  FW: (
    <img
      className="sb-icon-image"
      key="FirewallImg"
      src={FirewallIcon}
      alt=""
    />
  ),
  UPS: <img className="sb-icon-image" key="UPSImg" src={UPSIcon} alt="" />,
};
const Row = ({ rowData, needChart }) => {
  const createChart = (chartData) => {
    return '차트 데이터 로드됨'; // 실제 차트 또는 데이터 내용
  };

  return (
    <tr className="table-row">
      {Object.entries(rowData).map(([key, value], idx) => {
        if (needChart && idx === Object.entries(rowData).length - 1) {
          return <td>{createChart(value)}</td>;
        } else {
          return (
            <td key={`${key} field`} className="table-field">
              {iconLookup[value] && iconLookup[value]}
              <span>{value}</span>
            </td>
          );
        }
      })}
    </tr>
  );
};

export default Row;
