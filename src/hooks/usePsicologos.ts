import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import {
  getPsicologos,
  getPsicologoById,
  createPsicologo,
  updatePsicologo,
  deletePsicologo,
} from '../api/psicologos';
import type { RegistroPsicologoDto, ActualizarPsicologoDto } from '../types';

export const usePsicologos = () =>
  useQuery({ queryKey: ['psicologos'], queryFn: getPsicologos });

export const usePsicologo = (id: number) =>
  useQuery({
    queryKey: ['psicologos', id],
    queryFn: () => getPsicologoById(id),
    enabled: id > 0,
  });

export const useCreatePsicologo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: RegistroPsicologoDto) => createPsicologo(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['psicologos'] });
      toast.success('Psicólogo creado exitosamente');
    },
    onError: (error: Error) => toast.error(error.message),
  });
};

export const useUpdatePsicologo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: ActualizarPsicologoDto }) =>
      updatePsicologo(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['psicologos'] });
      toast.success('Psicólogo actualizado exitosamente');
    },
    onError: (error: Error) => toast.error(error.message),
  });
};

export const useDeletePsicologo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deletePsicologo(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['psicologos'] });
      toast.success('Psicólogo eliminado exitosamente');
    },
    onError: (error: Error) => toast.error(error.message),
  });
};
