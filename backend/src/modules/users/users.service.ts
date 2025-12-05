import { eq } from 'drizzle-orm';
import { requireDb } from '../../config/db';
import { users } from '../../db/schema';
import { AppError } from '../../common/errors/AppError';
import { ErrorCodes } from '../../common/errors/error-codes';

/** Busca um usuário por ID */
export async function getUserById(userId: string) {
  const database = requireDb();

  const [user] = await database
    .select({
      id: users.id,
      email: users.email,
      name: users.name,
      createdAt: users.createdAt,
      updatedAt: users.updatedAt,
    })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  if (!user) {
    throw new AppError('Usuário não encontrado', 404, ErrorCodes.NOT_FOUND);
  }

  return user;
}

