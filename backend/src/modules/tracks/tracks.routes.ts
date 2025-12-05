import { Router } from 'express';
import {
  getAllTracksController,
  getTrackByIdController,
  getTracksByAlbumController,
  getTracksByArtistController,
  createTrackController,
  updateTrackController,
  deleteTrackController,
} from './tracks.controller';
import { createTrackValidators, updateTrackValidators } from './tracks.validators';
import { authMiddleware } from '../../common/middleware/auth.middleware';

const router = Router();

/** GET /api/tracks - Lista todas as tracks */
router.get('/', getAllTracksController);

/** GET /api/tracks/album/:albumId - Lista tracks de um álbum */
router.get('/album/:albumId', getTracksByAlbumController);

/** GET /api/tracks/artist/:artistId - Lista tracks de um artista */
router.get('/artist/:artistId', getTracksByArtistController);

/** GET /api/tracks/:id - Busca uma track por ID */
router.get('/:id', getTrackByIdController);

/** POST /api/tracks - Cria uma nova track */
router.post('/', authMiddleware, createTrackValidators, createTrackController);

/** PUT /api/tracks/:id - Atualiza uma track */
router.put('/:id', authMiddleware, updateTrackValidators, updateTrackController);

/** DELETE /api/tracks/:id - Deleta uma track */
router.delete('/:id', authMiddleware, deleteTrackController);

export default router;

