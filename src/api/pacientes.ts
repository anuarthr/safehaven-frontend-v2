import { apiClient } from '../lib/axios';
import type { Paciente, RegistroPacienteDto, ActualizarPacienteDto } from '../types';

export const getPacientes = async (): Promise<Paciente[]> => {
  const response = await apiClient.get<Paciente[]>('/pacientes');
  return response.data;
};

export const getPacienteById = async (id: number): Promise<Paciente> => {
  const response = await apiClient.get<Paciente>(`/pacientes/${id}`);
  return response.data;
};

export const createPaciente = async (data: RegistroPacienteDto): Promise<Paciente> => {
  const response = await apiClient.post<Paciente>('/pacientes', data);
  return response.data;
};

export const updatePaciente = async (id: number, data: ActualizarPacienteDto): Promise<Paciente> => {
  const response = await apiClient.put<Paciente>(`/pacientes/${id}`, data);
  return response.data;
};

export const deletePaciente = async (id: number): Promise<void> => {
  await apiClient.delete(`/pacientes/${id}`);
};
