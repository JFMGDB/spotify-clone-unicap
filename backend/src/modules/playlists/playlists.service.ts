import { eq, and } from 'drizzle-orm';
import { requireDb } from '../../config/db';
import { playlists, playlistTracks, tracks, users } from '../../db/schema';
import { AppError } from '../../common/errors/AppError';
import { ErrorCodes } from '../../common/errors/error-codes';

/** Interface para criação de playlist */
export interface CreatePlaylistData {
  name: string;
  userId: string;
  description?: string;
  coverUrl?: string;
  isPublic?: boolean;
}

/** Interface para atualização de playlist */
export interface UpdatePlaylistData {
  name?: string;
  description?: string;
  coverUrl?: string;
  isPublic?: boolean;
}

/** Lista todas as playlists públicas */
export async function getAllPlaylists(userId?: string) {
  const database = requireDb();

  if (userId) {
    // Lista playlists do usuário e públicas
    return await database
      .select()
      .from(playlists)
      .where(eq(playlists.userId, userId));
  }

  // Lista apenas playlists públicas
  return await database
    .select()
    .from(playlists)
    .where(eq(playlists.isPublic, true));
}

/** Busca uma playlist por ID */
export async function getPlaylistById(playlistId: string, userId?: string) {
  const database = requireDb();

  const [playlist] = await database
    .select()
    .from(playlists)
    .where(eq(playlists.id, playlistId))
    .limit(1);

  if (!playlist) {
    throw new AppError('Playlist não encontrada', 404, ErrorCodes.NOT_FOUND);
  }

  // Verifica se é pública ou pertence ao usuário
  if (!playlist.isPublic && playlist.userId !== userId) {
    throw new AppError('Acesso negado', 403, ErrorCodes.FORBIDDEN);
  }

  return playlist;
}

/** Lista playlists de um usuário */
export async function getPlaylistsByUserId(userId: string) {
  const database = requireDb();

  return await database
    .select()
    .from(playlists)
    .where(eq(playlists.userId, userId));
}

/** Cria uma nova playlist */
export async function createPlaylist(data: CreatePlaylistData) {
  const database = requireDb();

  if (!data.name || data.name.trim().length === 0) {
    throw new AppError('Nome é obrigatório', 400, ErrorCodes.VALIDATION_ERROR);
  }

  // Verifica se usuário existe
  const [user] = await database
    .select()
    .from(users)
    .where(eq(users.id, data.userId))
    .limit(1);

  if (!user) {
    throw new AppError('Usuário não encontrado', 404, ErrorCodes.NOT_FOUND);
  }

  const [newPlaylist] = await database
    .insert(playlists)
    .values({
      name: data.name.trim(),
      userId: data.userId,
      description: data.description?.trim() || null,
      coverUrl: data.coverUrl?.trim() || null,
      isPublic: data.isPublic ?? false,
    })
    .returning();

  return newPlaylist;
}

/** Atualiza uma playlist */
export async function updatePlaylist(playlistId: string, userId: string, data: UpdatePlaylistData) {
  const database = requireDb();

  // Verifica se playlist existe e pertence ao usuário
  const [playlist] = await database
    .select()
    .from(playlists)
    .where(eq(playlists.id, playlistId))
    .limit(1);

  if (!playlist) {
    throw new AppError('Playlist não encontrada', 404, ErrorCodes.NOT_FOUND);
  }

  if (playlist.userId !== userId) {
    throw new AppError('Acesso negado', 403, ErrorCodes.FORBIDDEN);
  }

  const updateData: Partial<typeof playlists.$inferInsert> = {};

  if (data.name !== undefined) {
    if (data.name.trim().length === 0) {
      throw new AppError('Nome não pode ser vazio', 400, ErrorCodes.VALIDATION_ERROR);
    }
    updateData.name = data.name.trim();
  }

  if (data.description !== undefined) {
    updateData.description = data.description.trim() || null;
  }

  if (data.coverUrl !== undefined) {
    updateData.coverUrl = data.coverUrl.trim() || null;
  }

  if (data.isPublic !== undefined) {
    updateData.isPublic = data.isPublic;
  }

  updateData.updatedAt = new Date();

  const [updatedPlaylist] = await database
    .update(playlists)
    .set(updateData)
    .where(eq(playlists.id, playlistId))
    .returning();

  return updatedPlaylist;
}

/** Deleta uma playlist */
export async function deletePlaylist(playlistId: string, userId: string) {
  const database = requireDb();

  // Verifica se playlist existe e pertence ao usuário
  const [playlist] = await database
    .select()
    .from(playlists)
    .where(eq(playlists.id, playlistId))
    .limit(1);

  if (!playlist) {
    throw new AppError('Playlist não encontrada', 404, ErrorCodes.NOT_FOUND);
  }

  if (playlist.userId !== userId) {
    throw new AppError('Acesso negado', 403, ErrorCodes.FORBIDDEN);
  }

  await database.delete(playlists).where(eq(playlists.id, playlistId));
}

/** Lista tracks de uma playlist */
export async function getPlaylistTracks(playlistId: string) {
  const database = requireDb();

  return await database
    .select({
      track: tracks,
      addedAt: playlistTracks.addedAt,
    })
    .from(playlistTracks)
    .innerJoin(tracks, eq(playlistTracks.trackId, tracks.id))
    .where(eq(playlistTracks.playlistId, playlistId));
}

/** Adiciona uma track a uma playlist */
export async function addTrackToPlaylist(playlistId: string, trackId: string, userId: string) {
  const database = requireDb();

  // Verifica se playlist existe e pertence ao usuário
  const [playlist] = await database
    .select()
    .from(playlists)
    .where(eq(playlists.id, playlistId))
    .limit(1);

  if (!playlist) {
    throw new AppError('Playlist não encontrada', 404, ErrorCodes.NOT_FOUND);
  }

  if (playlist.userId !== userId) {
    throw new AppError('Acesso negado', 403, ErrorCodes.FORBIDDEN);
  }

  // Verifica se track existe
  const [track] = await database
    .select()
    .from(tracks)
    .where(eq(tracks.id, trackId))
    .limit(1);

  if (!track) {
    throw new AppError('Música não encontrada', 404, ErrorCodes.NOT_FOUND);
  }

  // Verifica se track já está na playlist
  const [existing] = await database
    .select()
    .from(playlistTracks)
    .where(
      and(
        eq(playlistTracks.playlistId, playlistId),
        eq(playlistTracks.trackId, trackId)
      )
    )
    .limit(1);

  if (existing) {
    throw new AppError('Música já está na playlist', 409, ErrorCodes.ALREADY_EXISTS);
  }

  await database.insert(playlistTracks).values({
    playlistId,
    trackId,
  });
}

/** Remove uma track de uma playlist */
export async function removeTrackFromPlaylist(
  playlistId: string,
  trackId: string,
  userId: string
) {
  const database = requireDb();

  // Verifica se playlist existe e pertence ao usuário
  const [playlist] = await database
    .select()
    .from(playlists)
    .where(eq(playlists.id, playlistId))
    .limit(1);

  if (!playlist) {
    throw new AppError('Playlist não encontrada', 404, ErrorCodes.NOT_FOUND);
  }

  if (playlist.userId !== userId) {
    throw new AppError('Acesso negado', 403, ErrorCodes.FORBIDDEN);
  }

  await database
    .delete(playlistTracks)
    .where(
      and(
        eq(playlistTracks.playlistId, playlistId),
        eq(playlistTracks.trackId, trackId)
      )
    );
}

