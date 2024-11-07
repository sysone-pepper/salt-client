import { useState, useEffect, useRef } from 'react';
import Table from './Table';
import { tableCategory } from './data.js';
import { monitorForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import DropTarget from './Droptarget.jsx';

const tableLookup = {
  deviceStatus: (location) => (
    <Table location={location} source={tableCategory.deviceStatus} />
  ),
  topTrafficUsage: (location) => (
    <Table location={location} source={tableCategory.topTrafficUsage} />
  ),
  deviceTraffic: (location) => (
    <Table location={location} source={tableCategory.deviceTraffic} />
  ),
};

function isCoord(token) {
  return typeof token === 'number' && token >= 0 && token < 3;
}

function isEqualCoord(c1, c2) {
  return c1 === c2;
}

function renderDropTarget(tables) {
  const Droptargets = [];
  for (let row = 0; row < 8; row++) {
    const table = tables.find((table) => isEqualCoord(table.location, row));

    Droptargets.push(
      <DropTarget tables={tables} location={row}>
        {table && tableLookup[table.source] && tableLookup[table.source](row)}
      </DropTarget>,
    );
  }
  return Droptargets;
}

const Sidebar = () => {
  const [tables, setTables] = useState([
    { source: 'deviceStatus', location: 0 },
    { source: 'topTrafficUsage', location: 1 },
    { source: 'deviceTraffic', location: 2 },
  ]);

  useEffect(() => {
    return monitorForElements({
      onDrop({ source, location }) {
        const destination = location.current.dropTargets[0];
        if (!destination) return;

        const destinationLocation = destination.data.location;
        const sourceLocation = source.data.location;
        if (!isCoord(destinationLocation) || !isCoord(sourceLocation)) {
          return;
        }

        const draggedTableIndex = tables.findIndex((t) =>
          isEqualCoord(t.location, sourceLocation),
        );
        const droppedTableIndex = tables.findIndex((t) =>
          isEqualCoord(t.location, destinationLocation),
        );

        if (draggedTableIndex !== -1 && droppedTableIndex !== -1) {
          const newTables = [...tables];
          const [draggedTable] = newTables.splice(draggedTableIndex, 1);
          newTables.splice(droppedTableIndex, 0, draggedTable);
          setTables(newTables);
        }
      },
    });
  }, [tables]);

  return <div className="sidebar-content">{renderDropTarget(tables)}</div>;
};

export default Sidebar;
