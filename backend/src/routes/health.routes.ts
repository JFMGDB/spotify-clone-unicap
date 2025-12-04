import { Router } from 'express';

/** Rotas de health check */
const router = Router();

router.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

export default router;

