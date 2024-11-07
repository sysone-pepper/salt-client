import { useRef, useState, useEffect } from 'react';
import invariant from 'tiny-invariant';
import { dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';

const DropTarget = ({ location, children }) => {
  const ref = useRef(null);
  const [isDraggedOver, setIsDraggedOver] = useState(false);

  useEffect(() => {
    const el = ref.current;
    invariant(el);

    return dropTargetForElements({
      element: el,
      getData: () => ({ location }),
      onDragEnter: () => setIsDraggedOver(true),
      onDragLeave: () => setIsDraggedOver(false),
      onDrop: () => setIsDraggedOver(false),
      canDrop: () => true,
    });
  }, [location]);
  return (
    <div
      style={{ backgroundColor: isDraggedOver ? 'lightgreen' : '' }}
      ref={ref}
    >
      {children}
    </div>
  );
};

export default DropTarget;
