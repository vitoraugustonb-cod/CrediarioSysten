import { PerfilUsuario } from '@prisma/client';

export interface TokenPayload {
  id: number;
  email: string;
  perfil: PerfilUsuario;
  nome?: string;
}

declare global {
  namespace Express {
    interface Request {
      usuario?: TokenPayload;
    }
  }
}
