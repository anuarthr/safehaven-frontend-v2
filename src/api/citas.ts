import { apiClient } from '../lib/axios';
import type { Cita, CitaDto } from '../types';

export const getCitas = async (): Promise<Cita[]> => {
  const response = await apiClient.get<Cita[]>('/citas');
  return response.data;
};

export const getCitaById = async (id: number): Promise<Cita> => {
  const response = await apiClient.get<Cita>(`/citas/${id}`);
  return response.data;
};

export const createCita = async (data: CitaDto): Promise<Cita> => {
  const response = await apiClient.post<Cita>('/citas', data);
  return response.data;
};

export const updateCita = async (id: number, data: CitaDto): Promise<Cita> => {
  const response = await apiClient.put<Cita>(`/citas/${id}`, data);
  return response.data;
};

export const deleteCita = async (id: number): Promise<void> => {
  await apiClient.delete(`/citas/${id}`);
};
