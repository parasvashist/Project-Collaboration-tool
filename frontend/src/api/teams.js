import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:9000/api/teams',
});

// Add token automatically to every request if exists
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const createTeam = (data) => API.post('/create', data);
export const joinTeam = (data) => API.post('/join', data);
export const getUserTeams = () => API.get('/my-teams');