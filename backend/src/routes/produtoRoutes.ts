import { Router } from 'express';
import { criarProduto, listarProdutos } from '../controllers/produtoController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = Router();

router.use(authMiddleware);

router.post('/produtos', criarProduto);
router.get('/produtos', listarProdutos);

export default router;
