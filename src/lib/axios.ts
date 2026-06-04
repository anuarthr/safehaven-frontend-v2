import axios, { AxiosError } from 'axios';
import type { ApiErrorResponse } from '../types';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Adjunta el token JWT en cada petición protegida
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorResponse>) => {
    const status = error.response?.status;
    const message =
      error.response?.data?.message ??
      error.message ??
      'Ocurrió un error inesperado';

    if (status === 401) {
      // Token inválido o expirado: limpiar sesión y redirigir a login
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
      if (!globalThis.location.pathname.includes('/login')) {
        globalThis.location.href = '/login';
      }
    }
    // 403: autenticado pero sin permisos — NO cerrar sesión, solo rechazar con el error

    return Promise.reject(new Error(message));
  },
);
