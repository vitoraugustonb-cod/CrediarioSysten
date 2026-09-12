import { Router } from 'express';
import { criarCliente, listarClientes, obterClientePorId, obterSaldoDevedorCliente, atualizarCliente } from '../controllers/clienteController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { validateBody } from '../middlewares/validateMiddleware.js';
import { criarClienteSchema, atualizarClienteSchema } from '../validators/schemas.js';

const router = Router();

router.use(authMiddleware);

router.post('/clientes', validateBody(criarClienteSchema), criarCliente);
router.get('/clientes', listarClientes);
router.get('/clientes/:id', obterClientePorId);
router.get('/clientes/:id/saldo', obterSaldoDevedorCliente);
router.patch('/clientes/:id', validateBody(atualizarClienteSchema), atualizarCliente);

export default router;
