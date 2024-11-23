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
import { fetchDeviceInfos } from '../../../api/Diagram.js';

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
  const { dataReady, nodes, setNodes, isSidebarPanned, setIsSidebarPanned } =
    useContext(NetworkContext);

  const [topUsageOption, setTopUsageOption] = useState('traffic');
  const [monitorDevices, setMonitorDevices] = useState(null);
  const [monitorDeviceOption, setMonitorDeviceOption] = useState('traffic');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalOption, setModalOption] = useState(null);
  const [tables, setTables] = useState([
    {
      source: 'deviceStatus',
      title: '장비 현황',
      toDisplayData: [],
      columnAliases: ['', '등록', '장애'],
    },
    {
      source: 'topUsage',
      title: '장비 Traffic 사용량 TOP 5',
      toDisplayData: [],
      columnAliases: ['서버 명', 'Traffic', 'CPU(%)', 'MEM(%)', 'DISK(%)'],
    },
    {
      source: 'monitorDevice',
      title: '장비 Traffic',
      toDisplayData: [],
      columnAliases: ['서버 명', 'Traffic', '차트'],
    },
  ]);

  const dragIndexRef = useRef(null);

  const [modalChild, setModalChild] = useState(null); // modalChild 상태 추가

  const handleModalOptionChange = (option) => {
    if (option === 'monitorDevice') {
      setModalChild(
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
          }}
        />,
      );
    } else if (option === 'topUsage') {
      setModalChild(
        <TopUsageOptioningContent
          topUsageOption={topUsageOption}
          setTopUsageOption={setTopUsageOption}
          closeModal={() => {
            setModalOpen(false);
          }}
        />,
      );
    }
  };

  const createSideBarTables = async () => {
    if (nodes.length <= 1) return;

    const deviceNodes = nodes.filter(
      (node, idx) => idx !== 0 && node.data.nodeType.endsWith('DEVICE'),
    );

    // 위험. 경고 수치
    const alertLevel = deviceNodes
      .filter((node) => node.data.nodeType.startsWith('EXIST'))
      .reduce((obj, node) => {
        const {
          deviceAlias,
          trafficWarning,
          trafficDanger,
          cpuWarning,
          cpuDanger,
          diskWarning,
          diskDanger,
          memWarning,
          memDanger,
        } = node.data;
        if (!obj[deviceAlias]) {
          obj[deviceAlias] = {
            traffic: [trafficWarning, trafficDanger],
            cpu: [cpuWarning, cpuDanger],
            mem: [memWarning, 40],
            disk: [diskWarning, diskDanger],
          };
        }
        return obj;
      }, {});

    const data = await fetchDeviceInfos(1, 30);

    const groupById = (array) => {
      return array.reduce((groups, item) => {
        const { deviceId } = item;
        if (!groups[deviceId]) {
          groups[deviceId] = [];
        }
        groups[deviceId].push(item);
        return groups;
      }, {});
    };

    const groupedData = groupById(data.chartInfos);

    // device status
    const categoryMap = Object.values(deviceCategory).reduce((acc, value) => {
      acc[value] = [0, 0];
      return acc;
    }, {});

    const warningNodes = [];
    const dangerNodes = [];

    deviceNodes.forEach((node) => {
      if (node.data.nodeType.startsWith('NEW')) {
        categoryMap[node.data.newDeviceType][0] += 1;
      } else {
        categoryMap[deviceCategory[node.data.deviceType]][0] += 1;
        const nodeData = groupedData[node.data.deviceId][0];
        if (
          nodeData.cpuProcessor > alertLevel[node.data.deviceAlias].cpu[0] ||
          nodeData.usedDiskPercentage >
            alertLevel[node.data.deviceAlias].disk[0] ||
          nodeData.usedMemoryPercentage >
            alertLevel[node.data.deviceAlias].mem[0] ||
          nodeData.traffic > alertLevel[node.data.deviceAlias].traffic[0]
        ) {
          categoryMap[deviceCategory[node.data.deviceType]][1] += 1;
          warningNodes.push(node.data.id);
        }
      }
    });

    // const newNodes = [...nodes].map((node) => {
    //   if (warningNodes.includes(node.data.id)) {
    //     node.classes = 'object EXIST_DEVICE WARNING';
    //   }
    //   return node;
    // });

    // setNodes(newNodes);

    const deviceStatusData = Object.entries(categoryMap).map(([key, value]) => [
      [key, 0],
      [value[0], 0],
      [value[1], 2],
    ]);

    // top usage
    let topUsageData = data[topUsageOption].map((info) => {
      const deviceAlias = info.deviceAlias;
      let infoRow = [[deviceAlias, 0]];
      Object.entries(MonitoringOptions).map(([key, value]) => {
        if (info[value] > alertLevel[deviceAlias][key][1]) {
          infoRow.push([info[value], 2]);
        } else if (info[value] > alertLevel[deviceAlias][key][0]) {
          infoRow.push([info[value], 1]);
        } else {
          infoRow.push([info[value], 0]);
        }
      });
      return infoRow;
    });

    // monitor device
    let monitorDeviceData = [];
    Object.entries(groupedData).forEach(([deviceId, items]) => {
      const deviceName = items[0].deviceAlias;
      if (monitorDevices.includes(deviceName)) {
        let rowData = [[deviceName, 0]];
        let chartData = [];
        items.map((info) => {
          chartData.push(info[MonitoringOptions[monitorDeviceOption]]);
        });
        rowData.push([chartData[0], 0]);
        rowData.push(chartData);
        monitorDeviceData.push(rowData);
      }
    });

    const newTable = [...tables];
    newTable.map((table) => {
      if (table.source === 'deviceStatus')
        table.toDisplayData = deviceStatusData;
      else if (table.source === 'topUsage') table.toDisplayData = topUsageData;
      else if (table.source === 'monitorDevice')
        table.toDisplayData = monitorDeviceData;
    });
    setTables(newTable);
  };

  useTimeout(() => {
    createSideBarTables();
  }, 5000);

  useEffect(() => {
    if (!monitorDevices) {
      const filteredNode = nodes.filter(
        (node) => node.data.nodeType === 'EXIST_DEVICE',
      );
      const newMonitorDevices = filteredNode.map(
        (node) => node.data.deviceAlias,
      );
      setMonitorDevices(newMonitorDevices);
    }
  }, [dataReady]);

  useEffect(() => {
    createSideBarTables();
  }, [topUsageOption, monitorDevices, monitorDeviceOption]);

  useEffect(() => {
    const newTables = [...tables].map((table) => {
      if (table?.source === 'monitorDevice') {
        table.columnAliases = [
          '서버 명',
          monitorDeviceOption.toLocaleUpperCase(),
          '차트',
        ];
      }
      return table;
    });
    setTables(newTables);
  }, [monitorDeviceOption]);

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
          child={modalChild}
          closeModal={() => {
            setModalOpen(false);
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
                          handleModalOptionChange(table.source);
                        }}
                      >
                        <i className="bi bi-gear" />
                      </button>
                    )}
                  </div>
                  <div className={`sidebar-element ${table.source}`}>
                    <Table source={dataSource} />
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
