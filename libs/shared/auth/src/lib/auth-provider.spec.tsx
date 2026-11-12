import { act, cleanup, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { AuthProvider } from './auth-provider';
import { useAuth } from './auth-context';
import { keycloak } from './keycloak';

vi.mock('./keycloak', () => ({
  keycloak: {
    authenticated: false,
    tokenParsed: undefined,
    clientId: 'frontend-shell',
    updateToken: vi.fn().mockResolvedValue(false),
    clearToken: vi.fn(),
    login: vi.fn().mockResolvedValue(undefined),
    logout: vi.fn().mockResolvedValue(undefined),
  },
}));
beforeEach(() => {
  vi.clearAllMocks();
  keycloak.authenticated = false;
  keycloak.tokenParsed = undefined;
});
afterEach(cleanup);

describe('AuthProvider', () => {
  it('restaura o usuário e as roles do token', () => {
    keycloak.authenticated = true;
    keycloak.tokenParsed = {
      sub: '123',
      name: 'Teste',
      email: 'teste@empresa.com',
      realm_access: { roles: ['READ'] },
      resource_access: { 'frontend-shell': { roles: ['READ', 'CREATE'] } },
    };
    const { result } = renderHook(useAuth, { wrapper: AuthProvider });
    expect(result.current.user).toEqual({
      id: '123',
      name: 'Teste',
      email: 'teste@empresa.com',
      permissions: ['READ', 'CREATE'],
    });
    expect(result.current.authenticated).toBe(true);
  });
  it('permanece anônimo sem sessão e delega login/logout ao Keycloak', () => {
    const { result } = renderHook(useAuth, { wrapper: AuthProvider });
    expect(result.current.authenticated).toBe(false);
    result.current.login();
    result.current.logout();
    expect(keycloak.login).toHaveBeenCalledWith({
      redirectUri: window.location.origin + '/',
    });
    expect(keycloak.logout).toHaveBeenCalledWith({
      redirectUri: window.location.origin + '/',
    });
  });
  it('limpa o usuário se a renovação falhar', async () => {
    keycloak.authenticated = true;
    keycloak.tokenParsed = { sub: '123' };
    vi.mocked(keycloak.updateToken).mockRejectedValueOnce(
      new Error('Sessão expirada'),
    );
    const { result } = renderHook(useAuth, { wrapper: AuthProvider });
    await act(async () => {
      await expect(result.current.refreshSession()).rejects.toThrow(
        'Sessão expirada',
      );
    });
    expect(keycloak.clearToken).toHaveBeenCalled();
    expect(result.current.user).toBeNull();
    expect(result.current.loading).toBe(false);
  });
  it('renova o token expirado e remove callbacks ao desmontar', async () => {
    keycloak.authenticated = true;
    keycloak.tokenParsed = { sub: '123' };
    const { unmount } = renderHook(useAuth, { wrapper: AuthProvider });
    await act(async () => {
      keycloak.onTokenExpired?.();
    });
    expect(keycloak.updateToken).toHaveBeenCalledWith(30);
    unmount();
    expect(keycloak.onTokenExpired).toBeUndefined();
  });
});
