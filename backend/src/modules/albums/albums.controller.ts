import { Request, Response } from 'express';
import {
  getAllAlbums,
  getAlbumById,
  getAlbumsByArtistId,
  createAlbum,
  updateAlbum,
  deleteAlbum,
} from './albums.service';
import { validateRequest } from '../../common/middleware/error.middleware';

/** GET /api/albums - Lista todos os álbuns */
export async function getAllAlbumsController(req: Request, res: Response): Promise<void> {
  const search = req.query.search as string | undefined;

  const albums = await getAllAlbums(search);

  res.status(200).json(albums);
}

/** GET /api/albums/:id - Busca um álbum por ID */
export async function getAlbumByIdController(req: Request, res: Response): Promise<void> {
  const { id } = req.params;

  const album = await getAlbumById(id);

  res.status(200).json(album);
}

/** GET /api/albums/artist/:artistId - Lista álbuns de um artista */
export async function getAlbumsByArtistController(req: Request, res: Response): Promise<void> {
  const { artistId } = req.params;

  const albums = await getAlbumsByArtistId(artistId);

  res.status(200).json(albums);
}

/** POST /api/albums - Cria um novo álbum */
export async function createAlbumController(req: Request, res: Response): Promise<void> {
  validateRequest(req, res, () => {});

  const { title, artistId, coverUrl, releaseDate } = req.body;

  const album = await createAlbum({
    title,
    artistId,
    coverUrl,
    releaseDate: releaseDate ? new Date(releaseDate) : undefined,
  });

  res.status(201).json(album);
}

/** PUT /api/albums/:id - Atualiza um álbum */
export async function updateAlbumController(req: Request, res: Response): Promise<void> {
  validateRequest(req, res, () => {});

  const { id } = req.params;
  const { title, artistId, coverUrl, releaseDate } = req.body;

  const album = await updateAlbum(id, {
    title,
    artistId,
    coverUrl,
    releaseDate: releaseDate ? new Date(releaseDate) : undefined,
  });

  res.status(200).json(album);
}

/** DELETE /api/albums/:id - Deleta um álbum */
export async function deleteAlbumController(req: Request, res: Response): Promise<void> {
  const { id } = req.params;

  await deleteAlbum(id);

  res.status(204).send();
}

