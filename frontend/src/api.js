import axios from 'axios';

const defaultBaseURL =
  process.env.NODE_ENV === 'production'
    ? 'https://event-management-system-sui.onrender.com/api'
    : 'http://localhost:5000/api';

// CRA inlines REACT_APP_* only; npm scripts map VITE_API_URL -> REACT_APP_API_URL before build/start.
const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || defaultBaseURL,
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // redirect handled in components
    }
    return Promise.reject(error);
  }
);

export default API;
