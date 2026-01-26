import apiClient from "./baseService";

export const getEspacios = (type) => {
  const url = type ? `/espacios?type=${type}` : "/espacios";
  return apiClient.get(url);
};

export const getEspacioById = (id) => {
  return apiClient.get(`/espacios/${id}`);
};

export const createEspacio = (espacioData) => {
  return apiClient.post("/espacios", espacioData);
};

export const updateEspacio = (id, espacioData) => {
  return apiClient.patch(`/espacios/${id}`, espacioData);
};

export const deleteEspacio = (id) => {
  return apiClient.delete(`/espacios/${id}`);
};