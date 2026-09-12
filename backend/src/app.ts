import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

import { apiRateLimiter } from './middlewares/rateLimiter.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import clienteRoutes from './routes/clienteRoutes.js';
import produtoRoutes from './routes/produtoRoutes.js';
import vendaRoutes from './routes/vendaRoutes.js';
import parcelaRoutes from './routes/parcelaRoutes.js';
import prestacaoContasRoutes from './routes/prestacaoContasRoutes.js';
import relatorioRoutes from './routes/relatorioRoutes.js';
import pagamentoRoutes from './routes/pagamentoRoutes.js';

dotenv.config();

const app = express();

// 1. Headers de Segurança Automáticos (HSTS, CSP, X-Frame-Options, etc.)
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));

// 2. Configuração de CORS Restritivo com suporte a Cookies e Credentials
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:3300',
  process.env.FRONTEND_URL
].filter(Boolean) as string[];

app.use(cors({
  origin: (origin, callback) => {
    // Permite requisições sem origin (como mobile apps, curl ou deploy serverless no mesmo domínio)
    if (!origin) return callback(null, true);
    
    // Se a origem estiver na lista explícita ou for um subdomínio vercel.app
    const isAllowed = allowedOrigins.includes(origin) || origin.endsWith('.vercel.app');
    if (isAllowed) {
      return callback(null, true);
    }
    return callback(new Error('Origem não permitida pela política de CORS.'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// 3. Parser de Cookies httpOnly
app.use(cookieParser());

// 4. Limitação estrita do tamanho do Body (1MB) contra ataques de payload DoS
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// 5. Rate Limiting Geral para proteção da API
app.use(apiRateLimiter);

// 6. Rota de Health Check
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', message: 'Servidor Crediário Back-end seguro e operacional!' });
});

// 7. Registro de Rotas da Aplicação
app.use(authRoutes);
app.use(userRoutes);
app.use(clienteRoutes);
app.use(produtoRoutes);
app.use(vendaRoutes);
app.use(parcelaRoutes);
app.use(prestacaoContasRoutes);
app.use(relatorioRoutes);
app.use(pagamentoRoutes);

// 8. Middleware de Tratamento Global de Erros (Prevenção de vazamento de stack trace em produção)
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('[ERRO_SERVIDOR]', {
    mensagem: err.message,
    rota: req.originalUrl,
    metodo: req.method,
    stack: process.env.NODE_ENV !== 'production' ? err.stack : undefined
  });

  const statusCode = err.status || err.statusCode || 500;
  const mensagemAmigavel = process.env.NODE_ENV === 'production' && statusCode === 500
    ? 'Ocorreu um erro interno no servidor. Por favor, tente novamente mais tarde.'
    : err.message || 'Erro interno no servidor.';

  res.status(statusCode).json({ erro: mensagemAmigavel });
});

export default app;
