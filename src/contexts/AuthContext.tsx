// src/contexts/AuthContext.ts

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from 'react';
import { AuthenticatedUser, CredentialsDto } from '../core/domain/auth';
import { useCases } from '../application/providers';
import {
  LocalStorageTokenStorage,
  getAuthHeader,
} from '../application/use-cases/auth/tokenStorage';

interface AuthContextType {
  user: AuthenticatedUser | null;
  isAuthenticated: boolean;
  login: (credentials: CredentialsDto) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

const tokenStorage = new LocalStorageTokenStorage();

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthenticatedUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Al montar, intenta reconstruir sesión desde el token persistido
  useEffect(() => {
    let mounted = true;
    const checkCurrentUser = async () => {
      try {
        setLoading(true);
        const currentUser = await useCases.auth.getCurrentUser.execute();
        if (mounted) {
          setUser(currentUser || null);
        }
      } catch (error) {
        console.error('Error al verificar usuario actual:', error);
        if (mounted) setUser(null);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    checkCurrentUser();
    return () => {
      mounted = false;
    };
  }, []);

  const login = useCallback(async (credentials: CredentialsDto) => {
    setLoading(true);
    try {
      const authenticatedUser = await useCases.auth.login.execute(credentials);
      setUser(authenticatedUser);
      // se asume que el token ya fue persistido por el repositorio dentro del caso de uso
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      setUser(null);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
  setLoading(true);
  try {
    await useCases.auth.logout.execute();
    setUser(null);
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
    throw error;
  } finally {
    setLoading(false);
  }
}, []);

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};
