import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api', // ✅ point directly to backend
});

// Add token to all requests if it exists
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("userToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
