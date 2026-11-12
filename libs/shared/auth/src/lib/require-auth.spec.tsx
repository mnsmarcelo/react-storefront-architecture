import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { AuthContext } from './auth-context';
import type { AuthState } from './auth.types';
import { RequireAuth } from './require-auth';

afterEach(cleanup);

function renderProtected(overrides: Partial<AuthState> = {}) {
  const state: AuthState = {
    user: null,
    loading: false,
    authenticated: false,
    login: vi.fn(),
    logout: vi.fn(),
    refreshSession: vi.fn(),

    ...overrides,
  };
  render(
    <AuthContext.Provider value={state}>
      <RequireAuth>
        <p>Conteúdo privado</p>
      </RequireAuth>
    </AuthContext.Provider>,
  );
  return state;
}

describe('RequireAuth', () => {
  it('aguarda a consulta da sessão antes de exibir conteúdo', () => {
    renderProtected({ loading: true });
    expect(screen.getByText('Verificando sessão...')).toBeTruthy();
    expect(screen.queryByText('Conteúdo privado')).toBeNull();
    expect(screen.queryByRole('button')).toBeNull();
  });

  it('oferece login quando não hÃ¡ autenticaÃ§Ã£o', () => {
    const state = renderProtected();
    expect(screen.queryByText('Conteúdo privado')).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Entrar' }));
    expect(state.login).toHaveBeenCalledOnce();
  });

  it('exibe conteúdo para uma sessão autenticada', () => {
    renderProtected({ authenticated: true });
    expect(screen.getByText('Conteúdo privado')).toBeTruthy();
    expect(screen.queryByRole('button')).toBeNull();
  });
});
