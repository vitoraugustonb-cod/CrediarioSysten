import { Router } from 'express';
import { registrarVenda, listarVendas, obterVendaPorId } from '../controllers/vendaController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = Router();

router.use(authMiddleware);

router.post('/vendas', registrarVenda);
router.get('/vendas', listarVendas);
router.get('/vendas/:id', obterVendaPorId);

export default router;
