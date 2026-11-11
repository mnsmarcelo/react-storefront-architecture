import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider, useAuth } from '@react-storefront-architecture/auth';
import App from './app';

function Session() {
  const { user } = useAuth();
  return <output aria-label="Sessão">{user?.email ?? 'Sem sessão'}</output>;
}

describe('Login', () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    globalThis.fetch = jest.fn().mockResolvedValue({ ok: false, status: 401 });
    jest.spyOn(console, 'log').mockImplementation(() => undefined);
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
    jest.restoreAllMocks();
  });

  async function renderLogin() {
    render(
      <MemoryRouter
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <AuthProvider>
          <App />
          <Session />
        </AuthProvider>
      </MemoryRouter>,
    );
    await waitFor(() => expect(fetch).toHaveBeenCalledWith('/api/auth/me'));
  }

  it('exibe os campos, a opção de lembrar e o link de recuperação', async () => {
    await renderLogin();
    expect(screen.getByPlaceholderText('E-mail')).toBeTruthy();
    expect(screen.getByPlaceholderText('Senha')).toBeTruthy();
    expect((screen.getByRole('checkbox') as HTMLInputElement).checked).toBe(
      true,
    );
    expect(
      screen
        .getByRole('link', { name: 'Esqueceu a senha?' })
        .getAttribute('href'),
    ).toBe('/esqueci-senha');
  });

  it('valida campos obrigatórios sem autenticar', async () => {
    await renderLogin();
    fireEvent.click(screen.getByRole('button', { name: 'Entrar' }));
    expect(
      await screen.findByText('Por favor, insira seu e-mail!'),
    ).toBeTruthy();
    expect(
      await screen.findByText('Por favor, insira sua senha!'),
    ).toBeTruthy();
    expect(screen.getByLabelText('Sessão').textContent).toBe('Sem sessão');
  });

  it('exige a senha mesmo quando o e-mail está preenchido', async () => {
    await renderLogin();
    fireEvent.change(screen.getByPlaceholderText('E-mail'), {
      target: { value: 'teste@empresa.com' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Entrar' }));
    expect(
      await screen.findByText('Por favor, insira sua senha!'),
    ).toBeTruthy();
    expect(screen.queryByText('Por favor, insira seu e-mail!')).toBeNull();
    expect(screen.getByLabelText('Sessão').textContent).toBe('Sem sessão');
  });

  it('atualiza a sessão com o usuário simulado ao enviar credenciais', async () => {
    await renderLogin();
    fireEvent.change(screen.getByPlaceholderText('E-mail'), {
      target: { value: 'teste@empresa.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Senha'), {
      target: { value: 'senha-teste' },
    });
    fireEvent.click(screen.getByRole('checkbox'));
    expect((screen.getByRole('checkbox') as HTMLInputElement).checked).toBe(
      false,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Entrar' }));
    await waitFor(() =>
      expect(screen.getByLabelText('Sessão').textContent).toBe(
        'teste@empresa.com',
      ),
    );
  });

  it('rejeita um e-mail inválido sem autenticar', async () => {
    await renderLogin();
    fireEvent.change(screen.getByPlaceholderText('E-mail'), {
      target: { value: 'email-invalido' },
    });
    fireEvent.change(screen.getByPlaceholderText('Senha'), {
      target: { value: 'senha-teste' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Entrar' }));
    expect(
      await screen.findByText('Por favor, insira um e-mail válido!'),
    ).toBeTruthy();
    expect(screen.getByLabelText('Sessão').textContent).toBe('Sem sessão');
  });
});
