import { createContext, useContext, useState, type ReactNode } from 'react';
import type { UsuarioSesion } from '../types';

interface AuthContextType {
  usuario: UsuarioSesion | null;
  login: (userData: UsuarioSesion) => void;
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

const getUsuarioFromStorage = (): UsuarioSesion | null => {
  try {
    const raw = localStorage.getItem('usuario');
    return raw ? (JSON.parse(raw) as UsuarioSesion) : null;
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [usuario, setUsuario] = useState<UsuarioSesion | null>(getUsuarioFromStorage);

  const login = (userData: UsuarioSesion) => {
    localStorage.setItem('usuario', JSON.stringify(userData));
    setUsuario(userData);
  };

  const logout = () => {
    localStorage.removeItem('usuario');
    setUsuario(null);
  };

  return (
    <AuthContext.Provider value={{ usuario, login, logout, isAuthenticated: !!usuario }}>
      {children}
    </AuthContext.Provider>
  );
};

