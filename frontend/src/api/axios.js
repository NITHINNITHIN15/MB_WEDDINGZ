import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api', // ✅ point directly to backend
});

export default API;
