// utils/axiosConfig.ts
import axios from "axios";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_API_URL; //added this line 08/08/2025

// Attach Authorization header if token exists (enables header-based auth fallback)
axios.interceptors.request.use((config) => {
  try {
    const token = localStorage.getItem("auth_token");
    if (token && !config.headers?.Authorization) {
      config.headers = {
        ...(config.headers || {}),
        Authorization: `Bearer ${token}`,
      };
    }
  } catch {}

  config.params = {
    ...config.params,
    client_id: import.meta.env.VITE_CLIENT_ID, // store in .env
  };
  return config;
});

// Store token from auth responses when provided by server
axios.interceptors.response.use(
  (response) => {
    try {
      const maybeToken = response?.data?.token;
      if (maybeToken) {
        localStorage.setItem("auth_token", maybeToken);
      }
    } catch {}
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);
//14/08/2025

export default axios;
