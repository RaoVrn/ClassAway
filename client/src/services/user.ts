import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

export const getProfile = async (token: string) => {
  const res = await API.get('/auth/profile', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const updateProfile = async (data: any, token: string) => {
  const res = await API.put('/auth/profile', data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
