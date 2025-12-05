import { Request, Response } from 'express';
import {
  getAllArtists,
  getArtistById,
  createArtist,
  updateArtist,
  deleteArtist,
} from './artists.service';
import { validateRequest } from '../../common/middleware/error.middleware';

/** GET /api/artists - Lista todos os artistas */
export async function getAllArtistsController(req: Request, res: Response): Promise<void> {
  const search = req.query.search as string | undefined;

  const artists = await getAllArtists(search);

  res.status(200).json(artists);
}

/** GET /api/artists/:id - Busca um artista por ID */
export async function getArtistByIdController(req: Request, res: Response): Promise<void> {
  const { id } = req.params;

  const artist = await getArtistById(id);

  res.status(200).json(artist);
}

/** POST /api/artists - Cria um novo artista */
export async function createArtistController(req: Request, res: Response): Promise<void> {
  validateRequest(req, res, () => {});

  const { name, imageUrl, bio } = req.body;

  const artist = await createArtist({ name, imageUrl, bio });

  res.status(201).json(artist);
}

/** PUT /api/artists/:id - Atualiza um artista */
export async function updateArtistController(req: Request, res: Response): Promise<void> {
  validateRequest(req, res, () => {});

  const { id } = req.params;
  const { name, imageUrl, bio } = req.body;

  const artist = await updateArtist(id, { name, imageUrl, bio });

  res.status(200).json(artist);
}

/** DELETE /api/artists/:id - Deleta um artista */
export async function deleteArtistController(req: Request, res: Response): Promise<void> {
  const { id } = req.params;

  await deleteArtist(id);

  res.status(204).send();
}

