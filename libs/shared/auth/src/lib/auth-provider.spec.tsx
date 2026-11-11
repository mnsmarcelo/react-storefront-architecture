import { act, cleanup, renderHook, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { AuthProvider } from './auth-provider';
import { useAuth } from './auth-context';
import type { User } from './auth.types';

const user: User = {
  id: '123',
  name: 'Teste',
  email: 'teste@empresa.com',
  permissions: ['CARD_READ'],
};

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('AuthProvider', () => {
  it('restaura a sessão retornada pela API', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue({ ok: true, json: async () => user });
    vi.stubGlobal('fetch', fetchMock);
    const { result } = renderHook(useAuth, { wrapper: AuthProvider });
    expect(result.current.loading).toBe(true);
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(fetchMock).toHaveBeenCalledWith('/api/auth/me');
    expect(result.current.user).toEqual(user);
    expect(result.current.authenticated).toBe(true);
  });

  it('limpa a sessão quando uma atualização retorna 401', async () => {
    vi.stubGlobal(
      'fetch',
      vi
        .fn()
        .mockResolvedValueOnce({ ok: true, json: async () => user })
        .mockResolvedValueOnce({ ok: false, status: 401 }),
    );
    const { result } = renderHook(useAuth, { wrapper: AuthProvider });
    await waitFor(() => expect(result.current.authenticated).toBe(true));
    await act(async () => {
      await result.current.refreshSession();
    });
    expect(result.current.user).toBeNull();
    expect(result.current.authenticated).toBe(false);
    expect(result.current.loading).toBe(false);
  });

  it('encerra o carregamento e registra falhas de rede', async () => {
    const error = new Error('Sem conexão');
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(error));
    const logError = vi
      .spyOn(console, 'error')
      .mockImplementation(() => undefined);
    const { result } = renderHook(useAuth, { wrapper: AuthProvider });
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.authenticated).toBe(false);
    expect(logError).toHaveBeenCalledWith(error);
  });

  it('exige que useAuth esteja dentro do provider', () => {
    expect(() => renderHook(useAuth)).toThrow(
      'useAuth deve ser usado dentro de AuthProvider',
    );
  });
});
