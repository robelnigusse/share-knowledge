// axiosInstance.js
import axios from 'axios';
import Cookies from 'js-cookie';

const authClient = axios.create({
  baseURL: 'http://localhost:8000/', 
  headers: {
    'Content-Type': 'application/json',
  },
});


authClient.interceptors.request.use(
  (config) => {
    const token = Cookies.get('token'); 
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default authClient;