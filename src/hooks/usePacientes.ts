import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import {
  getPacientes,
  getPacienteById,
  createPaciente,
  updatePaciente,
  deletePaciente,
} from '../api/pacientes';
import type { RegistroPacienteDto, ActualizarPacienteDto } from '../types';

export const usePacientes = () =>
  useQuery({ queryKey: ['pacientes'], queryFn: getPacientes });

export const usePaciente = (id: number) =>
  useQuery({
    queryKey: ['pacientes', id],
    queryFn: () => getPacienteById(id),
    enabled: id > 0,
  });

export const useCreatePaciente = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: RegistroPacienteDto) => createPaciente(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pacientes'] });
      toast.success('Paciente creado exitosamente');
    },
    onError: (error: Error) => toast.error(error.message),
  });
};

export const useUpdatePaciente = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: ActualizarPacienteDto }) =>
      updatePaciente(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pacientes'] });
      toast.success('Paciente actualizado exitosamente');
    },
    onError: (error: Error) => toast.error(error.message),
  });
};

export const useDeletePaciente = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deletePaciente(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pacientes'] });
      toast.success('Paciente eliminado exitosamente');
    },
    onError: (error: Error) => toast.error(error.message),
  });
};
