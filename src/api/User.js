import api from './index';

export const addUserAPI = async (userData) => {
  const response = await api.post('api/v1/users', userData);
  return response.data;
};

export const getUsers = async () => {
  const response = await api.get('/api/v1/users');
  return response;
};

export const deleteUserAPI = async (username) => {
  const response = await api.delete(`/api/v1/users/${username}`);
  return response.data;
};
