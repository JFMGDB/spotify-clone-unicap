import { Router, Request, Response } from 'express';
import healthRoutes from './health.routes';

/** Agregação de todas as rotas da aplicação */
const router = Router();

router.get('/', (_req: Request, res: Response) => {
  res.status(200).json({
    message: 'API está rodando com sucesso',
  });
});

router.use(healthRoutes);
// router.use('/api/auth', authRoutes);
// router.use('/api/users', usersRoutes);
// router.use('/api/artists', artistsRoutes);
// etc.

export default router;

