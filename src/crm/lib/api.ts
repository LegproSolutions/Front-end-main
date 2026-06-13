import axios from 'axios';

// Default base URL for development backend
const API_BASE_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:5002'}/api/crm`;

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('jobmela_crm_token') || localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle global auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token and redirect to login (or handle as needed)
      sessionStorage.removeItem('jobmela_crm_token');
      sessionStorage.removeItem('jobmela_crm_user');
    }
    return Promise.reject(error);
  }
);
