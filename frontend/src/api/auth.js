import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:9000/api/auth',
});

// Add token automatically to every request if exists
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const signupUser = (data) => API.post('/signup', data);
export const loginUser = (data) => API.post('/login', data);
export const getCurrentUser = () => API.get('/me');
