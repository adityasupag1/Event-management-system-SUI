import axios from 'axios';

// Backend mounts all routes under /api (see server.js). Base URL must end with /api.
const normalizeApiBase = (raw) => {
  const trimmed = String(raw).trim().replace(/\/+$/, '');
  if (!trimmed) return '/api';
  return trimmed.endsWith('/api') ? trimmed : `${trimmed}/api`;
};

// In production, construct API URL from current domain or use explicit REACT_APP_API_URL
const getBaseURL = () => {
  if (process.env.NODE_ENV === 'production') {
    if (process.env.REACT_APP_API_URL) {
      return normalizeApiBase(process.env.REACT_APP_API_URL);
    }
    // Fallback: use current domain with /api path
    return `${window.location.origin}/api`;
  }
  return '/api';
};

const api = axios.create({
  baseURL: getBaseURL(),
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.clear();
    }
    return Promise.reject(err);
  }
);

export default api;