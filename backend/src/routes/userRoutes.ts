import { Router } from 'express';
import { criarUsuario } from '../controllers/userController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { roleMiddleware } from '../middlewares/roleMiddleware.js';

const router = Router();

router.post(
  '/usuarios',
  authMiddleware,
  roleMiddleware(['GERENTE']),
  criarUsuario
);

export default router;
