import api from './index';

export const getDeviceData = async (deviceId, limit = 10) => {
  try {
    const response = await api.get(
      `/api/v1/diagrams/exist-device/${deviceId}?limit=${limit}`,
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching device usage data:', error);
    throw error;
  }
};
