// src/api/adminRequestApi.js
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/requests",
});

// Gắn admin token cho tất cả request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("adminToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// --- API cho Admin ---
export const getRequests = () => API.get("/");
export const getRequestById = (id) => API.get(`/${id}`);
export const createRequest = (data) => API.post("/", data);
export const updateRequest = (id, data) => API.put(`/${id}`, data);
export const deleteRequest = (id) => API.delete(`/${id}`);
//API mới
export const toggleHidden = (id) => API.patch(`/${id}/toggle-hidden`);
