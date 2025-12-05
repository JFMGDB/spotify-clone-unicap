import { Router, Request, Response } from 'express';
import healthRoutes from './health.routes';
import authRoutes from '../modules/auth/auth.routes';
import usersRoutes from '../modules/users/users.routes';
import artistsRoutes from '../modules/artists/artists.routes';
import albumsRoutes from '../modules/albums/albums.routes';
import tracksRoutes from '../modules/tracks/tracks.routes';
import playlistsRoutes from '../modules/playlists/playlists.routes';

/** Agregação de todas as rotas da aplicação */
const router = Router();

router.get('/', (_req: Request, res: Response) => {
  res.status(200).json({
    message: 'API está rodando com sucesso',
  });
});

router.use(healthRoutes);
router.use('/api/auth', authRoutes);
router.use('/api/users', usersRoutes);
router.use('/api/artists', artistsRoutes);
router.use('/api/albums', albumsRoutes);
router.use('/api/tracks', tracksRoutes);
router.use('/api/playlists', playlistsRoutes);

export default router;

