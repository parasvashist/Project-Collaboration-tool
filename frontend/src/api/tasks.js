import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:9000/api/tasks',
});

// Add token automatically to every request if exists
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const createTask = (data) => API.post('/create', data);
export const getProjectTasks = (projectId) => API.get(`/${projectId}`);
export const updateTask = (taskId, data) => API.put(`/${taskId}`, data);
export const deleteTask = (taskId) => API.delete(`/${taskId}`);
export const updateTaskStatus = (taskId, status) => API.patch(`/${taskId}/status`, { status });