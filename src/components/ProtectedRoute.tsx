import { type ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/authcontext';

interface ProtectedRouteProps {
  children: ReactNode;
  /** If provided, only users whose rol.id is in this list can access the route. Others are redirected to their dashboard. */
  roles?: number[];
}

const ProtectedRoute = ({ children, roles }: ProtectedRouteProps) => {
  const { isAuthenticated, usuario } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (roles && usuario && !roles.includes(usuario.rol.id)) {
    const redirectTo = usuario.rol.id === 4 ? '/dashboard' : '/dashboard-psicologo';
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
