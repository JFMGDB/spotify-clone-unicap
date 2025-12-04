import { AppError } from '../errors/AppError';
import { ErrorCodes } from '../errors/error-codes';

/** Valida se um valor não é nulo ou indefinido */
export function requireNonNull<T>(value: T | null | undefined, message: string): T {
  if (value === null || value === undefined) {
    throw new AppError(message, 400, ErrorCodes.INVALID_INPUT);
  }
  return value;
}

/** Valida se uma string não está vazia */
export function requireNonEmpty(value: string | null | undefined, message: string): string {
  const nonNull = requireNonNull(value, message);
  if (nonNull.trim() === '') {
    throw new AppError(message, 400, ErrorCodes.INVALID_INPUT);
  }
  return nonNull;
}

/** Valida formato de email */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

