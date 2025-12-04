import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/AppError';
import { ErrorCodes } from '../errors/error-codes';
import { logger } from '../utils/logger';

/** Middleware para tratar rotas não encontradas (404) */
export function notFoundMiddleware(
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  res.status(404).json({
    error: {
      message: 'Rota não encontrada',
      code: ErrorCodes.NOT_FOUND,
    },
  });
}

/** Cria resposta de erro padronizada */
function createErrorResponse(
  message: string,
  code: string = ErrorCodes.INTERNAL_ERROR
): { error: { message: string; code: string } } {
  return {
    error: {
      message,
      code,
    },
  };
}

/** Middleware de tratamento de erros global */
export function errorMiddleware(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (!err) {
    logger.error('Erro middleware chamado sem erro válido');
    res.status(500).json(createErrorResponse('Erro interno do servidor'));
    return;
  }

  if (err instanceof AppError) {
    const statusCode = err.statusCode >= 400 && err.statusCode < 600 
      ? err.statusCode 
      : 500;
    
    if (statusCode >= 500) {
      logger.error('AppError com status 5xx', err);
    }
    
    res.status(statusCode).json(
      createErrorResponse(
        err.message || 'Erro desconhecido',
        err.code || ErrorCodes.INTERNAL_ERROR
      )
    );
    return;
  }

  if (err instanceof Error) {
    logger.error('Erro não tratado', err);
    res.status(500).json(createErrorResponse('Erro interno do servidor'));
    return;
  }

  logger.error('Erro de tipo desconhecido', err);
  res.status(500).json(createErrorResponse('Erro interno do servidor'));
}

