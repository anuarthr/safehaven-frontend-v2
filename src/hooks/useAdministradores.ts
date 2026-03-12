import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import {
  getAdministradores,
  getAdministradorById,
  createAdministrador,
  updateAdministrador,
  deleteAdministrador,
} from '../api/administradores';
import type { RegistroAdministradorDto, ActualizarAdministradorDto } from '../types';

export const useAdministradores = () =>
  useQuery({ queryKey: ['administradores'], queryFn: getAdministradores });

export const useAdministrador = (id: number) =>
  useQuery({
    queryKey: ['administradores', id],
    queryFn: () => getAdministradorById(id),
    enabled: id > 0,
  });

export const useCreateAdministrador = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: RegistroAdministradorDto) => createAdministrador(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['administradores'] });
      toast.success('Administrador creado exitosamente');
    },
    onError: (error: Error) => toast.error(error.message),
  });
};

export const useUpdateAdministrador = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: ActualizarAdministradorDto }) =>
      updateAdministrador(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['administradores'] });
      toast.success('Administrador actualizado exitosamente');
    },
    onError: (error: Error) => toast.error(error.message),
  });
};

export const useDeleteAdministrador = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteAdministrador(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['administradores'] });
      toast.success('Administrador eliminado exitosamente');
    },
    onError: (error: Error) => toast.error(error.message),
  });
};
