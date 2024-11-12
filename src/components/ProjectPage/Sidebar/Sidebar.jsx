import { useState, useEffect, useRef, useContext } from 'react';
import {
  draggable,
  dropTargetForElements,
} from '@atlaskit/pragmatic-drag-and-drop/element/adapter';

import invariant from 'tiny-invariant';

import { NetworkContext } from '../../../contexts/NetworkContext.jsx';
import Table from './Table';
import { tableCategory } from './data.js';
import './Sidebar.css';

const Sidebar = () => {
  const { isSidebarPanned } = useContext(NetworkContext);

  const [tables, setTables] = useState([
    { source: 'deviceStatus' },
    { source: 'topTrafficUsage' },
    { source: 'deviceTraffic' },
  ]);

  const dragIndexRef = useRef(null);
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

  return (
    <div
      className={`sidebar-wrapper${
        isSidebarPanned ? ' expanded' : ' collapsed'
      }`}
    >
      <aside className="sidebar">
        <ul className="table-list">
          {tables.map((table, index) => (
            <li key={index} id={`table-${index}`}>
              <div
                id={`drag-handle-${index}`}
                className="drag-handle table-title"
              >
                <p>{'\u22EE\u22EE'}</p>
                <p>{tableCategory[table.source].title}</p>
              </div>
              <div className="sidebar-element">
                <Table source={tableCategory[table.source]} key={index} />
              </div>
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
};

export default Sidebar;
