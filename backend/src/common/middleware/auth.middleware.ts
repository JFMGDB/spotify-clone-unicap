import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { eq } from 'drizzle-orm';
import { requireDb } from '../../config/db';
import { users } from '../../db/schema';
import { AppError } from '../errors/AppError';
import { ErrorCodes } from '../errors/error-codes';
import { env } from '../../config/env';

/** Estende o tipo Request do Express para incluir userId */
declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

/** Interface para payload do JWT */
interface JwtPayload {
  userId: string;
  email: string;
}

/** Middleware de autenticação JWT */
export async function authMiddleware(
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> {
  try {
    // Extrai token do header Authorization
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new AppError('Token não fornecido', 401, ErrorCodes.NO_TOKEN);
    }

    if (!authHeader.startsWith('Bearer ')) {
      throw new AppError('Formato de token inválido. Use: Bearer <token>', 401, ErrorCodes.NO_TOKEN);
    }

    const token = authHeader.substring(7).trim(); // Remove "Bearer " e espaços

    if (!token || token.length === 0) {
      throw new AppError('Token não fornecido', 401, ErrorCodes.NO_TOKEN);
    }

    // Verifica e decodifica token
    let decoded: JwtPayload;
    try {
      decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
    } catch (error) {
      throw new AppError('Token inválido ou expirado', 401, ErrorCodes.INVALID_TOKEN);
    }

    // Verifica se usuário ainda existe no banco
    const database = requireDb();
    const [user] = await database
      .select({ id: users.id })
      .from(users)
      .where(eq(users.id, decoded.userId))
      .limit(1);

    if (!user) {
      throw new AppError('Usuário não encontrado', 401, ErrorCodes.UNAUTHORIZED);
    }

    // Adiciona userId ao request
    req.userId = decoded.userId;

    next();
  } catch (error) {
    if (error instanceof AppError) {
      next(error);
    } else {
      next(new AppError('Erro na autenticação', 401, ErrorCodes.UNAUTHORIZED));
    }
  }
}

/** Middleware de autenticacao opcional - extrai userId se token existir, mas nao bloqueia */
export async function optionalAuthMiddleware(
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authHeader = req.headers.authorization;

    // Se nao houver token, continua sem autenticacao
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next();
    }

    const token = authHeader.substring(7).trim();

    if (!token || token.length === 0) {
      return next();
    }

    // Tenta decodificar o token
    try {
      const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
      
      // Verifica se usuario existe
      const database = requireDb();
      const [user] = await database
        .select({ id: users.id })
        .from(users)
        .where(eq(users.id, decoded.userId))
        .limit(1);

      if (user) {
        req.userId = decoded.userId;
      }
    } catch {
      // Token invalido - ignora e continua sem autenticacao
    }

    next();
  } catch {
    // Em caso de erro, continua sem autenticacao
    next();
  }
}

