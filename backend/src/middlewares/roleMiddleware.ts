import { Request, Response, NextFunction } from 'express';
import { PerfilUsuario } from '@prisma/client';

export const roleMiddleware = (perfisPermitidos: PerfilUsuario[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.usuario) {
      res.status(401).json({ erro: 'Usuário não autenticado.' });
      return;
    }

    if (!perfisPermitidos.includes(req.usuario.perfil)) {
      res.status(403).json({ erro: 'Acesso negado: Perfil sem permissão para este recurso.' });
      return;
    }

    next();
  };
};
