import { PerfilUsuario } from '@prisma/client';

export interface TokenPayload {
  id: number;
  email: string;
  perfil: PerfilUsuario;
}

declare global {
  namespace Express {
    interface Request {
      usuario?: TokenPayload;
    }
  }
}
