import React, { createContext, useState, useEffect, useRef } from 'react';

export const NetworkContext = createContext();

export function NetworkProvider({ children }) {
  const cyRef = useRef(null);
  const [nodes, setNodes] = useState([
    {
      group: 'nodes',
      data: { id: 'background', src: null },
      position: { x: 400, y: 300 }, // 캔버스의 중앙 위치 (적절히 조정 가능)
      locked: true,
    },
    {
      group: 'nodes',
      data: { id: 'other', deviceType: 'UPS' },
      classes: 'object device',
    },
    {
      group: 'nodes',
      data: { id: 'parent', label: 'parent' },
      classes: 'group',
    },
    {
      group: 'nodes',
      data: {
        id: 'child1',
        parent: 'parent',
        deviceType: 'Server',
      },
      width: 100,
      height: 100,
      classes: 'object device fixedAspectRatioResizeMode', // 가로세로비율 1대1로 리사이징하기 위한 클래스 적용
    }, // 자식 노드 1
    {
      group: 'nodes',
      data: {
        id: 'child2',
        parent: 'parent',
        deviceType: 'Network',
      },
      width: 100,
      height: 100,
      classes: 'object device fixedAspectRatioResizeMode', // 가로세로비율 1대1로 리사이징하기 위한 클래스 적용
      grabbable: true,
    },
  ]);
  const [edges, setEdges] = useState([
    {
      group: 'edges',
      data: {
        id: 'edge1',
        source: 'child1',
        target: 'child2',
      },
      classes: 'edge',
    },
  ]);
  const [isLinking, setIsLinking] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [curModalType, setCurModalType] = useState('');
  const [isResizable, setisResizable] = useState(true);

  return (
    <NetworkContext.Provider
      value={{
        cyRef,
        nodes,
        setNodes,
        edges,
        setEdges,
        isLinking,
        setIsLinking,
        isModalOpen,
        setIsModalOpen,
        curModalType,
        setCurModalType,
        isResizable,
        setisResizable,
      }}
    >
      {children}
    </NetworkContext.Provider>
  );
}
