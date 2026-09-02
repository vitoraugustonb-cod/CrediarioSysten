import React, { useState } from 'react';
import type { Usuario, PerfilUsuario } from '../types/auth';
import { AuthContext } from './AuthContextDefinition';

const API_BASE_URL = '';

const STORAGE_TOKEN_KEY = '@crediario:token';
const STORAGE_USER_KEY = '@crediario:usuario';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Inicializa o token e usuário a partir do localStorage para manter a sessão persistente
  const [token, setToken] = useState<string | null>(() => {
    try {
      return localStorage.getItem(STORAGE_TOKEN_KEY);
    } catch {
      return null;
    }
  });

  const [usuario, setUsuario] = useState<Usuario | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_USER_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (email: string, senha: string): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      // Real API call to backend
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
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

  const logout = () => {
    setToken(null);
    setUsuario(null);
    setError(null);

    try {
      localStorage.removeItem(STORAGE_TOKEN_KEY);
      localStorage.removeItem(STORAGE_USER_KEY);
    } catch {}
  };

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
