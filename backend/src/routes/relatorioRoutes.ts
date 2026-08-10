import { Router } from 'express';
import { relatorioMensalConsolidado } from '../controllers/relatorioController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { roleMiddleware } from '../middlewares/roleMiddleware.js';

const router = Router();

router.use(authMiddleware);

router.get('/relatorios/mensal', roleMiddleware(['GERENTE']), relatorioMensalConsolidado);

export default router;
