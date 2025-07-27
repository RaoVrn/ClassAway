import API from './api';
import { Placement } from '../types/placement';

export const fetchPlacements = async (): Promise<Placement[]> => {
  const res = await API.get('/placement');
  return res.data;
};


export const upsertPlacement = async (placement: Partial<Placement>): Promise<Placement> => {
  const res = await API.post('/placement', placement);
  return res.data;
};

export const deletePlacement = async (id: string): Promise<void> => {
  await API.delete(`/placement/${id}`);
};
