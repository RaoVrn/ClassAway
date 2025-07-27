// Add OD with JSON payload (no file upload)
export const addOD = async (data: Partial<OD>): Promise<OD> => {
  const res = await API.post('/od', data);
  return res.data;
};
import API from './api';
import { OD } from '../types/od';

export const fetchODs = async (params?: any): Promise<OD[]> => {
  const res = await API.get('/od', { params });
  return res.data;
};

export const createOD = async (data: FormData): Promise<OD> => {
  const res = await API.post('/od', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
};

export const updateOD = async (id: string, data: Partial<OD>): Promise<OD> => {
  const res = await API.put(`/od/${id}`, data);
  return res.data;
};

export const deleteOD = async (id: string): Promise<void> => {
  await API.delete(`/od/${id}`);
};
