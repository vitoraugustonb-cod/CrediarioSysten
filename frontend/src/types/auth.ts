export type PerfilUsuario = 'GERENTE' | 'VENDEDOR_COBRADOR';

export interface Usuario {
  id: number;
  nome: string;
  email: string;
  perfil: PerfilUsuario;
}

export interface AuthState {
  token: string | null;
  usuario: Usuario | null;
  isAuthenticated: boolean;
}

export type StatusParcela = 'PENDENTE' | 'PAGA' | 'ATRASADA' | 'PARCIAL';
