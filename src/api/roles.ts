import { apiClient } from '../lib/axios';
import type { Rol } from '../types';

export const getRoles = async (): Promise<Rol[]> => {
  const response = await apiClient.get<Rol[]>('/roles');
  return response.data;
};

export const getRolById = async (id: number): Promise<Rol> => {
  const response = await apiClient.get<Rol>(`/roles/${id}`);
  return response.data;
};
