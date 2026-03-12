import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { getCitas, createCita, updateCita, deleteCita } from '../api/citas';
import type { CitaDto } from '../types';

export const useCitas = () =>
  useQuery({ queryKey: ['citas'], queryFn: getCitas });

export const useCreateCita = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CitaDto) => createCita(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['citas'] });
      toast.success('Cita creada exitosamente');
    },
    onError: (error: Error) => toast.error(error.message),
  });
};

export const useUpdateCita = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: CitaDto }) => updateCita(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['citas'] });
      toast.success('Cita actualizada exitosamente');
    },
    onError: (error: Error) => toast.error(error.message),
  });
};

export const useDeleteCita = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteCita(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['citas'] });
      toast.success('Cita eliminada exitosamente');
    },
    onError: (error: Error) => toast.error(error.message),
  });
};
