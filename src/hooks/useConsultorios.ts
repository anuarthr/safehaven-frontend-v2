import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import {
  getConsultorios,
  createConsultorio,
  updateConsultorio,
  deleteConsultorio,
} from '../api/consultorios';
import type { ConsultorioDto } from '../types';

export const useConsultorios = () =>
  useQuery({ queryKey: ['consultorios'], queryFn: getConsultorios });

export const useCreateConsultorio = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ConsultorioDto) => createConsultorio(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['consultorios'] });
      toast.success('Consultorio creado exitosamente');
    },
    onError: (error: Error) => toast.error(error.message),
  });
};

export const useUpdateConsultorio = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: ConsultorioDto }) =>
      updateConsultorio(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['consultorios'] });
      toast.success('Consultorio actualizado exitosamente');
    },
    onError: (error: Error) => toast.error(error.message),
  });
};

export const useDeleteConsultorio = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteConsultorio(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['consultorios'] });
      toast.success('Consultorio eliminado exitosamente');
    },
    onError: (error: Error) => toast.error(error.message),
  });
};
