import { Router } from 'express';
import { registerController, loginController } from './auth.controller';
import { registerValidators, loginValidators } from './auth.validators';

const router = Router();

/** POST /api/auth/register - Registra um novo usuário */
router.post('/register', registerValidators, registerController);

/** POST /api/auth/login - Autentica um usuário */
router.post('/login', loginValidators, loginController);

export default router;

