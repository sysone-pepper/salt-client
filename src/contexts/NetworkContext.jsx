import React, { createContext, useState, useRef } from 'react';
import * as api from '../api/Graph';

export const NetworkContext = createContext();

export function NetworkProvider({ children }) {
  const cyRef = useRef(null);
  const [curProjectId, setCurProjectId] = useState();
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [bgImg, setBgImg] = useState(null);

  const [isLinking, setIsLinking] = useState(false);
  const [isObjectDelete, setIsObjectDelete] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState('20');
  const [isNavigatorToggled, setIsNavigatorToggled] = useState(true);

  const fetchMapData = async () => {
    const { backgroundSource, nodes, edges } = await api.fetchDiagramData(
      curProjectId,
    );
    console.log(backgroundSource);
    const newNodes = [
      {
        group: 'nodes',
        data: { id: 'background', src: backgroundSource },
        position: { x: 400, y: 300 }, // 캔버스의 중앙 위치 (적절히 조정 가능)
        locked: true,
      },
      ...nodes,
    ];
    setNodes(newNodes);
    setEdges(edges);
  };

  const createNodeId = async (nodeData) => {
    const input = {
      projectId: curProjectId,
      ...nodeData,
    };
    let nodeId;

    switch (nodeData.nodeType) {
      case 'NEW_DEVICE':
        nodeId = await api.createNewDeviceNode(input);
        break;
      case 'EXIST_DEVICE':
        nodeId = await api.createExistDeviceNode(input);
        break;
      case 'ICON':
        nodeId = await api.createIconNode(input);
        break;
      case 'TEXT':
        nodeId = await api.createTextNode(input);
        break;
    }
    return nodeId;
  };

  const updateNode = async (updatedNode) => {
    const input = {
      ...updatedNode.data,
      nodeId: updatedNode.data.id,
      positionX: updatedNode.position.x,
      positionY: updatedNode.position.y,
    };

    // API 호출
    switch (input.nodeType) {
      case 'NEW_DEVICE':
        await api.updateNewDeviceNode(input);
        break;
      case 'EXIST_DEVICE':
        await api.updateExistDeviceNode(input);
        break;
      case 'ICON':
        await api.updateIconNode(input);
        break;
      case 'TEXT':
        await api.updateTextNode(input);
        break;
    }

    // nodes 상태 업데이트
    setNodes((prevNodes) =>
      prevNodes.map((node) =>
        node.data.id === updatedNode.data.id ? updatedNode : node,
      ),
    );
  };

  const createLink = async (source, target) => {
    const input = {
      startNodeId: source.data.id,
      endNodeId: target.data.id,
    };
    const res = await api.createLink(input);
    console.log(res);
    return res.data;
  };

  const updateBgImg = async (file) => {
    const res = await api.updateBgImg(curProjectId, file);
    return res;
  };

  return (
    <NetworkContext.Provider
      value={{
        createNodeId,
        createLink,
        fetchMapData,
        updateNode,
        updateBgImg,
        cyRef,
        curProjectId,
        setCurProjectId,
        nodes,
        setNodes,
        edges,
        setEdges,
        isLinking,
        setIsLinking,
        isObjectDelete,
        setIsObjectDelete,
        isModalOpen,
        setIsModalOpen,
        selectedSize,
        setSelectedSize,
        isNavigatorToggled,
        setIsNavigatorToggled,
      }}
    >
      {children}
    </NetworkContext.Provider>
  );
}
