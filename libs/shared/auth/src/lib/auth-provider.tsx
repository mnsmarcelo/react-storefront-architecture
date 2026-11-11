import {
  useState,
  useEffect,
  useCallback,
  useMemo,
  type ReactNode,
} from 'react';

import { AuthContext } from './auth-context';
import type { User, AuthState } from './auth.types';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const refreshSession = useCallback(async () => {
    setLoading(true);

    try {
      const response = await fetch('/api/auth/me');

      if (!response.ok) {
        if (response.status === 401) {
          setUser(null);
          return;
        }

        throw new Error('Erro ao consultar sessão');
      }

      const data: User = await response.json();
      setUser(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshSession().catch(console.error);
  }, [refreshSession]);

  const login = useCallback(() => {
    window.location.assign('/login');
  }, []);

  const logout = useCallback(() => {
    window.location.assign('/auth/logout');
  }, []);

  const value = useMemo<AuthState>(
    () => ({
      user,
      loading,
      authenticated: !!user,
      login,
      logout,
      refreshSession,
      setUser,
    }),
    [user, loading, login, logout, refreshSession],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
