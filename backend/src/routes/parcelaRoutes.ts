import { Router } from 'express';
import {
  listarParcelas,
  listarHistoricoParcelas,
  registrarPagamento,
  registrarObservacao,
  ajustarParcela,
  alterarDataVencimentoParcela
} from '../controllers/parcelaController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { roleMiddleware } from '../middlewares/roleMiddleware.js';

const router = Router();

router.use(authMiddleware);

router.get('/parcelas', listarParcelas);
router.get('/parcelas/historico', listarHistoricoParcelas);
router.patch('/parcelas/:id/pagamento', registrarPagamento);
router.patch('/parcelas/:id/observacao', registrarObservacao);
router.patch('/parcelas/:id/ajuste', roleMiddleware(['GERENTE']), ajustarParcela);
router.patch('/parcelas/:id/data-vencimento', alterarDataVencimentoParcela);

export default router;
