import { act, fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { keycloak } from '@react-storefront-architecture/auth';
import App from './app';

jest.mock('keycloak-js', () =>
  jest.fn().mockImplementation(() => ({
    authenticated: false,
    tokenParsed: undefined,
    login: jest.fn().mockResolvedValue(undefined),
    logout: jest.fn().mockResolvedValue(undefined),
  })),
);

beforeEach(() => {
  jest.clearAllMocks();
  keycloak.authenticated = false;
  keycloak.tokenParsed = undefined;
});

function renderShell() {
  return render(
    <MemoryRouter
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <App />
    </MemoryRouter>,
  );
}

describe('Shell', () => {
  it('oferece login pelo Keycloak no cabeçalho quando não autenticado', async () => {
    await act(async () => {
      renderShell();
    });
    const header = within(screen.getByRole('banner'));
    expect(
      header.getByRole('link', { name: 'Home' }).getAttribute('href'),
    ).toBe('/');
    fireEvent.click(header.getByRole('button', { name: 'Entrar' }));
    expect(keycloak.login).toHaveBeenCalledWith({
      redirectUri: window.location.origin + '/',
    });
    expect(
      screen.queryByRole('heading', { name: /Welcome shell/i }),
    ).toBeNull();
    expect(screen.queryByRole('link', { name: 'Login' })).toBeNull();
  });

  it('substitui Entrar pelo nome do usuário autenticado e permite sair', async () => {
    keycloak.authenticated = true;
    keycloak.tokenParsed = {
      sub: '123',
      name: 'Maria Silva',
      email: 'maria@empresa.com',
    };
    await act(async () => {
      renderShell();
    });
    const header = within(screen.getByRole('banner'));
    expect(header.getByText('Maria Silva')).toBeTruthy();
    expect(header.queryByRole('button', { name: 'Entrar' })).toBeNull();
    expect(
      screen.getByRole('heading', { name: /Welcome shell/i }),
    ).toBeTruthy();
    fireEvent.click(header.getByRole('button', { name: 'Sair' }));
    expect(keycloak.logout).toHaveBeenCalledWith({
      redirectUri: window.location.origin + '/',
    });
  });
});
