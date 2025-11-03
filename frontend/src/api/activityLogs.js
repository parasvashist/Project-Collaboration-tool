import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:9000/api/activity',
});

// Add token automatically to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getAllLogs = () => API.get('/');
export const getEntityLogs = (entityType, entityId) => API.get(`/${entityType}/${entityId}`);


