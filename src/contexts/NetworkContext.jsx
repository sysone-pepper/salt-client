import React, { createContext, useState, useRef } from 'react';
import * as api from '../api/Graph';

export const NetworkContext = createContext();

export function NetworkProvider({ children }) {
  const cyRef = useRef(null);
  const [curProjectId, setCurProjectId] = useState();
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);

  const [isLinking, setIsLinking] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [curModalType, setCurModalType] = useState('');
  const [isResizable, setisResizable] = useState(true);
  const [isUngroupNeeded, setIsUngroupNeeded] = useState(false);
  const [selectedSize, setSelectedSize] = useState('20');

  const fetchMapData = async () => {
    const { nodes, edges } = await api.fetchDiagramData(curProjectId);
    const newNodes = [
      {
        group: 'nodes',
        data: { id: 'background', src: null },
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

    console.log(input);

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

  return (
    <NetworkContext.Provider
      value={{
        createNodeId,
        createLink,
        fetchMapData,
        updateNode,
        cyRef,
        curProjectId,
        setCurProjectId,
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
        isUngroupNeeded,
        setIsUngroupNeeded,
        selectedSize,
        setSelectedSize,
      }}
    >
      {children}
    </NetworkContext.Provider>
  );
}
