import { Router } from 'express';
import {
  obterPrestacaoContasProprioDia,
  obterPrestacaoContasFuncionarioDia
} from '../controllers/prestacaoContasController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = Router();

router.use(authMiddleware);

router.get('/prestacao-contas/dia', obterPrestacaoContasProprioDia);
router.get('/prestacao-contas/dia/:usuarioId', obterPrestacaoContasFuncionarioDia);

export default router;
