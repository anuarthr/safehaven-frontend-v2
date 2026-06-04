import { createContext, useContext, useState, useEffect, useMemo, type ReactNode } from 'react';
import type { LoginResponse, UsuarioSesion } from '../types';
import { getMe } from '../api/auth';

interface AuthContextType {
  usuario: UsuarioSesion | null;
  isLoading: boolean;
  login: (response: LoginResponse) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [usuario, setUsuario] = useState<UsuarioSesion | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Al montar: si hay token guardado, validarlo con /auth/me y rehydratar sesión
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setIsLoading(false);
      return;
    }

    getMe()
      .then(({ token: _t, ...userData }) => {
        setUsuario(userData);
      })
      .catch(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
      })
      .finally(() => setIsLoading(false));
  }, []);

  const login = ({ token, ...userData }: LoginResponse) => {
    if (token) localStorage.setItem('token', token);
    setUsuario(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    setUsuario(null);
  };

  const value = useMemo(
    () => ({ usuario, isLoading, login, logout, isAuthenticated: !!usuario }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [usuario, isLoading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
