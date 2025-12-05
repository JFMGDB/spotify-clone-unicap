import { Request, Response } from 'express';
import {
  getAllTracks,
  getTrackById,
  getTracksByAlbumId,
  getTracksByArtistId,
  createTrack,
  updateTrack,
  deleteTrack,
} from './tracks.service';
import { validateRequest } from '../../common/middleware/error.middleware';

/** GET /api/tracks - Lista todas as tracks */
export async function getAllTracksController(req: Request, res: Response): Promise<void> {
  const search = req.query.search as string | undefined;

  const tracks = await getAllTracks(search);

  res.status(200).json(tracks);
}

/** GET /api/tracks/:id - Busca uma track por ID */
export async function getTrackByIdController(req: Request, res: Response): Promise<void> {
  const { id } = req.params;

  const track = await getTrackById(id);

  res.status(200).json(track);
}

/** GET /api/tracks/album/:albumId - Lista tracks de um álbum */
export async function getTracksByAlbumController(req: Request, res: Response): Promise<void> {
  const { albumId } = req.params;

  const tracks = await getTracksByAlbumId(albumId);

  res.status(200).json(tracks);
}

/** GET /api/tracks/artist/:artistId - Lista tracks de um artista */
export async function getTracksByArtistController(req: Request, res: Response): Promise<void> {
  const { artistId } = req.params;

  const tracks = await getTracksByArtistId(artistId);

  res.status(200).json(tracks);
}

/** POST /api/tracks - Cria uma nova track */
export async function createTrackController(req: Request, res: Response): Promise<void> {
  validateRequest(req, res, () => {});

  const { title, albumId, artistId, duration, audioUrl, trackNumber } = req.body;

  const track = await createTrack({
    title,
    albumId,
    artistId,
    duration,
    audioUrl,
    trackNumber,
  });

  res.status(201).json(track);
}

/** PUT /api/tracks/:id - Atualiza uma track */
export async function updateTrackController(req: Request, res: Response): Promise<void> {
  validateRequest(req, res, () => {});

  const { id } = req.params;
  const { title, albumId, artistId, duration, audioUrl, trackNumber } = req.body;

  const track = await updateTrack(id, {
    title,
    albumId,
    artistId,
    duration,
    audioUrl,
    trackNumber,
  });

  res.status(200).json(track);
}

/** DELETE /api/tracks/:id - Deleta uma track */
export async function deleteTrackController(req: Request, res: Response): Promise<void> {
  const { id } = req.params;

  await deleteTrack(id);

  res.status(204).send();
}

