import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:9000/api/projects',
});

// Add token automatically to every request if exists
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const createProject = (data) => API.post('/create', data);
export const getTeamProjects = (teamId) => API.get(`/${teamId}`);
export const updateProject = (projectId, data) => API.put(`/${projectId}`, data);
export const deleteProject = (projectId) => API.delete(`/${projectId}`);
