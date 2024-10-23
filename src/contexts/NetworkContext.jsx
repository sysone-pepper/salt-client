import React, { createContext, useState, useEffect, useRef } from "react";

export const NetworkContext = createContext();

export function NetworkProvider({ children }) {
  const cyRef = useRef(null);
  const [nodes, setNodes] = useState([
    {
      group: "nodes",
      data: { id: "background", src: null },
      position: { x: 400, y: 300 }, // 캔버스의 중앙 위치 (적절히 조정 가능)
      locked: true,
    },
    {
      group: "nodes",
      data: { id: "other", deviceType: "UPS" },
      classes: "object device",
    },
    {
      group: "nodes",
      data: { id: "parent", label: "parent" },
      classes: "group",
    },
    {
      group: "nodes",
      data: {
        id: "child1",
        parent: "parent",
        deviceType: "Server",
      },
      classes: "object device",
    }, // 자식 노드 1
    {
      group: "nodes",
      data: {
        id: "child2",
        parent: "parent",
        deviceType: "Network",
      },
      classes: "object device",
      grabbable: true,
    },
  ]);
  const [edges, setEdges] = useState([
    {
      group: "edges",
      data: {
        id: "edge1",
        source: "child1",
        target: "child2",
      },
      classes: "edge",
    },
  ]);
  const [isLinking, setIsLinking] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [curModalType, setCurModalType] = useState("");

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
      }}
    >
      {children}
    </NetworkContext.Provider>
  );
}
