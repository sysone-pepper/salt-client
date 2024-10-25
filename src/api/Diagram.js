import api from "./index";

export const getProjects = async () => {
  const response = await api.get("/api/v1/diagram");
  return response.data;
};
