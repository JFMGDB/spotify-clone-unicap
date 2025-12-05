import { Router } from 'express';
import {
  getAllAlbumsController,
  getAlbumByIdController,
  getAlbumsByArtistController,
  createAlbumController,
  updateAlbumController,
  deleteAlbumController,
} from './albums.controller';
import { createAlbumValidators, updateAlbumValidators } from './albums.validators';
import { authMiddleware } from '../../common/middleware/auth.middleware';

const router = Router();

/** GET /api/albums - Lista todos os álbuns */
router.get('/', getAllAlbumsController);

/** GET /api/albums/artist/:artistId - Lista álbuns de um artista */
router.get('/artist/:artistId', getAlbumsByArtistController);

/** GET /api/albums/:id - Busca um álbum por ID */
router.get('/:id', getAlbumByIdController);

/** POST /api/albums - Cria um novo álbum */
router.post('/', authMiddleware, createAlbumValidators, createAlbumController);

/** PUT /api/albums/:id - Atualiza um álbum */
router.put('/:id', authMiddleware, updateAlbumValidators, updateAlbumController);

/** DELETE /api/albums/:id - Deleta um álbum */
router.delete('/:id', authMiddleware, deleteAlbumController);

export default router;

