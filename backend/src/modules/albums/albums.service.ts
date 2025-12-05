import { eq, ilike } from 'drizzle-orm';
import { requireDb } from '../../config/db';
import { albums, artists } from '../../db/schema';
import { AppError } from '../../common/errors/AppError';
import { ErrorCodes } from '../../common/errors/error-codes';

/** Interface para criação de álbum */
export interface CreateAlbumData {
  title: string;
  artistId: string;
  coverUrl?: string;
  releaseDate?: Date;
}

/** Interface para atualização de álbum */
export interface UpdateAlbumData {
  title?: string;
  artistId?: string;
  coverUrl?: string;
  releaseDate?: Date;
}

/** Lista todos os álbuns */
export async function getAllAlbums(search?: string) {
  const database = requireDb();

  if (search) {
    return await database
      .select({
        id: albums.id,
        title: albums.title,
        artistId: albums.artistId,
        coverUrl: albums.coverUrl,
        releaseDate: albums.releaseDate,
        createdAt: albums.createdAt,
        updatedAt: albums.updatedAt,
        artist: {
          id: artists.id,
          name: artists.name,
        },
      })
      .from(albums)
      .innerJoin(artists, eq(albums.artistId, artists.id))
      .where(ilike(albums.title, `%${search}%`));
  }

  return await database
    .select({
      id: albums.id,
      title: albums.title,
      artistId: albums.artistId,
      coverUrl: albums.coverUrl,
      releaseDate: albums.releaseDate,
      createdAt: albums.createdAt,
      updatedAt: albums.updatedAt,
      artist: {
        id: artists.id,
        name: artists.name,
      },
    })
    .from(albums)
    .innerJoin(artists, eq(albums.artistId, artists.id));
}

/** Busca um álbum por ID */
export async function getAlbumById(albumId: string) {
  const database = requireDb();

  const [album] = await database
    .select({
      id: albums.id,
      title: albums.title,
      artistId: albums.artistId,
      coverUrl: albums.coverUrl,
      releaseDate: albums.releaseDate,
      createdAt: albums.createdAt,
      updatedAt: albums.updatedAt,
      artist: {
        id: artists.id,
        name: artists.name,
        imageUrl: artists.imageUrl,
      },
    })
    .from(albums)
    .innerJoin(artists, eq(albums.artistId, artists.id))
    .where(eq(albums.id, albumId))
    .limit(1);

  if (!album) {
    throw new AppError('Álbum não encontrado', 404, ErrorCodes.NOT_FOUND);
  }

  return album;
}

/** Lista álbuns de um artista */
export async function getAlbumsByArtistId(artistId: string) {
  const database = requireDb();

  return await database
    .select({
      id: albums.id,
      title: albums.title,
      artistId: albums.artistId,
      coverUrl: albums.coverUrl,
      releaseDate: albums.releaseDate,
      createdAt: albums.createdAt,
      updatedAt: albums.updatedAt,
      artist: {
        id: artists.id,
        name: artists.name,
      },
    })
    .from(albums)
    .innerJoin(artists, eq(albums.artistId, artists.id))
    .where(eq(albums.artistId, artistId));
}

/** Cria um novo álbum */
export async function createAlbum(data: CreateAlbumData) {
  const database = requireDb();

  if (!data.title || data.title.trim().length === 0) {
    throw new AppError('Título é obrigatório', 400, ErrorCodes.VALIDATION_ERROR);
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

  const [newAlbum] = await database
    .insert(albums)
    .values({
      title: data.title.trim(),
      artistId: data.artistId,
      coverUrl: data.coverUrl?.trim() || null,
      releaseDate: data.releaseDate || null,
    })
    .returning();

  return newAlbum;
}

/** Atualiza um álbum */
export async function updateAlbum(albumId: string, data: UpdateAlbumData) {
  const database = requireDb();

  // Verifica se álbum existe
  await getAlbumById(albumId);

  const updateData: Partial<typeof albums.$inferInsert> = {};

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

  if (data.coverUrl !== undefined) {
    updateData.coverUrl = data.coverUrl.trim() || null;
  }

  if (data.releaseDate !== undefined) {
    updateData.releaseDate = data.releaseDate || null;
  }

  updateData.updatedAt = new Date();

  const [updatedAlbum] = await database
    .update(albums)
    .set(updateData)
    .where(eq(albums.id, albumId))
    .returning();

  return updatedAlbum;
}

/** Deleta um álbum */
export async function deleteAlbum(albumId: string) {
  const database = requireDb();

  // Verifica se álbum existe
  await getAlbumById(albumId);

  await database.delete(albums).where(eq(albums.id, albumId));
}

