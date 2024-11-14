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
import { Modal } from '../../common/Modal.jsx';
import { getDeviceData } from '../../../api/Dashboard.js';
import { useTimeout } from '../../../hooks/useTimeout.jsx';

const sidebarModals = {
  deviceStatus: (onModalClose) => <div />,
  topTrafficUsage: (onModalClose) => <div />,
  deviceTraffic: (onModalClose) => <div />,
};
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
  const { nodes, dataReady, isSidebarPanned, setIsSidebarPanned } =
    useContext(NetworkContext);
  const [modalContentName, setModalContentName] = useState(null);
  const [tables, setTables] = useState([
    {
      source: 'deviceStatus',
      title: '장비 현황',
      data: [],
      toDisplayData: [],
      columnAliases: ['', '등록', '장애'],
    },
    {
      source: 'topTrafficUsage',
      title: '장비 Traffic 사용량 TOP 5',
      data: [],
      toDisplayData: [],
      columnAliases: ['서버 명', 'Traffic', 'CPU(%)', 'MEM(%)', 'DISK(%)'],
    },
    {
      source: 'deviceTraffic',
      title: '장비 Traffic',
      data: [],
      toDisplayData: [],
      columnAliases: ['서버 명', 'Traffic', '차트'],
    },
  ]);
  const dragIndexRef = useRef(null);

  const createSideBarTables = async () => {
    console.log('update data');

    const filteredNode = nodes.filter(
      (node) => node.data.nodeType === 'EXIST_DEVICE',
    );

    let deviceStatusObject = {};
    let deviceTrafficData = [];

    // 비동기 작업을 배열에 저장
    const fetchPromises = filteredNode.map(async (node) => {
      const deviceType = deviceCategory[node.data.deviceType];
      if (deviceStatusObject[deviceType]) {
        deviceStatusObject[deviceType].total += 1;
      } else {
        deviceStatusObject[deviceType] = { total: 1, warning: 0 };
      }

      const res = await getDeviceData(node.data.id, 30);
      if (res.success) {
        const devicdInfo = res.data[0];
        const monitorLimit = 30;
        const hasTrouble =
          devicdInfo.usedDiskPercentage > monitorLimit ||
          devicdInfo.usedMemoryPercentage > monitorLimit
            ? true
            : false;

        if (hasTrouble) {
          deviceStatusObject[deviceType].warning += 1;
        }

        deviceTrafficData.push({
          devicdInfo,
          serverName: node.data.deviceAlias,
          trafficAmount:
            devicdInfo.nicInBytesPerSec + devicdInfo.nicOutBytesPerSec,
          chartData: res.data,
        });
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

    const dataSortByTraffic = deviceTrafficData
      .sort((a, b) => b.trafficAmount - a.trafficAmount)
      .slice(0, 5);

    const topTrafficUsageData = dataSortByTraffic.map((data) => {
      return {
        serverName: data.serverName,
        traffic: data.trafficAmount,
        cpuUsagePercent: data.devicdInfo.cpuProcessor || '-',
        memUsagePercent: data.devicdInfo.usedMemoryPercentage || '-',
        diskUsagePercent: data.devicdInfo.usedDiskPercentage || '-',
      };
    });

    const newTables = tables.map((table) => {
      if (table.source === 'deviceStatus') {
        table.data = deviceStatusData;
        table.toDisplayData = deviceStatusData;
      } else if (table.source === 'deviceTraffic') {
        table.data = deviceTrafficData;
        table.toDisplayData = deviceTrafficData.map((data) => {
          return {
            serverName: data.serverName,
            trafficAmount: data.trafficAmount,
            chartData: data.chartData,
          };
        });
      } else if (table.source === 'topTrafficUsage') {
        table.data = topTrafficUsageData;
        table.toDisplayData = topTrafficUsageData.map((data) => {
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
    if (dataReady) {
      createSideBarTables();
    }
  }, [dataReady]);

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

  // 모달 여는 함수
  const handleDeviceFilteringModalOpen = (tableSource) => {
    setModalContentName(tableSource);
  };
  const toggleSidebar = () => {
    setIsSidebarPanned((prevState) => !prevState);
  };

  return (
    <>
      <div
        className={`sidebar-wrapper${
          isSidebarPanned ? ' expanded' : ' collapsed'
        }`}
      >
        <aside className="sidebar">
          <ul className="table-list">
            {tables.map((table, index) => {
              const tableSource = table.source;
              const dataSource = table;
              const dataSourceTitle = dataSource.title;

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
                        onClick={() =>
                          handleDeviceFilteringModalOpen(tableSource)
                        }
                      >
                        <i className="bi bi-gear" />
                      </button>
                    )}
                  </div>
                  <div className="sidebar-element">
                    <Table source={dataSource} key={index} />
                  </div>
                </li>
              );
            })}
          </ul>
        </aside>
      </div>
      {modalContentName && (
        <Modal
          child={sidebarModals[modalContentName](() =>
            setModalContentName(null),
          )}
          closeModal={() => setModalContentName(null)}
        />
      )}
      <div className="sb-pan-btn" onClick={toggleSidebar}>
        <img className="sb-pan-icon" src={sidebarToggleIcon} />
      </div>
    </>
  );
};

export default Sidebar;
