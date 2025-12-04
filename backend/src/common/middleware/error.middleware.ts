import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { AppError } from '../errors/AppError';
import { ErrorCodes } from '../errors/error-codes';
import { logger } from '../utils/logger';
import { env } from '../../config/env';

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
  code: string = ErrorCodes.INTERNAL_ERROR,
  details?: unknown
): { error: { message: string; code: string; details?: unknown } } {
  const response: { error: { message: string; code: string; details?: unknown } } = {
    error: {
      message,
      code,
    },
  };
  
  if (details && env.NODE_ENV === 'development') {
    response.error.details = details;
  }
  
  return response;
}

/** Middleware para validar resultados do express-validator */
export function validateRequest(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(err => ({
      field: err.type === 'field' ? err.path : undefined,
      message: err.msg,
    }));
    
    throw new AppError(
      'Dados de entrada inválidos',
      400,
      ErrorCodes.VALIDATION_ERROR
    );
  }
  
  next();
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
    } else {
      logger.warn(`AppError: ${err.message}`, { code: err.code, statusCode });
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
    const details = env.NODE_ENV === 'development' ? { stack: err.stack } : undefined;
    res.status(500).json(createErrorResponse('Erro interno do servidor', ErrorCodes.INTERNAL_ERROR, details));
    return;
  }

  logger.error('Erro de tipo desconhecido', err);
  res.status(500).json(createErrorResponse('Erro interno do servidor'));
}

