import api from "./index";

export const createUser = async (userData) => {
  const response = await api.post("/register", userData);
  return response.data;
};
