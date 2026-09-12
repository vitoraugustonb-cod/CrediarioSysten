import { Router } from 'express';
import { login, logout } from '../controllers/authController.js';
import { loginRateLimiter } from '../middlewares/rateLimiter.js';
import { validateBody } from '../middlewares/validateMiddleware.js';
import { loginSchema } from '../validators/schemas.js';

const router = Router();

router.post('/login', loginRateLimiter, validateBody(loginSchema), login);
router.post('/logout', logout);

export default router;
