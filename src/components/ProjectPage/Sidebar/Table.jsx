import { useRef, useState, useEffect } from 'react';
import Row from './Row';
import invariant from 'tiny-invariant'; // 객체, 함수를 검증하고 falsy이면 에러를 반환시킴
import { draggable } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import './Sidebar.css';

const Table = ({ location, source }) => {
  const ref = useRef(null);
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    const el = ref.current;
    invariant(el);

    return draggable({
      element: el,
      getInitialData: () => ({ location, source }),
      onDragStart: () => setDragging(true),
      onDrop: () => setDragging(false),
    });
  }, []);

  return (
    <table className="table-container" ref={ref}>
      <caption className="table-title">{source.title}</caption>
      <thead>
        <tr className="table-header">
          {source.columnAliases.map((alias, index) => (
            <th key={index} className="table-field">
              {alias}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {source.data.map((rowData, index) => (
          <Row key={index} rowData={rowData} />
        ))}
      </tbody>
    </table>
  );
};

export default Table;
