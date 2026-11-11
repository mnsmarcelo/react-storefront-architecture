import type { ReactNode } from 'react';
import { useAuth } from './auth-context';

export function RequireAuth({ children }: { children: ReactNode }) {
  const { loading, authenticated, login } = useAuth();

  if (loading) return <p>Verificando sessão...</p>;

  if (!authenticated) {
    return <button onClick={login}>Entrar</button>;
  }

  return <>{children}</>;
}
