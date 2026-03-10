import axios from "axios";

const URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: URL,
  withCredentials: true, 
});

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      
      if (error.config.url.includes("/me")) {
        console.warn("Auth check: No active session (User is a guest).");
      } else {
        console.error("Session expired or unauthorized access.");
      }
    }

    return Promise.reject(error);
  }
);

export default api;