import { type ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/authcontext';

interface ProtectedRouteProps {
  children: ReactNode;
  /** If provided, only users whose rol is in this list can access the route. Others are redirected to their dashboard. */
  roles?: number[];
}

const ProtectedRoute = ({ children, roles }: ProtectedRouteProps) => {
  const { isAuthenticated, usuario } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (roles && usuario && !roles.includes(usuario.rol)) {
    const redirectTo = usuario.rol === 4 ? '/dashboard' : '/dashboard-psicologo';
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
