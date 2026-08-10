import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import clienteRoutes from './routes/clienteRoutes.js';
import produtoRoutes from './routes/produtoRoutes.js';
import vendaRoutes from './routes/vendaRoutes.js';
import parcelaRoutes from './routes/parcelaRoutes.js';
import prestacaoContasRoutes from './routes/prestacaoContasRoutes.js';
import relatorioRoutes from './routes/relatorioRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3300;

app.use(cors());
app.use(express.json());

// Rota de Health Check
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', message: 'Servidor Crediário Back-end rodando com sucesso!' });
});

// Registro de Rotas da Aplicação
app.use(authRoutes);
app.use(userRoutes);
app.use(clienteRoutes);
app.use(produtoRoutes);
app.use(vendaRoutes);
app.use(parcelaRoutes);
app.use(prestacaoContasRoutes);
app.use(relatorioRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
