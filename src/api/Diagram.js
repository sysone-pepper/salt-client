import api from './index';

export const fetchDiagramData = async (projectId) => {
  const response = await api.get(`/api/v1/diagrams/${projectId}`);
  let backgroundSource = null;
  let nodeSize = 0;
  const nodes = response.data.data.nodes.map((data, idx) => {
    let nodeData = {
      ...data,
      id: Number(data.nodeId),
    };
    delete nodeData.positionX;
    delete nodeData.positionY;
    if (nodeData.nodeType === 'TEXT') {
      const defaultSize = Number(nodeData.nodeSize);
      const avgWidth = {
        korean: defaultSize * 1, // 한글은 보통 정사각형에 가깝게 표현
        english: defaultSize * 0.6, // 영어는 상대적으로 좁음
        number: defaultSize * 0.6, // 숫자도 영어와 비슷한 폭
      };

      let calculatedWidth = 0;
      for (const char of nodeData.textContent) {
        if (/[가-힣ㄱ-ㅎㅏ-ㅣ]/.test(char)) {
          calculatedWidth += avgWidth.korean;
        } else if (/[a-zA-Z]/.test(char)) {
          calculatedWidth += avgWidth.english;
        } else if (/[0-9]/.test(char)) {
          calculatedWidth += avgWidth.number;
        } else {
          calculatedWidth += avgWidth.english;
        }
      }
      nodeData.calculatedWidth = calculatedWidth;
    }
    if (idx === 0) {
      backgroundSource = data.bgImgUrl;
      nodeSize = data.nodeSize;
    }
    return {
      classes: `object ${nodeData.nodeType}`,
      data: { ...nodeData },
      position: { x: data.positionX, y: data.positionY },
    };
  });

  const edges = response.data.data.links.map((data) => {
    return {
      data: {
        id: `edge-${data.linkId}`,
        source: data.startNodeId,
        target: data.endNodeId,
      },
    };
  });

  return { nodeSize, backgroundSource, nodes, edges };
};

export const fetchDeviceInfos = async (projectId, limit = 1) => {
  try {
    const response = await api.get(
      `api/v1/diagrams/${projectId}/exist-device?limit=${limit}`,
    );
    // console.log(response);
    return response.data.data;
  } catch (e) {
    console.log(e);
  }
};

export const fetchExistDevices = async (projectId) => {
  try {
    // 추후 회사(또는 유저)단위로 조회할 수 있는 장비를 분리해야함
    const response = await api.get('api/v1/diagrams/exist-device');
    return response.data.data;
  } catch (e) {
    console.log(e);
  }
};

export const createExistDeviceNode = async (nodeData) => {
  try {
    const response = await api.post('/api/v1/diagrams/exist-device', nodeData);
    return response.data.data;
  } catch (e) {
    console.log(e);
  }
};

export const createNewDeviceNode = async (nodeData) => {
  try {
    const response = await api.post('/api/v1/diagrams/new-device', nodeData);
    return response.data.data;
  } catch (e) {
    console.log(e);
  }
};

export const createTextNode = async (nodeData) => {
  try {
    const response = await api.post('/api/v1/diagrams/text', nodeData);
    return response.data.data;
  } catch (e) {
    console.log(e);
  }
};

export const createIconNode = async (nodeData) => {
  try {
    const response = await api.post('/api/v1/diagrams/icon', nodeData);
    return response.data.data;
  } catch (e) {
    console.log(e);
  }
};

export const createLink = async (linkData) => {
  const response = await api.post('/api/v1/diagrams/link', linkData);
  return response.data;
};

export const updateNodeSize = async (projectId, size) => {
  const response = await api.put(
    `/api/v1/diagrams/${projectId}/node/size?size=${size}`,
  );
  return response.data;
};

export const updateExistDeviceNode = async (nodeData) => {
  const response = await api.put('/api/v1/diagrams/exist-device', nodeData);
  return response.data;
};

export const updateNewDeviceNode = async (nodeData) => {
  const response = await api.put('/api/v1/diagrams/new-device', nodeData);
  return response.data;
};

export const updateTextNode = async (nodeData) => {
  const response = await api.put('/api/v1/diagrams/text', nodeData);
  return response.data;
};

export const updateIconNode = async (nodeData) => {
  const response = await api.put('/api/v1/diagrams/icon', nodeData);
  return response.data;
};

export const updateBgImg = async (projectId, file) => {
  const response = await api.put(`/api/v1/projects/${projectId}/bgImg`, file, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const updateDiagramThumbnail = async (projectId, formData) => {
  const response = await api.put(
    `/api/v1/projects/${projectId}/tnImg`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  );
  return response.data;
};

export const deleteNode = async (nodeId) => {
  const response = await api.delete(`/api/v1/diagrams/node/${nodeId}`);
  return response.data;
};

export const deleteLink = async (linkId) => {
  const response = await api.delete(`/api/v1/diagrams/link/${linkId}`);
  return response.data;
};
