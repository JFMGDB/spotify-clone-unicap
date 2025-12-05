import { Router } from 'express';
import { getUserByIdController, getCurrentUserController } from './users.controller';
import { authMiddleware } from '../../common/middleware/auth.middleware';

const router = Router();

/** GET /api/users/me - Busca o usuário autenticado */
router.get('/me', authMiddleware, getCurrentUserController);

/** GET /api/users/:id - Busca um usuário por ID */
router.get('/:id', authMiddleware, getUserByIdController);

export default router;

