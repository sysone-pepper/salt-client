import React, { createContext, useState, useRef } from 'react';
import * as api from '../api/Diagram';

export const NetworkContext = createContext();

export function NetworkProvider({ children }) {
  const cyRef = useRef(null);
  const [curProjectId, setCurProjectId] = useState();
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [bgImg, setBgImg] = useState(null);
  const [dataReady, setDataReady] = useState(false);
  const [isLinking, setIsLinking] = useState(false);
  const [isObjectDelete, setIsObjectDelete] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState(20);
  const [isNavigatorToggled, setIsNavigatorToggled] = useState(true);

  const fetchMapData = async () => {
    const { nodeSize, backgroundSource, nodes, edges } =
      await api.fetchDiagramData(curProjectId);

    setSelectedSize(nodeSize < 20 ? 20 : nodeSize);
    const newNodes = [
      {
        group: 'nodes',
        data: { id: 'background' },
        position: { x: 400, y: 300 }, // 캔버스의 중앙 위치 (적절히 조정 가능)
        locked: true,
      },
      ...nodes,
    ];
    setBgImg(backgroundSource);
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

    setNodes((prevNodes) =>
      prevNodes.map((node) =>
        node.data.id === updatedNode.data.id ? updatedNode : node,
      ),
    );
  };

  const updateNodeSize = async () => {
    if (selectedSize >= 20) {
      const res = await api.updateNodeSize(curProjectId, selectedSize);
      if (res.success) {
        const updatedNodes = [...nodes].map((node, idx) => {
          if (idx > 0) {
            node.data.nodeSize = Number(selectedSize);
          }
          return node;
        });
        setNodes(updatedNodes);
      }
    }
  };

  const createLink = async (startNodeId, endNodeId) => {
    const input = {
      startNodeId,
      endNodeId,
    };
    const res = await api.createLink(input);
    return res.data;
  };

  const updateBgImg = async (file) => {
    const res = await api.updateBgImg(curProjectId, file);
    setBgImg(res.data);
  };

  const deleteObject = async (obj) => {
    let res;
    if (obj.data.id.startsWith('edge')) {
      const linkId = obj.data.id.split('-')[1];
      res = await api.deleteLink(linkId);
      if (res.success) {
        const newEdges = edges.filter(
          (edge) => edge.data.id !== `edge-${linkId}`,
        );
        setEdges(newEdges);
      }
    } else {
      const nodeId = obj.data.id;
      res = await api.deleteNode(nodeId);
      if (res.success) {
        const updatedEdges = [];
        for (const edge of edges) {
          if (edge.data.source === nodeId || edge.data.target === nodeId) {
            const linkId = edge.data.id.split('-')[1];
            const res = await api.deleteLink(linkId);
            if (!res.success) {
              updatedEdges.push(edge);
            }
          } else {
            updatedEdges.push(edge);
          }
        }
        setEdges(updatedEdges);
        const newNodes = nodes.filter((node) => node.data.id !== nodeId);
        setNodes(newNodes);
      }
    }
  };

  return (
    <NetworkContext.Provider
      value={{
        createNodeId,
        createLink,
        fetchMapData,
        updateNode,
        updateNodeSize,
        updateBgImg,
        deleteObject,
        cyRef,
        curProjectId,
        setCurProjectId,
        bgImg,
        setBgImg,
        nodes,
        setNodes,
        edges,
        setEdges,
        dataReady,
        setDataReady,
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
