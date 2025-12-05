import { eq, ilike } from 'drizzle-orm';
import { requireDb } from '../../config/db';
import { tracks, albums, artists } from '../../db/schema';
import { AppError } from '../../common/errors/AppError';
import { ErrorCodes } from '../../common/errors/error-codes';

/** Interface para criação de track */
export interface CreateTrackData {
  title: string;
  albumId?: string;
  artistId: string;
  duration: number;
  audioUrl: string;
  trackNumber?: number;
}

/** Interface para atualização de track */
export interface UpdateTrackData {
  title?: string;
  albumId?: string;
  artistId?: string;
  duration?: number;
  audioUrl?: string;
  trackNumber?: number;
}

/** Lista todas as tracks */
export async function getAllTracks(search?: string) {
  const database = requireDb();

  const baseQuery = database
    .select({
      id: tracks.id,
      title: tracks.title,
      albumId: tracks.albumId,
      artistId: tracks.artistId,
      duration: tracks.duration,
      audioUrl: tracks.audioUrl,
      trackNumber: tracks.trackNumber,
      createdAt: tracks.createdAt,
      updatedAt: tracks.updatedAt,
      artist: {
        id: artists.id,
        name: artists.name,
      },
      album: {
        id: albums.id,
        title: albums.title,
      },
    })
    .from(tracks)
    .innerJoin(artists, eq(tracks.artistId, artists.id))
    .leftJoin(albums, eq(tracks.albumId, albums.id));

  if (search) {
    return await baseQuery.where(ilike(tracks.title, `%${search}%`));
  }

  return await baseQuery;
}

/** Busca uma track por ID */
export async function getTrackById(trackId: string) {
  const database = requireDb();

  const [track] = await database
    .select({
      id: tracks.id,
      title: tracks.title,
      albumId: tracks.albumId,
      artistId: tracks.artistId,
      duration: tracks.duration,
      audioUrl: tracks.audioUrl,
      trackNumber: tracks.trackNumber,
      createdAt: tracks.createdAt,
      updatedAt: tracks.updatedAt,
      artist: {
        id: artists.id,
        name: artists.name,
        imageUrl: artists.imageUrl,
      },
      album: {
        id: albums.id,
        title: albums.title,
        coverUrl: albums.coverUrl,
      },
    })
    .from(tracks)
    .innerJoin(artists, eq(tracks.artistId, artists.id))
    .leftJoin(albums, eq(tracks.albumId, albums.id))
    .where(eq(tracks.id, trackId))
    .limit(1);

  if (!track) {
    throw new AppError('Música não encontrada', 404, ErrorCodes.NOT_FOUND);
  }

  return track;
}

/** Lista tracks de um álbum */
export async function getTracksByAlbumId(albumId: string) {
  const database = requireDb();

  return await database
    .select()
    .from(tracks)
    .where(eq(tracks.albumId, albumId))
    .orderBy(tracks.trackNumber);
}

/** Lista tracks de um artista */
export async function getTracksByArtistId(artistId: string) {
  const database = requireDb();

  return await database
    .select()
    .from(tracks)
    .where(eq(tracks.artistId, artistId));
}

/** Cria uma nova track */
export async function createTrack(data: CreateTrackData) {
  const database = requireDb();

  if (!data.title || data.title.trim().length === 0) {
    throw new AppError('Título é obrigatório', 400, ErrorCodes.VALIDATION_ERROR);
  }

  if (data.duration <= 0) {
    throw new AppError('Duração deve ser maior que zero', 400, ErrorCodes.VALIDATION_ERROR);
  }

  if (!data.audioUrl || data.audioUrl.trim().length === 0) {
    throw new AppError('URL do áudio é obrigatória', 400, ErrorCodes.VALIDATION_ERROR);
  }

  // Verifica se artista existe
  const [artist] = await database
    .select()
    .from(artists)
    .where(eq(artists.id, data.artistId))
    .limit(1);

  if (!artist) {
    throw new AppError('Artista não encontrado', 404, ErrorCodes.NOT_FOUND);
  }

  // Verifica se álbum existe (se fornecido)
  if (data.albumId) {
    const [album] = await database
      .select()
      .from(albums)
      .where(eq(albums.id, data.albumId))
      .limit(1);

    if (!album) {
      throw new AppError('Álbum não encontrado', 404, ErrorCodes.NOT_FOUND);
    }
  }

  const [newTrack] = await database
    .insert(tracks)
    .values({
      title: data.title.trim(),
      albumId: data.albumId || null,
      artistId: data.artistId,
      duration: data.duration,
      audioUrl: data.audioUrl.trim(),
      trackNumber: data.trackNumber || null,
    })
    .returning();

  return newTrack;
}

/** Atualiza uma track */
export async function updateTrack(trackId: string, data: UpdateTrackData) {
  const database = requireDb();

  // Verifica se track existe
  await getTrackById(trackId);

  const updateData: Partial<typeof tracks.$inferInsert> = {};

  if (data.title !== undefined) {
    if (data.title.trim().length === 0) {
      throw new AppError('Título não pode ser vazio', 400, ErrorCodes.VALIDATION_ERROR);
    }
    updateData.title = data.title.trim();
  }

  if (data.artistId !== undefined) {
    // Verifica se novo artista existe
    const [artist] = await database
      .select()
      .from(artists)
      .where(eq(artists.id, data.artistId))
      .limit(1);

    if (!artist) {
      throw new AppError('Artista não encontrado', 404, ErrorCodes.NOT_FOUND);
    }

    updateData.artistId = data.artistId;
  }

  if (data.albumId !== undefined) {
    if (data.albumId) {
      // Verifica se álbum existe
      const [album] = await database
        .select()
        .from(albums)
        .where(eq(albums.id, data.albumId))
        .limit(1);

      if (!album) {
        throw new AppError('Álbum não encontrado', 404, ErrorCodes.NOT_FOUND);
      }

      updateData.albumId = data.albumId;
    } else {
      updateData.albumId = null;
    }
  }

  if (data.duration !== undefined) {
    if (data.duration <= 0) {
      throw new AppError('Duração deve ser maior que zero', 400, ErrorCodes.VALIDATION_ERROR);
    }
    updateData.duration = data.duration;
  }

  if (data.audioUrl !== undefined) {
    if (data.audioUrl.trim().length === 0) {
      throw new AppError('URL do áudio não pode ser vazia', 400, ErrorCodes.VALIDATION_ERROR);
    }
    updateData.audioUrl = data.audioUrl.trim();
  }

  if (data.trackNumber !== undefined) {
    updateData.trackNumber = data.trackNumber || null;
  }

  updateData.updatedAt = new Date();

  const [updatedTrack] = await database
    .update(tracks)
    .set(updateData)
    .where(eq(tracks.id, trackId))
    .returning();

  return updatedTrack;
}

/** Deleta uma track */
export async function deleteTrack(trackId: string) {
  const database = requireDb();

  // Verifica se track existe
  await getTrackById(trackId);

  await database.delete(tracks).where(eq(tracks.id, trackId));
}

