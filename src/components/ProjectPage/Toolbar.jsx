import { NetworkContext } from '../../contexts/NetworkContext';

import { useContext, useEffect, useState } from 'react';

const Toolbar = () => {
  const {
    isSidebarPanned,
    setIsSidebarPanned,
    selectedSize,
    setSelectedSize,
    cyRef,
    curProjectId,
    nodes,
    updateNodeSize,
  } = useContext(NetworkContext);
  const [inputSize, setInputSize] = useState(20);

  // 노드 전체 크기 수정
  useEffect(() => {
    if (cyRef.current && curProjectId && selectedSize) {
      if (nodes.length > 1 && nodes[1].data.nodeSize !== selectedSize) {
        updateNodeSize();
      }
      setInputSize(selectedSize);
    }
  }, [selectedSize]);

  const handleSidebarButtonClick = () => {
    setIsSidebarPanned((prevState) => !prevState);
  };

  const handleSizeInputChange = (e) => {
    setInputSize(e.target.value);
  };

  const handleSizeButtonClick = () => {
    setSelectedSize(parseInt(inputSize, 10));
  };

  return (
    <div className="toolbar">
      <label htmlFor="sizeInput">노드 크기 조절</label>
      <input
        id="sizeInput"
        type="number"
        min="20"
        max="100"
        value={inputSize}
        onChange={handleSizeInputChange}
        placeholder="20 - 100"
      />
      <button className="toolbar-button" onClick={handleSizeButtonClick}>
        확인
      </button>
      <button className="toolbar-button" onClick={handleSidebarButtonClick}>
        사이드바 {isSidebarPanned ? '접기' : '펼치기'}
      </button>
    </div>
  );
};

export default Toolbar;
