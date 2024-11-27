import { useState, useEffect, useRef, useContext } from 'react';
import {
  draggable,
  dropTargetForElements,
} from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';

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
import { ControlWarningLevelContent } from '../ModalContents/ControlWarningLevelContetnt.jsx';
import useNotification from '../../../hooks/usePushNotification.jsx';

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
  const {
    curProjectId,
    frequency,
    dataReady,
    nodes,
    setNodeEffects,
    pushMessages,
    setPushMessages,
    pushOptions,
    setPushOptions,
    isSidebarPanned,
    setIsSidebarPanned,
  } = useContext(NetworkContext);
  const { permission, requestPermission, showNotification } = useNotification();

  const handleNotification = (message) => {
    showNotification(message.title, {
      body: message.body,
      icon: message.icon,
      tag: `unique-${Date.now()}`, // 중복 방지 태그
    });
  };

  const [topUsageOption, setTopUsageOption] = useState('traffic');
  const [monitorDevices, setMonitorDevices] = useState(null);
  const [monitorDeviceOption, setMonitorDeviceOption] = useState('traffic');
  const [modalOpen, setModalOpen] = useState(false);
  const [alertLevels, setAlertLevels] = useState({});
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
    } else {
      setModalChild(
        <ControlWarningLevelContent
          data={alertLevels}
          closeModal={() => {
            setModalOpen(false);
          }}
        />,
      );
    }
  };

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB'];
    const i = Math.floor(Math.log(Math.abs(bytes)) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getDateTime = () => {
    const today = new Date();

    const year = today.getFullYear();
    const month = ('0' + (today.getMonth() + 1)).slice(-2);
    const day = ('0' + today.getDate()).slice(-2);

    const hours = ('0' + today.getHours()).slice(-2);
    const minutes = ('0' + today.getMinutes()).slice(-2);
    const seconds = ('0' + today.getSeconds()).slice(-2);
    //${year}.${month}.${day}
    return `${hours}:${minutes}:${seconds}`;
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
            mem: [memWarning, memDanger],
            disk: [diskWarning, diskDanger],
            id: [node.data.id],
          };
        }
        return obj;
      }, {});

    setAlertLevels(alertLevel);

    const data = await fetchDeviceInfos(curProjectId, 30);

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

    const newNodeEffects = [];
    const newPushMessages = [];

    deviceNodes.forEach((node) => {
      if (node.data.nodeType.startsWith('NEW')) {
        categoryMap[node.data.newDeviceType][0] += 1;
      } else {
        categoryMap[deviceCategory[node.data.deviceType]][0] += 1;
        const nodeData = groupedData[node.data.deviceId][0];

        let pushMessage = `[${getDateTime()}] ${node.data.deviceAlias}에서 [ `;
        let needPush = false;
        if (
          nodeData.cpuProcessor > alertLevel[node.data.deviceAlias].cpu[1] ||
          nodeData.usedDiskPercentage >
            alertLevel[node.data.deviceAlias].disk[1] ||
          nodeData.usedMemoryPercentage >
            alertLevel[node.data.deviceAlias].mem[1] ||
          nodeData.traffic > alertLevel[node.data.deviceAlias].traffic[1]
        ) {
          categoryMap[deviceCategory[node.data.deviceType]][1] += 1;
          const nodeEffect = {
            classes: 'effect DANGER',
            data: {
              id: `effect-${node.data.id}`,
              nodeSize: node.data.nodeSize * 1.15,
            },
            position: node.position,
          };
          newNodeEffects.push(nodeEffect);
          // Danger push message
          if (
            nodeData.cpuProcessor > alertLevel[node.data.deviceAlias].cpu[1] &&
            pushOptions.includes('CPU')
          ) {
            pushMessage += `CPU 위험(${nodeData.cpuProcessor}%) `;
            needPush = true;
          }
          if (
            nodeData.usedDiskPercentage >
              alertLevel[node.data.deviceAlias].disk[1] &&
            pushOptions.includes('DISK')
          ) {
            pushMessage += `DISK 위험(${nodeData.usedDiskPercentage}%) `;
            needPush = true;
          }
          if (
            nodeData.usedMemoryPercentage >
              alertLevel[node.data.deviceAlias].mem[1] &&
            pushOptions.includes('MEM')
          ) {
            pushMessage += `MEM 위험(${nodeData.usedMemoryPercentage}%) `;
            needPush = true;
          }
          if (
            nodeData.traffic > alertLevel[node.data.deviceAlias].traffic[1] &&
            pushOptions.includes('Traffic')
          ) {
            pushMessage += `traffic 위험(${formatBytes(nodeData.traffic)}) `;
            needPush = true;
          }
        } else if (
          nodeData.cpuProcessor > alertLevel[node.data.deviceAlias].cpu[0] ||
          nodeData.usedDiskPercentage >
            alertLevel[node.data.deviceAlias].disk[0] ||
          nodeData.usedMemoryPercentage >
            alertLevel[node.data.deviceAlias].mem[0] ||
          nodeData.traffic > alertLevel[node.data.deviceAlias].traffic[0]
        ) {
          categoryMap[deviceCategory[node.data.deviceType]][1] += 1;
          const nodeEffect = {
            classes: 'effect WARNING',
            data: {
              id: `effect-${node.data.id}`,
              nodeSize: node.data.nodeSize * 1.15,
            },
            position: node.position,
          };
          newNodeEffects.push(nodeEffect);

          // Warning push message
          if (
            nodeData.cpuProcessor > alertLevel[node.data.deviceAlias].cpu[0] &&
            pushOptions.includes('CPU')
          ) {
            pushMessage += `CPU 경고(${nodeData.cpuProcessor}%) `;
            needPush = true;
          }
          if (
            nodeData.usedDiskPercentage >
              alertLevel[node.data.deviceAlias].disk[0] &&
            pushOptions.includes('DISK')
          ) {
            pushMessage += `DISK 경고(${nodeData.usedDiskPercentage}%) `;
            needPush = true;
          }
          if (
            nodeData.usedMemoryPercentage >
              alertLevel[node.data.deviceAlias].mem[0] &&
            pushOptions.includes('MEM')
          ) {
            pushMessage += `MEM 경고(${nodeData.cpuProcessor}%) `;
            needPush = true;
          }
          if (
            nodeData.traffic > alertLevel[node.data.deviceAlias].traffic[0] &&
            pushOptions.includes('Traffic')
          ) {
            pushMessage += `traffic 경고(${formatBytes(
              nodeData.cpuProcessor,
            )}) `;
            needPush = true;
          }
        } else {
          const nodeEffect = {
            classes: 'effect NORMAL',
            data: {
              id: `effect-${node.data.id}`,
              nodeSize: node.data.nodeSize * 1.15,
            },
            position: node.position,
          };
          newNodeEffects.push(nodeEffect);
        }
        pushMessage += ']가 감지되었습니다.';

        if (monitorDevices?.includes(node.data.deviceAlias) && needPush) {
          newPushMessages.push(pushMessage);
        }
      }
    });

    setPushMessages((prev) => [...prev, ...newPushMessages]);
    setNodeEffects(newNodeEffects);

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
      Object.entries(MonitoringOptions).map(([key, value], idx) => {
        if (info[value] > alertLevel[deviceAlias][key][1]) {
          infoRow.push([idx === 0 ? formatBytes(info[value]) : info[value], 2]);
        } else if (info[value] > alertLevel[deviceAlias][key][0]) {
          infoRow.push([idx === 0 ? formatBytes(info[value]) : info[value], 1]);
        } else {
          infoRow.push([idx === 0 ? formatBytes(info[value]) : info[value], 0]);
        }
      });
      return infoRow;
    });

    // monitor device
    let monitorDeviceData = [];
    Object.entries(groupedData).forEach(([deviceId, items]) => {
      const deviceName = items[0].deviceAlias;
      if (monitorDevices?.includes(deviceName)) {
        let rowData = [[deviceName, 0]];
        let chartData = [];
        items.map((info) => {
          chartData.push(info[MonitoringOptions[monitorDeviceOption]]);
        });
        rowData.push([
          chartData[0].toString().length > 9
            ? formatBytes(chartData[0])
            : chartData[0],
          0,
        ]);
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
  }, frequency * 1000);

  // useTimeout(() => {
  //   handleNotification({
  //     title: 'ㅋㅋ',
  //     body: `${Date.now()}`,
  //     tag: `unique-${Date.now()}`,
  //   });
  // }, frequency * 5000);

  useEffect(() => {
    handleNotification({
      title: '모니터링 시작',
      body: '모니터링을 시작합니다!',
      icon: 'icon.png',
    });
  }, []);

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
  }, [topUsageOption, monitorDevices, monitorDeviceOption, frequency]);

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
    const cleanUpFunctions = tables.map((_, index) => {
      const element = document.getElementById(`table-${index}`);
      const dragHandle = document.getElementById(`drag-handle-${index}`);

      invariant(element, '해당 element가 존재하지 않습니다.');
      invariant(dragHandle, '해당 dragHandle이 존재하지 않습니다.');
      return combine(
        draggable({
          element,
          dragHandle,
          onDragStart: () => {
            dragIndexRef.current = index;
          },
        }),
        dropTargetForElements({
          element,
          onDrop: () => handleDrop(index),
        }),
      );
    });

    return () => {
      cleanUpFunctions.forEach((cleanup) => cleanup());
    };
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
          className="modal-large"
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
                    <span>{dataSourceTitle}</span>
                    <button
                      className="filter-toggling-btn"
                      onClick={() => {
                        setModalOpen(true);
                        handleModalOptionChange(table.source);
                      }}
                    >
                      <i className="bi bi-gear" />
                    </button>
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
