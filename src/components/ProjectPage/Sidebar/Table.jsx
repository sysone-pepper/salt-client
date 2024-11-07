import { useRef, useState, useEffect } from 'react';
import Row from './Row';
import invariant from 'tiny-invariant'; // 객체, 함수를 검증하고 falsy이면 에러를 반환시킴
import { draggable } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import './Sidebar.css';

const Table = ({ source }) => {
  const ref = useRef(null);
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    const el = ref.current;
    invariant(el);

    return draggable({
      element: el,
      getInitialData: () => ({ source }),
      onDragStart: () => setDragging(true),
      onDrop: () => setDragging(false),
    });
  }, [source]);

  return (
    <div className="table-container" ref={ref}>
      <div className="table-title">
        <p>{source.title}</p>
      </div>
      <div className="table-header">
        {source.columnAliases.map((alias, index) => (
          <p key={index} className="entity">
            {alias}
          </p>
        ))}
      </div>
      {source.data.map((rowData, index) => (
        <Row key={index} rowData={rowData} />
      ))}
    </div>
  );
};

export default Table;
