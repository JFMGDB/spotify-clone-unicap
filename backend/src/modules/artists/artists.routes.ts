import { Router } from 'express';
import {
  getAllArtistsController,
  getArtistByIdController,
  createArtistController,
  updateArtistController,
  deleteArtistController,
} from './artists.controller';
import { createArtistValidators, updateArtistValidators } from './artists.validators';
import { authMiddleware } from '../../common/middleware/auth.middleware';

const router = Router();

/** GET /api/artists - Lista todos os artistas */
router.get('/', getAllArtistsController);

/** GET /api/artists/:id - Busca um artista por ID */
router.get('/:id', getArtistByIdController);

/** POST /api/artists - Cria um novo artista */
router.post('/', authMiddleware, createArtistValidators, createArtistController);

/** PUT /api/artists/:id - Atualiza um artista */
router.put('/:id', authMiddleware, updateArtistValidators, updateArtistController);

/** DELETE /api/artists/:id - Deleta um artista */
router.delete('/:id', authMiddleware, deleteArtistController);

export default router;

