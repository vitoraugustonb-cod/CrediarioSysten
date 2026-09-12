import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma.js';
import { JWT_SECRET, JWT_EXPIRES_IN } from '../config/jwt.js';

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      res.status(400).json({ erro: 'E-mail e senha são obrigatórios.' });
      return;
    }

    const emailSanitizado = String(email).trim().toLowerCase();

    const usuario = await prisma.usuario.findUnique({
      where: { email: emailSanitizado }
    });

    if (!usuario) {
      console.warn(`[SEGURANÇA] Tentativa de login falha para e-mail inexistente: ${emailSanitizado}`);
      res.status(401).json({ erro: 'Credenciais inválidas.' });
      return;
    }

    if (!usuario.ativo) {
      console.warn(`[SEGURANÇA] Tentativa de login para conta inativa: ID ${usuario.id} (${emailSanitizado})`);
      res.status(403).json({ erro: 'Usuário inativo. Entre em contato com o gerente.' });
      return;
    }

    const senhaValida = await bcrypt.compare(String(senha), usuario.senhaHash);

    if (!senhaValida) {
      console.warn(`[SEGURANÇA] Tentativa de login com senha incorreta para: ${emailSanitizado}`);
      res.status(401).json({ erro: 'Credenciais inválidas.' });
      return;
    }

    const token = jwt.sign(
      { id: usuario.id, email: usuario.email, perfil: usuario.perfil, nome: usuario.nome },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN } as jwt.SignOptions
    );

    // Configurar Cookie httpOnly seguro para proteger contra ataques de XSS
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // 'none' permite cross-site no deploy com HTTPS na Vercel
      maxAge: 24 * 60 * 60 * 1000 // 24 horas
    });

    res.json({
      token,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        perfil: usuario.perfil
      }
    });
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ erro: 'Erro interno ao realizar login.' });
  }
};

export const logout = (req: Request, res: Response): void => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
  });
  res.json({ status: 'ok', message: 'Logout realizado com sucesso.' });
};
