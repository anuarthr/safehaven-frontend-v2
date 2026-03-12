import { apiClient } from '../lib/axios';
import type { Administrador, RegistroAdministradorDto, ActualizarAdministradorDto } from '../types';

export const getAdministradores = async (): Promise<Administrador[]> => {
  const response = await apiClient.get<Administrador[]>('/administradores');
  return response.data;
};

export const getAdministradorById = async (id: number): Promise<Administrador> => {
  const response = await apiClient.get<Administrador>(`/administradores/${id}`);
  return response.data;
};

export const createAdministrador = async (data: RegistroAdministradorDto): Promise<Administrador> => {
  const response = await apiClient.post<Administrador>('/administradores', data);
  return response.data;
};

export const updateAdministrador = async (id: number, data: ActualizarAdministradorDto): Promise<Administrador> => {
  const response = await apiClient.put<Administrador>(`/administradores/${id}`, data);
  return response.data;
};

export const deleteAdministrador = async (id: number): Promise<void> => {
  await apiClient.delete(`/administradores/${id}`);
};
