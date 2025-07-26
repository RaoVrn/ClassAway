import API from './api';
import { Placement } from '../types/placement';

export const fetchPlacements = async (): Promise<Placement[]> => {
  const res = await API.get('/placement');
  return res.data;
};

export const upsertPlacement = async (company: string, status: string): Promise<Placement> => {
  const res = await API.post('/placement', { company, status });
  return res.data;
};
