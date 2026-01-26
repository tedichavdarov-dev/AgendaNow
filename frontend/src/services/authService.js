import apiClient from "./baseService";

export const registerUser = (userData) => {
  return apiClient.post("/register", userData);
};

export const loginUser = (userData) => {
  return apiClient.post("/login", userData);
};