// src/api/userRequestApi.js
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/requests",
});

// Gắn user token cho tất cả request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// --- API cho User ---
export const createRequestByUser = (data) => API.post("/user", data);
export const getMyRequests = () => API.get("/my");
