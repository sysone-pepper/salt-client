import { useState, useEffect, useRef, useContext } from 'react';
import {
  draggable,
  dropTargetForElements,
} from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import invariant from 'tiny-invariant';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { NetworkContext } from '../../../contexts/NetworkContext.jsx';
import Table from './Table';
import { tableCategory } from './data.js';
import './Sidebar.css';
import { Modal } from '../../common/Modal.jsx';
import { CreateNodeContent } from '../ModalContents/CreateNodeContent.jsx';

const Sidebar = () => {
  const { isSidebarPanned } = useContext(NetworkContext);
  const [modalContentName, setModalContentName] = useState(null);

  const [tables, setTables] = useState([
    { source: 'deviceStatus' },
    { source: 'topTrafficUsage' },
    { source: 'deviceTraffic' },
  ]);

  const dragIndexRef = useRef(null);

  const sidebarModals = {
    deviceStatus: (onModalClose) => (
      <CreateNodeContent closeModal={() => onModalClose()} />
    ),
    topTrafficUsage: (onModalClose) => (
      <CreateNodeContent closeModal={() => onModalClose()} />
    ),
    deviceTraffic: (onModalClose) => (
      <CreateNodeContent closeModal={() => onModalClose()} />
    ),
  };

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
              const dataSource = tableCategory[tableSource];
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
                        <i class="bi bi-gear" />
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
    </>
  );
};

export default Sidebar;
