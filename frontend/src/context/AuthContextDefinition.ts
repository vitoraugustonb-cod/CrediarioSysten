import { createContext } from 'react';
import type { Usuario, PerfilUsuario } from '../types/auth';

export interface AuthContextType {
  token: string | null;
  usuario: Usuario | null;
  isAuthenticated: boolean;
  login: (email: string, senha: string) => Promise<boolean>;
  demoLogin: (perfil: PerfilUsuario) => void;
  logout: () => void;
  error: string | null;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
