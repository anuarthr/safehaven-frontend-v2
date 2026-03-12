import { apiClient } from '../lib/axios';
import type { Consultorio, ConsultorioDto } from '../types';

export const getConsultorios = async (): Promise<Consultorio[]> => {
  const response = await apiClient.get<Consultorio[]>('/consultorios');
  return response.data;
};

export const getConsultorioById = async (id: number): Promise<Consultorio> => {
  const response = await apiClient.get<Consultorio>(`/consultorios/${id}`);
  return response.data;
};

export const createConsultorio = async (data: ConsultorioDto): Promise<Consultorio> => {
  const response = await apiClient.post<Consultorio>('/consultorios', data);
  return response.data;
};

export const updateConsultorio = async (id: number, data: ConsultorioDto): Promise<Consultorio> => {
  const response = await apiClient.put<Consultorio>(`/consultorios/${id}`, data);
  return response.data;
};

export const deleteConsultorio = async (id: number): Promise<void> => {
  await apiClient.delete(`/consultorios/${id}`);
};
