import axios from 'axios';

// Development: use same-origin `/api` so Create React App's `package.json` "proxy" forwards to the backend (avoids cross-port CORS and mixed strict-browser cases). Production: full URL to Vercel.
const defaultBaseURL =
  process.env.NODE_ENV === 'production'
    ? 'https://event-management-system-sui.vercel.app/api'
    : '/api';

// CRA inlines REACT_APP_* only; npm scripts map VITE_API_URL -> REACT_APP_API_URL before build/start.
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || defaultBaseURL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
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

export default api;
