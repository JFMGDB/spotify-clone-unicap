import { eq, ilike } from 'drizzle-orm';
import { requireDb } from '../../config/db';
import { artists } from '../../db/schema';
import { AppError } from '../../common/errors/AppError';
import { ErrorCodes } from '../../common/errors/error-codes';

/** Interface para criação de artista */
export interface CreateArtistData {
  name: string;
  imageUrl?: string;
  bio?: string;
}

/** Interface para atualização de artista */
export interface UpdateArtistData {
  name?: string;
  imageUrl?: string;
  bio?: string;
}

/** Lista todos os artistas */
export async function getAllArtists(search?: string) {
  const database = requireDb();

  if (search) {
    return await database
      .select()
      .from(artists)
      .where(ilike(artists.name, `%${search}%`));
  }

  return await database.select().from(artists);
}

/** Busca um artista por ID */
export async function getArtistById(artistId: string) {
  const database = requireDb();

  const [artist] = await database
    .select()
    .from(artists)
    .where(eq(artists.id, artistId))
    .limit(1);

  if (!artist) {
    throw new AppError('Artista não encontrado', 404, ErrorCodes.NOT_FOUND);
  }

  return artist;
}

/** Cria um novo artista */
export async function createArtist(data: CreateArtistData) {
  const database = requireDb();

  if (!data.name || data.name.trim().length === 0) {
    throw new AppError('Nome é obrigatório', 400, ErrorCodes.VALIDATION_ERROR);
  }

  const [newArtist] = await database
    .insert(artists)
    .values({
      name: data.name.trim(),
      imageUrl: data.imageUrl?.trim() || null,
      bio: data.bio?.trim() || null,
    })
    .returning();

  return newArtist;
}

/** Atualiza um artista */
export async function updateArtist(artistId: string, data: UpdateArtistData) {
  const database = requireDb();

  // Verifica se artista existe
  await getArtistById(artistId);

  const updateData: Partial<typeof artists.$inferInsert> = {};

  if (data.name !== undefined) {
    if (data.name.trim().length === 0) {
      throw new AppError('Nome não pode ser vazio', 400, ErrorCodes.VALIDATION_ERROR);
    }
    updateData.name = data.name.trim();
  }

  if (data.imageUrl !== undefined) {
    updateData.imageUrl = data.imageUrl.trim() || null;
  }

  if (data.bio !== undefined) {
    updateData.bio = data.bio.trim() || null;
  }

  updateData.updatedAt = new Date();

  const [updatedArtist] = await database
    .update(artists)
    .set(updateData)
    .where(eq(artists.id, artistId))
    .returning();

  return updatedArtist;
}

/** Deleta um artista */
export async function deleteArtist(artistId: string) {
  const database = requireDb();

  // Verifica se artista existe
  await getArtistById(artistId);

  await database.delete(artists).where(eq(artists.id, artistId));
}

