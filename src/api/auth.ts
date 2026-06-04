import { apiClient } from '../lib/axios';
import type { LoginRequest, LoginResponse } from '../types';

export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  const response = await apiClient.post<LoginResponse>('/auth/login', data);
  return response.data;
};

// Resuelve el usuario del token — sin parámetros, el backend lo extrae del header JWT
export const getMe = async (): Promise<LoginResponse> => {
  const response = await apiClient.get<LoginResponse>('/auth/me');
  return response.data;
};
