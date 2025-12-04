import { logger } from '../utils/logger';

/** Classe de erro customizada com código e status HTTP */
export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500,
    public code?: string
  ) {
    const errorMessage = message && message.trim() !== '' 
      ? message.trim() 
      : 'Erro desconhecido';
    
    super(errorMessage);
    this.name = 'AppError';
    
    if (statusCode < 400 || statusCode >= 600) {
      logger.warn(`Status code inválido ${statusCode}. Usando 500 como padrão.`);
      this.statusCode = 500;
    } else {
      this.statusCode = statusCode;
    }
    
    this.code = code && code.trim() !== '' ? code.trim() : undefined;
    
    if (typeof (Error as any).captureStackTrace === 'function') {
      (Error as any).captureStackTrace(this, this.constructor);
    }
  }
}

