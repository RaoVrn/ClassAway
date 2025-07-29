// src/services/auth.ts
import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

export const registerUser = (userData: { name: string; email: string; password: string }) =>
  API.post('/auth/register', userData);

export const loginUser = (userData: { email: string; password: string }) =>
  API.post('/auth/login', userData);
