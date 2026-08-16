import React, { useState } from 'react';
import type { Usuario, PerfilUsuario } from '../types/auth';
import { AuthContext } from './AuthContextDefinition';

const API_BASE_URL = 'http://localhost:3300';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Token stored in React memory context as requested
  const [token, setToken] = useState<string | null>(null);
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (email: string, senha: string): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      // Attempt real API call to backend port 3300
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
    
    if (perfil === 'GERENTE') {
      setUsuario({
        id: 1,
        nome: 'Carlos Eduardo (Gerente)',
        email: 'gerente@crediario.com',
        perfil: 'GERENTE',
      });
    } else {
      setUsuario({
        id: 2,
        nome: 'Marcos Silva (Vendedor/Cobrador)',
        email: 'marcos.cobrador@crediario.com',
        perfil: 'VENDEDOR_COBRADOR',
      });
    }
    
    setToken(mockToken);
  };

  const logout = () => {
    setToken(null);
    setUsuario(null);
    setError(null);
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
