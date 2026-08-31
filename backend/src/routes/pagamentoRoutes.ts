import { Router } from 'express';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { listarDiasFechados, obterExtratoDia } from '../controllers/pagamentoController.js';

const router = Router();

// Listagem de datas anteriores com pagamentos fechados
router.get('/pagamentos/dias-fechados', authMiddleware, listarDiasFechados);

// Extrato de cobrança detalhado de um dia específico (formato tabela Excel)
router.get('/pagamentos/extrato-dia', authMiddleware, obterExtratoDia);

export default router;
