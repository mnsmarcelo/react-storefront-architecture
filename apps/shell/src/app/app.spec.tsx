import { Suspense } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { loadRemote } from '@module-federation/enhanced/runtime';
import App from './app';

jest.mock('@module-federation/enhanced/runtime', () => ({
  loadRemote: jest.fn(),
}));

const user = {
  id: '123',
  name: 'Teste',
  email: 'teste@empresa.com',
  permissions: ['CARD_READ'],
};

const originalFetch = globalThis.fetch;

beforeEach(() => {
  globalThis.fetch = jest.fn().mockResolvedValue({ ok: false, status: 401 });
  jest
    .mocked(loadRemote)
    .mockResolvedValue({ default: () => <h1>Login remoto</h1> });
});

afterEach(() => {
  globalThis.fetch = originalFetch;
  jest.restoreAllMocks();
});

function renderShell(path = '/') {
  return render(
    <MemoryRouter
      initialEntries={[path]}
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <Suspense fallback={<p>Carregando módulo...</p>}>
        <App />
      </Suspense>
    </MemoryRouter>,
  );
}

describe('Shell', () => {
  it('exibe a navegação e solicita login para uma sessão não autenticada', async () => {
    renderShell();
    expect(
      screen.getByRole('link', { name: 'Home' }).getAttribute('href'),
    ).toBe('/');
    expect(
      screen.getByRole('link', { name: 'Login' }).getAttribute('href'),
    ).toBe('/login');
    expect(await screen.findByRole('button', { name: 'Entrar' })).toBeTruthy();
    expect(
      screen.queryByRole('heading', { name: /Welcome shell/i }),
    ).toBeNull();
    expect(loadRemote).not.toHaveBeenCalled();
  });

  it('exibe a home quando a API restaura uma sessão autenticada', async () => {
    jest
      .mocked(fetch)
      .mockResolvedValue({ ok: true, json: async () => user } as Response);
    renderShell();
    expect(
      await screen.findByRole('heading', { name: /Welcome shell/i }),
    ).toBeTruthy();
    expect(fetch).toHaveBeenCalledWith('/api/auth/me');
    expect(screen.queryByRole('button', { name: 'Entrar' })).toBeNull();
  });

  it('carrega o microfrontend na rota de login sem acessar um servidor remoto', async () => {
    renderShell('/login');
    expect(
      await screen.findByRole('heading', { name: 'Login remoto' }),
    ).toBeTruthy();
    expect(loadRemote).toHaveBeenCalledWith('login/Module');
    await waitFor(() => expect(fetch).toHaveBeenCalledWith('/api/auth/me'));
  });
});
