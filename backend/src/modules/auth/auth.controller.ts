import { Request, Response } from 'express';
import { registerUser, loginUser } from './auth.service';
import { validateRequest } from '../../common/middleware/error.middleware';

/** Handler para registro de usuário */
export async function registerController(req: Request, res: Response): Promise<void> {
  validateRequest(req, res, () => {});

  const { email, password, name } = req.body;

  const result = await registerUser({ email, password, name });

  res.status(201).json(result);
}

/** Handler para login de usuário */
export async function loginController(req: Request, res: Response): Promise<void> {
  validateRequest(req, res, () => {});

  const { email, password } = req.body;

  const result = await loginUser({ email, password });

  res.status(200).json(result);
}

