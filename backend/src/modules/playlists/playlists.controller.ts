import { Request, Response } from 'express';
import {
  getAllPlaylists,
  getPlaylistById,
  getPlaylistsByUserId,
  createPlaylist,
  updatePlaylist,
  deletePlaylist,
  getPlaylistTracks,
  addTrackToPlaylist,
  removeTrackFromPlaylist,
} from './playlists.service';

/** GET /api/playlists - Lista todas as playlists */
export async function getAllPlaylistsController(req: Request, res: Response): Promise<void> {
  const userId = req.userId;

  const playlists = await getAllPlaylists(userId);

  res.status(200).json(playlists);
}

/** GET /api/playlists/:id - Busca uma playlist por ID */
export async function getPlaylistByIdController(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const userId = req.userId || undefined;

  const playlist = await getPlaylistById(id, userId);

  res.status(200).json(playlist);
}

/** GET /api/playlists/user/:userId - Lista playlists de um usuário */
export async function getPlaylistsByUserController(req: Request, res: Response): Promise<void> {
  const { userId } = req.params;

  const playlists = await getPlaylistsByUserId(userId);

  res.status(200).json(playlists);
}

/** GET /api/playlists/:id/tracks - Lista tracks de uma playlist */
export async function getPlaylistTracksController(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const userId = req.userId || undefined;

  // Verifica se o usuario tem acesso a playlist antes de retornar as tracks
  await getPlaylistById(id, userId);

  const playlistTracks = await getPlaylistTracks(id);

  res.status(200).json(playlistTracks);
}

/** POST /api/playlists - Cria uma nova playlist */
export async function createPlaylistController(req: Request, res: Response): Promise<void> {
  if (!req.userId) {
    res.status(401).json({ error: { message: 'Não autenticado', code: 'UNAUTHORIZED' } });
    return;
  }

  const { name, description, coverUrl, isPublic } = req.body;

  const playlist = await createPlaylist({
    name,
    userId: req.userId,
    description,
    coverUrl,
    isPublic,
  });

  res.status(201).json(playlist);
}

/** PUT /api/playlists/:id - Atualiza uma playlist */
export async function updatePlaylistController(req: Request, res: Response): Promise<void> {
  if (!req.userId) {
    res.status(401).json({ error: { message: 'Não autenticado', code: 'UNAUTHORIZED' } });
    return;
  }

  const { id } = req.params;
  const { name, description, coverUrl, isPublic } = req.body;

  const playlist = await updatePlaylist(id, req.userId, {
    name,
    description,
    coverUrl,
    isPublic,
  });

  res.status(200).json(playlist);
}

/** DELETE /api/playlists/:id - Deleta uma playlist */
export async function deletePlaylistController(req: Request, res: Response): Promise<void> {
  if (!req.userId) {
    res.status(401).json({ error: { message: 'Não autenticado', code: 'UNAUTHORIZED' } });
    return;
  }

  const { id } = req.params;

  await deletePlaylist(id, req.userId);

  res.status(204).send();
}

/** POST /api/playlists/:id/tracks - Adiciona uma track a uma playlist */
export async function addTrackToPlaylistController(req: Request, res: Response): Promise<void> {
  if (!req.userId) {
    res.status(401).json({ error: { message: 'Não autenticado', code: 'UNAUTHORIZED' } });
    return;
  }

  const { id } = req.params;
  const { trackId } = req.body;

  await addTrackToPlaylist(id, trackId, req.userId);

  res.status(201).json({ message: 'Música adicionada à playlist' });
}

/** DELETE /api/playlists/:id/tracks/:trackId - Remove uma track de uma playlist */
export async function removeTrackFromPlaylistController(
  req: Request,
  res: Response
): Promise<void> {
  if (!req.userId) {
    res.status(401).json({ error: { message: 'Não autenticado', code: 'UNAUTHORIZED' } });
    return;
  }

  const { id, trackId } = req.params;

  await removeTrackFromPlaylist(id, trackId, req.userId);

  res.status(204).send();
}

