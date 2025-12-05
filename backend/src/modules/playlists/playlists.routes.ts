import { Router } from 'express';
import {
  getAllPlaylistsController,
  getPlaylistByIdController,
  getPlaylistsByUserController,
  getPlaylistTracksController,
  createPlaylistController,
  updatePlaylistController,
  deletePlaylistController,
  addTrackToPlaylistController,
  removeTrackFromPlaylistController,
} from './playlists.controller';
import {
  createPlaylistValidators,
  updatePlaylistValidators,
  addTrackValidators,
} from './playlists.validators';
import { authMiddleware } from '../../common/middleware/auth.middleware';

const router = Router();

/** GET /api/playlists - Lista todas as playlists */
router.get('/', authMiddleware, getAllPlaylistsController);

/** GET /api/playlists/user/:userId - Lista playlists de um usuário */
router.get('/user/:userId', authMiddleware, getPlaylistsByUserController);

/** GET /api/playlists/:id/tracks - Lista tracks de uma playlist */
router.get('/:id/tracks', getPlaylistTracksController);

/** GET /api/playlists/:id - Busca uma playlist por ID */
router.get('/:id', getPlaylistByIdController);

/** POST /api/playlists - Cria uma nova playlist */
router.post('/', authMiddleware, createPlaylistValidators, createPlaylistController);

/** PUT /api/playlists/:id - Atualiza uma playlist */
router.put('/:id', authMiddleware, updatePlaylistValidators, updatePlaylistController);

/** DELETE /api/playlists/:id - Deleta uma playlist */
router.delete('/:id', authMiddleware, deletePlaylistController);

/** POST /api/playlists/:id/tracks - Adiciona uma track a uma playlist */
router.post(
  '/:id/tracks',
  authMiddleware,
  addTrackValidators,
  addTrackToPlaylistController
);

/** DELETE /api/playlists/:id/tracks/:trackId - Remove uma track de uma playlist */
router.delete('/:id/tracks/:trackId', authMiddleware, removeTrackFromPlaylistController);

export default router;

