import { Request, Response } from 'express';
import { getUserById } from './users.service';

/** GET /api/users/:id - Busca um usuário por ID */
export async function getUserByIdController(req: Request, res: Response): Promise<void> {
  const { id } = req.params;

  const user = await getUserById(id);

  res.status(200).json(user);
}

/** GET /api/users/me - Busca o usuário autenticado */
export async function getCurrentUserController(req: Request, res: Response): Promise<void> {
  if (!req.userId) {
    res.status(401).json({ error: { message: 'Não autenticado', code: 'UNAUTHORIZED' } });
    return;
  }

  const user = await getUserById(req.userId);

  res.status(200).json(user);
}

