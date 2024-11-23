import { useEffect, useState, useRef } from 'react';
import ServerIcon from '../../../assets/images/Server-icon2.png';
import NetworkIcon from '../../../assets/images/Network-icon2.png';
import L3SwitchIcon from '../../../assets/images/L3Switch-icon.png';
import L4SwitchIcon from '../../../assets/images/L4Switch-icon.png';
import L7SwitchIcon from '../../../assets/images/L7Switch-icon.png';
import FirewallIcon from '../../../assets/images/Firewall-icon2.png';
import UPSIcon from '../../../assets/images/UPS-icon2.png';
import Sparkline from './SparkLine';

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

const fontcolors = {
  0: '',
  1: 'yellow',
  2: 'red',
};

const isNum = (value) => {
  return typeof value === 'number';
};

const Row = ({ rowData, needChart }) => {
  console.log(Object.entries(rowData));
  const marqueeRef = useRef(null);
  const [isOverflow, setIsOverflow] = useState(false);

  // 오버플로우 감지 함수
  const checkOverflow = (element) => {
    if (!element) return false;
    return element.scrollWidth > element.clientWidth;
  };

  useEffect(() => {
    const element = marqueeRef.current;
    if (element) {
      setIsOverflow(checkOverflow(element));
    }
  }, [rowData]); // rowData가 변경될 때마다 오버플로우 상태 확인

  const createChart = (chartData) => {
    return (
      <Sparkline
        data={chartData.filter((data) => data !== undefined).reverse()}
      />
    );
  };

  return (
    <tr className="table-row">
      {Object.entries(rowData).map(([key, value], idx) => {
        if (needChart && idx === Object.entries(rowData).length - 1) {
          return (
            <td key={`${key} field`} className="table-field">
              {createChart(value)}
            </td>
          );
        } else if (idx === 0) {
          return (
            <td key={`${key} field`} className="table-field">
              {iconLookup[value] && iconLookup[value]}
              <div
                ref={marqueeRef}
                className={`marquee-container ${
                  isOverflow ? 'marquee-active' : ''
                }`}
              >
                <span>
                  {iconLookup[value[0]] && iconLookup[value[0]]}
                  {value[0]}
                </span>
              </div>
            </td>
          );
        } else {
          return (
            <td key={`${key} field`} className="table-field">
              <span
                style={{
                  color: value[0] === 0 ? fontcolors[0] : fontcolors[value[1]],
                }}
              >
                {value[0]}
              </span>
            </td>
          );
        }
      })}
    </tr>
  );
};

export default Row;
