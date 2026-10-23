import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import type { Response } from 'express';
dotenv.config();

if (!process.env.JWT_SECRET && process.env.NODE_ENV === 'production') {
  throw new Error('FATAL: A variável de ambiente JWT_SECRET é obrigatória em produção.');
}

export const JWT_SECRET = process.env.JWT_SECRET || 'crediario_jwt_secret_dev_fallback_only';
// Sessão renovável: o token dura 7 dias e é renovado automaticamente enquanto o usuário usa o app.
// Na prática, só é preciso logar de novo após ~7 dias sem abrir o sistema.
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

// Header usado para devolver um token renovado ao frontend
export const HEADER_TOKEN_RENOVADO = 'X-Token-Renovado';

interface DadosToken {
  id: number;
  email: string;
  perfil: string;
  nome: string;
}

export function gerarToken(dados: DadosToken): string {
  return jwt.sign(
    { id: dados.id, email: dados.email, perfil: dados.perfil, nome: dados.nome },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN } as jwt.SignOptions
  );
}

const cookieBase = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  // 'none' permite cross-site no deploy com HTTPS na Vercel
  sameSite: (process.env.NODE_ENV === 'production' ? 'none' : 'lax') as 'none' | 'lax',
});

// Configura o Cookie httpOnly com a mesma validade do token
export function definirCookieSessao(res: Response, token: string): void {
  const decoded = jwt.decode(token) as { exp?: number } | null;
  const maxAge = decoded?.exp ? decoded.exp * 1000 - Date.now() : 7 * 24 * 60 * 60 * 1000;
  res.cookie('token', token, { ...cookieBase(), maxAge });
}

export function limparCookieSessao(res: Response): void {
  res.clearCookie('token', cookieBase());
}

// Renova quando já passou da metade da validade (funciona com qualquer JWT_EXPIRES_IN)
export function deveRenovarToken(iat?: number, exp?: number): boolean {
  if (!iat || !exp) return false;
  const agora = Math.floor(Date.now() / 1000);
  return agora - iat > (exp - iat) / 2;
}
