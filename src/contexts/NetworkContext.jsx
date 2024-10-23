import React, { createContext, useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom/client"; // react-dom/client에서 가져옵니다.
import { CustomDeviceNode } from "../components/ProjectPage/CustomDeviceNode";

export const NetworkContext = createContext();

export function NetworkProvider({ children }) {
  const [nodes, setNodes] = useState([
    {
      group: "nodes",
      data: { id: "background", src: null },
      position: { x: 400, y: 300 }, // 캔버스의 중앙 위치 (적절히 조정 가능)
      style: {
        "z-index": 0, // 최하단에 위치하도록 설정
      },
    },
    {
      data: { id: "other", deviceType: "UPS" },
      classes: "object device",
    },
    {
      data: { id: "parent", label: "parent" },
      classes: "group",
    },
    {
      data: {
        id: "child1",
        parent: "parent",
        deviceType: "Server",
      },
      width: 100,
      height: 100,
      classes: "object device fixedAspectRatioResizeMode", // 가로세로비율 1대1로 리사이징하기 위한 클래스 적용
    }, // 자식 노드 1
    {
      data: {
        id: "child2",
        parent: "parent",
        deviceType: "Network",
      },
      width: 100,
      height: 100,
      classes: "object device fixedAspectRatioResizeMode", // 가로세로비율 1대1로 리사이징하기 위한 클래스 적용
      grabbable: true,
    },
  ]);
  const [links, setLinks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [curModalType, setCurModalType] = useState("");

  return (
    <NetworkContext.Provider
      value={{
        nodes,
        setNodes,
        links,
        setLinks,
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
