import React, { createContext, useState, useRef, useContext } from 'react';
import * as api from '../api/Diagram';
import defaultBG from '../assets/images/space.jpg';

export const NetworkContext = createContext(null);

export function NetworkProvider({ children }) {
  const cyRef = useRef(null);

  const [curProjectId, setCurProjectId] = useState();
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [existDevices, setExistDevices] = useState([]);
  const [bgImgInfo, setBgImgInfo] = useState({});
  const [dataReady, setDataReady] = useState(false);
  const [isLinking, setIsLinking] = useState(false);
  const [isObjectDelete, setIsObjectDelete] = useState(false);
  const [selectedSize, setSelectedSize] = useState(20);
  const [isNavigatorToggled, setIsNavigatorToggled] = useState(true);
  const [isSidebarPanned, setIsSidebarPanned] = useState(true);
  const [isEditingPermitted, setIsEditingPermitted] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const getImageSizeFromUrl = async (url) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const width = img.width;
        const height = img.height;
        resolve({ width, height });
      };
      img.onerror = reject;
      img.crossOrigin = 'anonymous';
      img.src = url;
    });
  };

  const fetchMapData = async () => {
    const { nodeSize, backgroundSource, nodes, edges } =
      await api.fetchDiagramData(curProjectId);

    setSelectedSize(nodeSize < 20 ? 20 : nodeSize);
    if (backgroundSource) {
      const size = await getImageSizeFromUrl(backgroundSource);
      setBgImgInfo({ src: backgroundSource, size });
    } else {
      const size = await getImageSizeFromUrl(defaultBG);
      setBgImgInfo({ src: defaultBG, size });
    }
    const newNodes = [
      {
        group: 'nodes',
        data: { id: 'background', src: '', size: {} },
        position: { x: 0, y: 0 }, // 캔버스의 중앙 위치 (적절히 조정 가능)
        locked: true,
        style: {
          'z-index': -1,
          'z-compound-depth': 'bottom',
          width: 800,
          height: 400,
          shape: 'rectangle',
          'background-color': '#424242',
          events: 'no',
        },
      },
      ...nodes,
    ];
    setNodes(newNodes);
    setEdges(edges);
  };

  const fetchExistDeviceInfo = async () => {
    const data = await api.fetchExistDevices(curProjectId);
    setExistDevices(data);
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
    if (res.success) {
      const size = await getImageSizeFromUrl(res.data);
      setBgImgInfo({ src: res.data, size });
    }
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
        fetchExistDeviceInfo,
        updateNode,
        updateNodeSize,
        updateBgImg,
        deleteObject,
        cyRef,
        curProjectId,
        setCurProjectId,
        bgImgInfo,
        setBgImgInfo,
        nodes,
        setNodes,
        edges,
        setEdges,
        existDevices,
        setExistDevices,
        dataReady,
        setDataReady,
        isLinking,
        setIsLinking,
        isObjectDelete,
        setIsObjectDelete,
        selectedSize,
        setSelectedSize,
        isNavigatorToggled,
        setIsNavigatorToggled,
        isSidebarPanned,
        setIsSidebarPanned,
        isEditingPermitted,
        setIsEditingPermitted,
        isEditing,
        setIsEditing,
      }}
    >
      {children}
    </NetworkContext.Provider>
  );
}
