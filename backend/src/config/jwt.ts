import dotenv from 'dotenv';
dotenv.config();

if (!process.env.JWT_SECRET && process.env.NODE_ENV === 'production') {
  throw new Error('FATAL: A variável de ambiente JWT_SECRET é obrigatória em produção.');
}

export const JWT_SECRET = process.env.JWT_SECRET || 'crediario_jwt_secret_dev_fallback_only';
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';
