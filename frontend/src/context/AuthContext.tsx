import React, { useCallback, useEffect, useState } from 'react';
import type { Usuario, PerfilUsuario } from '../types/auth';
import { AuthContext } from './AuthContextDefinition';
import { clearApiCache } from '../services/api';

const API_BASE_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');


const STORAGE_TOKEN_KEY = '@crediario:token';
const STORAGE_USER_KEY = '@crediario:usuario';
const MSG_SESSAO_EXPIRADA = 'Sua sessão expirou. Faça login novamente.';

// Verifica localmente se o JWT já venceu (tokens que não são JWT, como os de demo, são ignorados)
function tokenExpirado(token: string): boolean {
  try {
    const payloadBase64 = token.split('.')[1];
    if (!payloadBase64) return false;
    const json = atob(payloadBase64.replace(/-/g, '+').replace(/_/g, '/'));
    const { exp } = JSON.parse(json);
    return typeof exp === 'number' && exp * 1000 <= Date.now();
  } catch {
    return false;
  }
}

function limparStorage() {
  try {
    localStorage.removeItem(STORAGE_TOKEN_KEY);
    localStorage.removeItem(STORAGE_USER_KEY);
  } catch {}
}

// Lê a sessão salva, descartando-a se o token já estiver vencido
function lerSessaoSalva(): { token: string | null; usuario: Usuario | null; expirou: boolean } {
  try {
    const token = localStorage.getItem(STORAGE_TOKEN_KEY);
    const saved = localStorage.getItem(STORAGE_USER_KEY);
    if (token && tokenExpirado(token)) {
      limparStorage();
      return { token: null, usuario: null, expirou: true };
    }
    return { token, usuario: saved ? JSON.parse(saved) : null, expirou: false };
  } catch {
    return { token: null, usuario: null, expirou: false };
  }
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Inicializa o token e usuário a partir do localStorage para manter a sessão persistente
  const [sessaoInicial] = useState(lerSessaoSalva);
  const [token, setToken] = useState<string | null>(sessaoInicial.token);
  const [usuario, setUsuario] = useState<Usuario | null>(sessaoInicial.usuario);

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(
    sessaoInicial.expirou ? MSG_SESSAO_EXPIRADA : null
  );

  const login = async (email: string, senha: string): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      // Real API call to backend
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.erro || 'Falha ao realizar login');
      }

      setToken(data.token);
      setUsuario(data.usuario);

      // Salva no localStorage para persistência permanente
      try {
        localStorage.setItem(STORAGE_TOKEN_KEY, data.token);
        localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(data.usuario));
      } catch (storageErr) {
        console.warn('Não foi possível salvar no localStorage:', storageErr);
      }

      setLoading(false);
      return true;
    } catch (err: any) {
      console.error('Erro de autenticação:', err.message);
      setError(err.message || 'Erro de conexão com o servidor.');
      setLoading(false);
      return false;
    }
  };

  const demoLogin = (perfil: PerfilUsuario) => {
    setError(null);
    const mockToken = `mock-jwt-token-${Date.now()}-${perfil}`;
    
    let demoUser: Usuario;
    if (perfil === 'GERENTE') {
      demoUser = {
        id: 1,
        nome: 'Carlos Eduardo (Gerente)',
        email: 'gerente@crediario.com',
        perfil: 'GERENTE',
      };
    } else {
      demoUser = {
        id: 2,
        nome: 'Marcos Silva (Vendedor/Cobrador)',
        email: 'marcos.cobrador@crediario.com',
        perfil: 'VENDEDOR_COBRADOR',
      };
    }
    
    setUsuario(demoUser);
    setToken(mockToken);

    try {
      localStorage.setItem(STORAGE_TOKEN_KEY, mockToken);
      localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(demoUser));
    } catch {}
  };

  const logout = useCallback(() => {
    setToken(null);
    setUsuario(null);
    setError(null);
    clearApiCache();

    try {
      localStorage.removeItem(STORAGE_TOKEN_KEY);
      localStorage.removeItem(STORAGE_USER_KEY);
      fetch(`${API_BASE_URL}/logout`, { method: 'POST', credentials: 'include' }).catch(() => {});
    } catch {}
  }, []);

  // Escuta eventos disparados pela camada de API (services/api.ts)
  useEffect(() => {
    const onTokenRenovado = (e: Event) => {
      const novoToken = (e as CustomEvent<string>).detail;
      if (!novoToken) return;
      setToken(novoToken);
      try {
        localStorage.setItem(STORAGE_TOKEN_KEY, novoToken);
      } catch {}
    };

    const onSessaoExpirada = () => {
      logout();
      setError(MSG_SESSAO_EXPIRADA);
    };

    window.addEventListener('auth:token-renovado', onTokenRenovado);
    window.addEventListener('auth:sessao-expirada', onSessaoExpirada);
    return () => {
      window.removeEventListener('auth:token-renovado', onTokenRenovado);
      window.removeEventListener('auth:sessao-expirada', onSessaoExpirada);
    };
  }, [logout]);

  return (
    <AuthContext.Provider
      value={{
        token,
        usuario,
        isAuthenticated: !!token && !!usuario,
        login,
        demoLogin,
        logout,
        error,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
