import dotenv from 'dotenv';
import { logger } from '../common/utils/logger';

dotenv.config();

/** Valida e retorna um número inteiro de porta válido */
function parsePort(portString: string | undefined, defaultPort: number): number {
  if (!portString) {
    return defaultPort;
  }
  
  const port = parseInt(portString, 10);
  
  if (isNaN(port) || port < 1 || port > 65535) {
    logger.warn(`Porta inválida "${portString}". Usando porta padrão ${defaultPort}.`);
    return defaultPort;
  }
  
  return port;
}

/** Cache para valores de ambiente pré-computados */
const envCache: {
  DATABASE_URL?: string;
  JWT_SECRET?: string;
  PORT?: number;
  CORS_ORIGIN?: string;
} = {};

/** Helper genérico para cachear valores de ambiente */
function getCachedValue<T>(
  key: keyof typeof envCache,
  getter: () => T
): T {
  if (envCache[key] === undefined) {
    envCache[key] = getter() as any;
  }
  return envCache[key] as T;
}

function getCachedDatabaseUrl(): string {
  return getCachedValue('DATABASE_URL', () => {
    const url = process.env.DATABASE_URL || '';
    return url.trim();
  });
}

function getCachedJwtSecret(): string {
  return getCachedValue('JWT_SECRET', () => {
    return process.env.JWT_SECRET || '';
  });
}

function getCachedPort(): number {
  return getCachedValue('PORT', () => {
    return parsePort(process.env.PORT, 3000);
  });
}

function getCachedCorsOrigin(): string {
  return getCachedValue('CORS_ORIGIN', () => {
    return process.env.CORS_ORIGIN || 'http://localhost:8081';
  });
}

export const env = {
  // Database
  get DATABASE_URL(): string {
    return getCachedDatabaseUrl();
  },
  
  // JWT
  get JWT_SECRET(): string {
    return getCachedJwtSecret();
  },
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '1h',
  
  // Server
  get PORT(): number {
    return getCachedPort();
  },
  NODE_ENV: process.env.NODE_ENV || 'development',
  
  // CORS
  get CORS_ORIGIN(): string {
    return getCachedCorsOrigin();
  },
};

/** Valida variáveis de ambiente e define valores padrão em desenvolvimento */
export function validateEnv(): void {
  const isDevelopment = process.env.NODE_ENV !== 'production';
  
  if (isDevelopment) {
    if (!process.env.JWT_SECRET || process.env.JWT_SECRET.trim() === '') {
      logger.warn(
        'JWT_SECRET não configurada. Usando valor padrão temporário para desenvolvimento.\n' +
        '   Configure JWT_SECRET no arquivo .env para produção.\n' +
        '   Copie .env.example para .env e configure as variáveis.'
      );
      process.env.JWT_SECRET = 'dev-secret-key-change-in-production-' + Date.now();
    }
    
    const databaseUrl = process.env.DATABASE_URL?.trim();
    if (!databaseUrl || databaseUrl === '') {
      logger.warn(
        'DATABASE_URL não configurada.\n' +
        '   O servidor iniciará, mas funcionalidades que requerem banco de dados não funcionarão.'
      );
    }
  } else {
    const required: Array<{ key: string; name: string }> = [
      { key: 'DATABASE_URL', name: 'DATABASE_URL' },
      { key: 'JWT_SECRET', name: 'JWT_SECRET' },
    ];
    
    for (const { key, name } of required) {
      const value = process.env[key];
      if (!value || value.trim() === '') {
        throw new Error(
          `Variável de ambiente obrigatória não encontrada ou vazia: ${name}\n` +
          `Por favor, configure o arquivo .env baseado em .env.example`
        );
      }
    }
  }
}

