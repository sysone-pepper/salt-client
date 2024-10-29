import api from './index';

export const createUserAPI = async (userData) => {
  const response = await api.post('api/v1/users', userData);
  return response.data;
};
