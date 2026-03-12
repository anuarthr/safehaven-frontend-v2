import axios, { AxiosError } from 'axios';
import type { ApiErrorResponse } from '../types';

export const apiClient = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorResponse>) => {
    const message =
      error.response?.data?.message ??
      error.message ??
      'Ocurrió un error inesperado';
    return Promise.reject(new Error(message));
  }
);
