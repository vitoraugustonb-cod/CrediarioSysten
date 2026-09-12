import { Router } from 'express';
import { criarProduto, listarProdutos } from '../controllers/produtoController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { validateBody } from '../middlewares/validateMiddleware.js';
import { criarProdutoSchema } from '../validators/schemas.js';

const router = Router();

router.use(authMiddleware);

router.post('/produtos', validateBody(criarProdutoSchema), criarProduto);
router.get('/produtos', listarProdutos);

export default router;
