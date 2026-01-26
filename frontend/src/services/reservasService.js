import apiClient from "./baseService";

export const getReservas = () => {
  return apiClient.get("/reservas");
};

export const getReservaById = (id) => {
  return apiClient.get(`/reservas/${id}`);
};

export const createReserva = (reservaData) => {
  return apiClient.post("/reservas", reservaData);
};

export const updateReserva = (id, reservaData) => {
  return apiClient.patch(`/reservas/${id}`, reservaData);
};

export const deleteReserva = (id) => {
  return apiClient.delete(`/reservas/${id}`);
};