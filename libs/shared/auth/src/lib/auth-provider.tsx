import {
  useState,
  useEffect,
  useCallback,
  useMemo,
  type ReactNode,
} from 'react';
import { AuthContext } from './auth-context';
import { keycloak } from './keycloak';
import type { User, AuthState } from './auth.types';

function currentUser(): User | null {
  const token = keycloak.tokenParsed;
  if (!keycloak.authenticated || !token?.sub) return null;
  return {
    id: token.sub,
    name: token.name ?? token.preferred_username ?? '',
    email: token.email ?? '',
    permissions: [
      ...new Set([
        ...(token.realm_access?.roles ?? []),
        ...(token.resource_access?.[keycloak.clientId ?? '']?.roles ?? []),
      ]),
    ],
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(currentUser);
  const [loading, setLoading] = useState(false);
  const refreshSession = useCallback(async () => {
    setLoading(true);
    try {
      if (keycloak.authenticated) await keycloak.updateToken(30);
      setUser(currentUser());
    } catch (error) {
      keycloak.clearToken();
      setUser(null);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    const syncUser = () => setUser(currentUser());
    keycloak.onAuthSuccess = syncUser;
    keycloak.onAuthRefreshSuccess = syncUser;
    keycloak.onAuthLogout = syncUser;
    keycloak.onTokenExpired = () => {
      refreshSession().catch(console.error);
    };
    return () => {
      keycloak.onAuthSuccess = undefined;
      keycloak.onAuthRefreshSuccess = undefined;
      keycloak.onAuthLogout = undefined;
      keycloak.onTokenExpired = undefined;
    };
  }, [refreshSession]);
  const login = useCallback(() => {
    keycloak
      .login({ redirectUri: window.location.origin + '/' })
      .catch(console.error);
  }, []);
  const logout = useCallback(() => {
    keycloak
      .logout({ redirectUri: window.location.origin + '/' })
      .catch(console.error);
  }, []);
  const value = useMemo<AuthState>(
    () => ({
      user,
      loading,
      authenticated: !!user,
      login,
      logout,
      refreshSession,
    }),
    [user, loading, login, logout, refreshSession],
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
