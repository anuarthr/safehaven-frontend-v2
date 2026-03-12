import { apiClient } from '../lib/axios';
import type { Psicologo, RegistroPsicologoDto, ActualizarPsicologoDto } from '../types';

export const getPsicologos = async (): Promise<Psicologo[]> => {
  const response = await apiClient.get<Psicologo[]>('/psicologos');
  return response.data;
};

export const getPsicologoById = async (id: number): Promise<Psicologo> => {
  const response = await apiClient.get<Psicologo>(`/psicologos/${id}`);
  return response.data;
};

export const createPsicologo = async (data: RegistroPsicologoDto): Promise<Psicologo> => {
  const response = await apiClient.post<Psicologo>('/psicologos', data);
  return response.data;
};

export const updatePsicologo = async (id: number, data: ActualizarPsicologoDto): Promise<Psicologo> => {
  const response = await apiClient.put<Psicologo>(`/psicologos/${id}`, data);
  return response.data;
};

export const deletePsicologo = async (id: number): Promise<void> => {
  await apiClient.delete(`/psicologos/${id}`);
};
