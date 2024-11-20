import { useState, useEffect, useRef, useContext } from 'react';
import {
  draggable,
  dropTargetForElements,
} from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import invariant from 'tiny-invariant';
import 'bootstrap-icons/font/bootstrap-icons.css';

import sidebarToggleIcon from '../../../assets/images/sidebar-toggle-icon.png';
import { NetworkContext } from '../../../contexts/NetworkContext.jsx';
import Table from './Table';
import './Sidebar.css';
import '../../../constants/MonitoringOptions.js';
import { Modal } from '../../common/Modal.jsx';
import { getDeviceData } from '../../../api/Dashboard.js';
import { useTimeout } from '../../../hooks/useTimeout.jsx';
import { MonitoringOptions } from '../../../constants/MonitoringOptions.js';
import { MonitoringStatusContent } from '../ModalContents/MonitoringStatusContent.jsx';
import { TopUsageOptioningContent } from '../ModalContents/TopUsageOptioningContent.jsx';

const deviceCategory = {
  1: 'Server',
  2: 'Network',
  3: 'L2Switch',
  4: 'L3Switch',
  5: 'L4Switch',
  6: 'L7Switch',
  7: 'FW',
  8: 'UPS',
};

const Sidebar = () => {
  const { nodes, isSidebarPanned, setIsSidebarPanned } =
    useContext(NetworkContext);

  const [topUsageOption, setTopUsageOption] = useState('Traffic');
  const [monitorDevices, setMonitorDevices] = useState([]);
  const [monitorDeviceOption, setMonitorDeviceOption] = useState('CPU');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalOption, setModalOption] = useState(null);
  const [tables, setTables] = useState([
    {
      source: 'deviceStatus',
      title: '장비 현황',
      data: [],
      toDisplayData: [],
      columnAliases: ['', '등록', '장애'],
    },
    {
      source: 'topUsage',
      title: '장비 Traffic 사용량 TOP 5',
      data: [],
      toDisplayData: [],
      columnAliases: ['서버 명', 'Traffic', 'CPU(%)', 'MEM(%)', 'DISK(%)'],
    },
    {
      source: 'monitorDevice',
      title: '장비 Traffic',
      data: [],
      toDisplayData: [],
      columnAliases: ['서버 명', 'Traffic', '차트'],
    },
  ]);

  const dragIndexRef = useRef(null);

  const modalChilds = {
    monitorDevice: (
      <MonitoringStatusContent
        existDevices={nodes
          .filter((node) => node.data.nodeType === 'EXIST_DEVICE')
          .map((node) => node.data.deviceAlias)}
        monitorDevices={monitorDevices}
        setMonitorDevices={setMonitorDevices}
        monitorDeviceOption={monitorDeviceOption}
        setMonitorDeviceOption={setMonitorDeviceOption}
        closeModal={() => {
          setModalOpen(false);
          setModalOption(null);
        }}
      />
    ),
    topUsage: (
      <TopUsageOptioningContent
        topUsageOption={topUsageOption}
        setTopUsageOption={setTopUsageOption}
        closeModal={() => {
          setModalOpen(false);
          setModalOption(null);
        }}
      />
    ),
  };

  const createSideBarTables = async () => {
    const filteredNode = nodes.filter(
      (node) => node.data.nodeType === 'EXIST_DEVICE',
    );

    let deviceStatusObject = {};
    let deviceData = [];

    // 비동기 작업을 배열에 저장
    const fetchPromises = filteredNode.map(async (node) => {
      const deviceType = deviceCategory[node.data.deviceType];
      if (deviceStatusObject[deviceType]) {
        deviceStatusObject[deviceType].total += 1;
      } else {
        deviceStatusObject[deviceType] = { total: 1, warning: 0 };
      }

      const res = await getDeviceData(node.data.deviceId, 30);
      if (res.success && res.data.length > 0) {
        res.data.map((data) => {
          data.trafficAmount = data.nicInBytesPerSec + data.nicOutBytesPerSec;
        });
        const deviceInfo = res.data[0];
        const monitorLimit = 30;
        const hasTrouble =
          deviceInfo?.usedDiskPercentage > monitorLimit ||
          deviceInfo?.usedMemoryPercentage > monitorLimit
            ? true
            : false;

        if (hasTrouble) {
          deviceStatusObject[deviceType].warning += 1;
        }

        const newDeviceData = {
          deviceInfo,
          serverName: node.data.deviceAlias,
          chartData: res.data,
        };
        newDeviceData.deviceInfo.trafficAmount =
          deviceInfo.nicInBytesPerSec + deviceInfo.nicOutBytesPerSec;

        deviceData.push(newDeviceData);
      }
    });

    await Promise.all(fetchPromises);

    const deviceStatusData = Object.entries(deviceStatusObject).map(
      ([category, { total, warning }]) => ({
        category,
        total,
        warning,
      }),
    );

    const sortingTopUsageData = () => {
      deviceData;
      return deviceData
        .sort(
          (a, b) =>
            b.deviceInfo[MonitoringOptions[topUsageOption]] -
            a.deviceInfo[MonitoringOptions[topUsageOption]],
        )
        .slice(0, 5);
    };

    const topUsageData = sortingTopUsageData().map((data) => {
      return {
        serverName: data.serverName,
        traffic: data.deviceInfo.trafficAmount || '-',
        cpuUsagePercent: data.deviceInfo.cpuProcessor || '-',
        memUsagePercent: data.deviceInfo.usedMemoryPercentage || '-',
        diskUsagePercent: data.deviceInfo.usedDiskPercentage || '-',
      };
    });

    const newTables = tables.map((table) => {
      if (table.source === 'deviceStatus') {
        table.data = deviceStatusData;
        table.toDisplayData = deviceStatusData;
      } else if (table.source === 'monitorDevice') {
        table.data = deviceData;
        table.columnAliases = [
          '서버 명',
          `${monitorDeviceOption} (${
            monitorDeviceOption === 'Traffic' ? '' : '%'
          })`,
          '차트',
        ];
        table.toDisplayData = deviceData
          .filter((data) => monitorDevices.includes(data.serverName))
          .map((data) => {
            if (monitorDeviceOption === 'Traffic') console.log(data);
            return {
              serverName: data.serverName,
              amount: data.deviceInfo[[MonitoringOptions[monitorDeviceOption]]],
              chartData: data.chartData.map(
                (data) => data[[MonitoringOptions[monitorDeviceOption]]],
              ),
            };
          });
      } else if (table.source === 'topUsage') {
        table.data = topUsageData;
        table.toDisplayData = topUsageData.map((data) => {
          return {
            serverName: data.serverName,
            traffic: data.traffic,
            cpuUsagePercent: data.cpuUsagePercent,
            memUsagePercent: data.memUsagePercent,
            diskUsagePercent: data.diskUsagePercent,
          };
        });
      }
      return table;
    });

    setTables(newTables);
  };

  useTimeout(() => {
    createSideBarTables();
  }, 60000);

  useEffect(() => {
    const filteredNode = nodes.filter(
      (node) => node.data.nodeType === 'EXIST_DEVICE',
    );
    const newMonitorDevices = filteredNode.map((node) => node.data.deviceAlias);
    setMonitorDevices(newMonitorDevices);
  }, [nodes]);

  useEffect(() => {
    createSideBarTables();
  }, [topUsageOption, monitorDevices, monitorDeviceOption]);

  useEffect(() => {
    tables.forEach((_, index) => {
      const element = document.getElementById(`table-${index}`);
      const dragHandle = document.getElementById(`drag-handle-${index}`);

      invariant(element, '해당 element가 존재하지 않습니다.');
      invariant(dragHandle, '해당 dragHandle이 존재하지 않습니다.');

      draggable({
        element,
        dragHandle,
        onDragStart: () => {
          dragIndexRef.current = index;
        },
      });
    });
  }, [tables]);

  useEffect(() => {
    tables.forEach((_, index) => {
      const element = document.getElementById(`table-${index}`);

      invariant(element, '해당 element가 존재하지 않습니다.');

      dropTargetForElements({
        element,
        onDrop: () => handleDrop(index),
      });
    });
  }, [tables]);

  const handleDrop = (dropIndex) => {
    const dragIndex = dragIndexRef.current;
    if (dragIndex !== null && dragIndex !== dropIndex) {
      const updatedTables = [...tables];
      const [draggedItem] = updatedTables.splice(dragIndex, 1);
      updatedTables.splice(dropIndex, 0, draggedItem);
      setTables(updatedTables);
    }
    dragIndexRef.current = null;
  };

  const toggleSidebar = () => {
    setIsSidebarPanned((prevState) => !prevState);
  };

  return (
    <>
      {modalOpen && (
        <Modal
          child={modalChilds[modalOption]}
          closeModal={() => {
            setModalOpen(false);
            setModalOption(null);
          }}
        />
      )}
      <div
        className={`sidebar-wrapper${
          isSidebarPanned ? ' expanded' : ' collapsed'
        }`}
      >
        <aside className="sidebar">
          <ul className="table-list">
            {tables.map((table, index) => {
              const dataSource = table;
              const dataSourceTitle =
                table.source === 'deviceStatus'
                  ? '장비 현황'
                  : table.source === 'topUsage'
                  ? `장비 ${topUsageOption} Top5`
                  : `장비 ${monitorDeviceOption} 모니터링`;

              return (
                <li key={index} id={`table-${index}`}>
                  <div
                    id={`drag-handle-${index}`}
                    className="drag-handle table-title"
                  >
                    <span>
                      {'\u22EE\u22EE'} {dataSourceTitle}
                    </span>
                    {dataSourceTitle === '장비 현황' ? null : (
                      <button
                        className="filter-toggling-btn"
                        onClick={() => {
                          setModalOpen(true);
                          setModalOption(table.source);
                        }}
                      >
                        <i className="bi bi-gear" />
                      </button>
                    )}
                  </div>
                  <div className={`sidebar-element ${table.source}`}>
                    <Table source={dataSource} key={index} />
                  </div>
                </li>
              );
            })}
          </ul>
        </aside>
      </div>
      <div className="sb-pan-btn" onClick={toggleSidebar}>
        <img className="sb-pan-icon" src={sidebarToggleIcon} />
      </div>
    </>
  );
};

export default Sidebar;
