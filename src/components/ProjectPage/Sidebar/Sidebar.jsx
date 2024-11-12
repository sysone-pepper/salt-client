import { useState, useEffect, useRef, useContext } from 'react';
import Table from './Table';
import { tableCategory } from './data.js';
import {
  draggable,
  dropTargetForElements,
} from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { NetworkContext } from '../../../contexts/NetworkContext.jsx';

import './Sidebar.css';

const tableLookup = {
  deviceStatus: (row) => (
    <Table source={tableCategory.deviceStatus} key={row} />
  ),
  topTrafficUsage: (row) => (
    <Table source={tableCategory.topTrafficUsage} key={row} />
  ),
  deviceTraffic: (row) => (
    <Table source={tableCategory.deviceTraffic} key={row} />
  ),
};

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
      if (element) {
        draggable({
          element,
          onDragStart: () => {
            dragIndexRef.current = index;
          },
        });
      }
    });
  }, [tables]);

  useEffect(() => {
    tables.forEach((_, index) => {
      const element = document.getElementById(`table-${index}`);
      if (element) {
        dropTargetForElements({
          element,
          onDrop: () => handleDrop(index),
        });
      }
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
              {tableLookup[table.source](index)}
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
};

export default Sidebar;
