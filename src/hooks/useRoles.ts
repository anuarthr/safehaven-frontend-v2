import { useQuery } from '@tanstack/react-query';
import { getRoles } from '../api/roles';

export const useRoles = () =>
  useQuery({ queryKey: ['roles'], queryFn: getRoles });

export const useRolNombre = (rolId: number): string => {
  const { data: roles } = useRoles();
  return roles?.find((r) => r.id === rolId)?.nombre ?? `Rol ${rolId}`;
};
