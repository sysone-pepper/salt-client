import api from "./index";

export const getProjects = async () => {
  const response = await api.get("/api/v1/projects");
  return response.data;
};

export const createProjectAPI = async (projectData) => {
  const response = await api.post("/api/v1/projects", projectData);
  return response.data;
};

export const deleteProjectAPI = async (id) => {
  const response = await api.delete(`/api/v1/projects/${id}`);
  return response.data;
};
