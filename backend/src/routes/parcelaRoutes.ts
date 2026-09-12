import { Router } from 'express';
import {
  listarParcelas,
  listarHistoricoParcelas,
  registrarPagamento,
  registrarObservacao,
  ajustarParcela,
  alterarDataVencimentoParcela,
  registrarContatoParcela
} from '../controllers/parcelaController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { roleMiddleware } from '../middlewares/roleMiddleware.js';
import { validateBody } from '../middlewares/validateMiddleware.js';
import {
  registrarPagamentoSchema,
  ajustarParcelaSchema,
  alterarVencimentoSchema,
  observacaoSchema
} from '../validators/schemas.js';

const router = Router();

router.use(authMiddleware);

router.get('/parcelas', listarParcelas);
router.get('/parcelas/historico', listarHistoricoParcelas);
router.patch('/parcelas/:id/pagamento', validateBody(registrarPagamentoSchema), registrarPagamento);
router.patch('/parcelas/:id/observacao', validateBody(observacaoSchema), registrarObservacao);
router.patch('/parcelas/:id/ajuste', roleMiddleware(['GERENTE']), validateBody(ajustarParcelaSchema), ajustarParcela);
router.patch('/parcelas/:id/data-vencimento', validateBody(alterarVencimentoSchema), alterarDataVencimentoParcela);
router.patch('/parcelas/:id/contato', registrarContatoParcela);

export default router;
