import { Router } from 'express';
import { criarCliente, listarClientes, obterClientePorId, obterSaldoDevedorCliente, atualizarCliente } from '../controllers/clienteController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = Router();

router.use(authMiddleware);

router.post('/clientes', criarCliente);
router.get('/clientes', listarClientes);
router.get('/clientes/:id', obterClientePorId);
router.get('/clientes/:id/saldo', obterSaldoDevedorCliente);
router.patch('/clientes/:id', atualizarCliente);

export default router;
