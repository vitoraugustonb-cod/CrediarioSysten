import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/jwt.js';
import { TokenPayload } from '../types/express.js';
import { prisma } from '../lib/prisma.js';

export const authMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  let token: string | undefined;

  // 1. Tenta extrair token do Cookie httpOnly
  if (req.cookies && (req.cookies.token || req.cookies['@crediario:token'])) {
    token = req.cookies.token || req.cookies['@crediario:token'];
  }

  // 2. Se não houver cookie, tenta o header Authorization: Bearer <token>
  if (!token && req.headers.authorization) {
    const parts = req.headers.authorization.split(' ');
    if (parts.length === 2 && parts[0] === 'Bearer') {
      token = parts[1];
    }
  }

  if (!token) {
    res.status(401).json({ erro: 'Token de autenticação não fornecido.' });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;

    // 3. Validação em tempo real no banco: usuário existe e está ativo?
    const usuarioBanco = await prisma.usuario.findUnique({
      where: { id: decoded.id },
      select: { id: true, nome: true, email: true, perfil: true, ativo: true }
    });

    if (!usuarioBanco) {
      res.status(401).json({ erro: 'Usuário não encontrado. Sessão inválida.' });
      return;
    }

    if (!usuarioBanco.ativo) {
      res.status(403).json({ erro: 'Acesso negado: Sua conta foi desativada pelo administrador.' });
      return;
    }

    req.usuario = {
      id: usuarioBanco.id,
      email: usuarioBanco.email,
      perfil: usuarioBanco.perfil,
      nome: usuarioBanco.nome
    };

    next();
  } catch (error) {
    res.status(401).json({ erro: 'Token inválido ou expirado. Por favor, faça login novamente.' });
    return;
  }
};
