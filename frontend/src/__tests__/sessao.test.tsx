// @vitest-environment jsdom
/**
 * Testes da sessão renovável no frontend (camada de API + AuthContext).
 * O fetch é simulado: nenhum servidor ou banco de dados é acessado.
 *
 * Rodar: npm test
 */
import { useContext } from 'react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, act, cleanup } from '@testing-library/react';
import { AuthProvider } from '../context/AuthContext';
import { AuthContext, type AuthContextType } from '../context/AuthContextDefinition';
import { getParcelas, clearApiCache } from '../services/api';

const TOKEN_KEY = '@crediario:token';
const USER_KEY = '@crediario:usuario';
const usuario = { id: 1, nome: 'Teste', email: 'teste@crediario.com', perfil: 'GERENTE' };

// Cria um JWT "fake" (só o payload importa para o frontend)
function jwtFake(expEmSegundos: number): string {
  const b64 = (o: object) => btoa(JSON.stringify(o)).replace(/=+$/, '').replace(/\+/g, '-').replace(/\//g, '_');
  const agora = Math.floor(Date.now() / 1000);
  return `${b64({ alg: 'HS256' })}.${b64({ id: 1, iat: agora, exp: agora + expEmSegundos })}.assinatura`;
}

function mockFetch(status: number, body: unknown, headers: Record<string, string> = {}) {
  const fn = vi.fn(async () => new Response(JSON.stringify(body), { status, headers }));
  vi.stubGlobal('fetch', fn);
  return fn;
}

// Renderiza o AuthProvider e expõe o contexto atual
function renderAuth() {
  const ref: { atual: AuthContextType | undefined } = { atual: undefined };
  const Espiao = () => {
    ref.atual = useContext(AuthContext);
    return null;
  };
  render(
    <AuthProvider>
      <Espiao />
    </AuthProvider>
  );
  return ref;
}

beforeEach(() => {
  localStorage.clear();
  clearApiCache();
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe('services/api - fetchWithAuth', () => {
  it('repassa o token renovado pelo backend (evento auth:token-renovado)', async () => {
    mockFetch(200, [], { 'X-Token-Renovado': 'token-novo-123' });
    const ouvinte = vi.fn();
    window.addEventListener('auth:token-renovado', ouvinte);

    await getParcelas('token-antigo', true);

    window.removeEventListener('auth:token-renovado', ouvinte);
    expect(ouvinte).toHaveBeenCalledTimes(1);
    expect((ouvinte.mock.calls[0][0] as CustomEvent).detail).toBe('token-novo-123');
  });

  it('em 401 dispara auth:sessao-expirada e lança mensagem amigável', async () => {
    mockFetch(401, { erro: 'Token inválido ou expirado.' });
    const ouvinte = vi.fn();
    window.addEventListener('auth:sessao-expirada', ouvinte);

    await expect(getParcelas('token-vencido', true)).rejects.toThrow('Sua sessão expirou');

    window.removeEventListener('auth:sessao-expirada', ouvinte);
    expect(ouvinte).toHaveBeenCalledTimes(1);
  });

  it('outros erros (ex.: 500) NÃO deslogam o usuário', async () => {
    mockFetch(500, { erro: 'Falha no servidor' });
    const ouvinte = vi.fn();
    window.addEventListener('auth:sessao-expirada', ouvinte);

    await expect(getParcelas('token-ok', true)).rejects.toThrow('Falha no servidor');

    window.removeEventListener('auth:sessao-expirada', ouvinte);
    expect(ouvinte).not.toHaveBeenCalled();
  });
});

describe('AuthContext', () => {
  it('ao abrir o app com token VENCIDO: vai para o login com aviso e limpa o storage', () => {
    localStorage.setItem(TOKEN_KEY, jwtFake(-60));
    localStorage.setItem(USER_KEY, JSON.stringify(usuario));

    const auth = renderAuth();

    expect(auth.atual!.isAuthenticated).toBe(false);
    expect(auth.atual!.error).toMatch(/sessão expirou/i);
    expect(localStorage.getItem(TOKEN_KEY)).toBeNull();
  });

  it('ao abrir o app com token VÁLIDO: continua logado', () => {
    const token = jwtFake(3 * 24 * 60 * 60);
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(usuario));

    const auth = renderAuth();

    expect(auth.atual!.isAuthenticated).toBe(true);
    expect(auth.atual!.token).toBe(token);
    expect(auth.atual!.error).toBeNull();
  });

  it('aplica o token renovado no contexto e no localStorage', () => {
    localStorage.setItem(TOKEN_KEY, jwtFake(60 * 60));
    localStorage.setItem(USER_KEY, JSON.stringify(usuario));
    const auth = renderAuth();

    act(() => {
      window.dispatchEvent(new CustomEvent('auth:token-renovado', { detail: 'token-renovado-xyz' }));
    });

    expect(auth.atual!.token).toBe('token-renovado-xyz');
    expect(localStorage.getItem(TOKEN_KEY)).toBe('token-renovado-xyz');
    expect(auth.atual!.isAuthenticated).toBe(true);
  });

  it('fluxo completo: requisição recebe 401 → usuário volta ao login com aviso', async () => {
    localStorage.setItem(TOKEN_KEY, jwtFake(60 * 60));
    localStorage.setItem(USER_KEY, JSON.stringify(usuario));
    const auth = renderAuth();
    expect(auth.atual!.isAuthenticated).toBe(true);

    mockFetch(401, { erro: 'Token inválido ou expirado.' });
    await act(async () => {
      await getParcelas(auth.atual!.token, true).catch(() => {});
    });

    expect(auth.atual!.isAuthenticated).toBe(false);
    expect(auth.atual!.error).toMatch(/sessão expirou/i);
    expect(localStorage.getItem(TOKEN_KEY)).toBeNull();
    expect(localStorage.getItem(USER_KEY)).toBeNull();
  });
});
