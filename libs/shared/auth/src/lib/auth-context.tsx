import { createContext, useContext } from 'react';
import type { AuthState } from './auth.types';

export const AuthContext = createContext<AuthState | null>(null);

export function useAuth(): AuthState {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }

  return context;
}
