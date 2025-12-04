import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { env } from './env';
import * as schema from '../db/schema';
import { logger } from '../common/utils/logger';

/** Pool de conexões PostgreSQL (Neon DB requer SSL) */
let pool: Pool | null = null;

/** Inicializa o pool de conexões (singleton pattern) */
function initializePool(): Pool | null {
  if (pool) {
    return pool;
  }
  
  const databaseUrl = env.DATABASE_URL;
  
  if (!databaseUrl || databaseUrl.trim() === '') {
    return null;
  }
  
  try {
    pool = new Pool({
      connectionString: databaseUrl,
      ssl: {
        rejectUnauthorized: false,
      },
    });
    
    pool.on('error', (err: Error) => {
      logger.error('Erro inesperado no pool de conexões', err);
    });
  } catch (error) {
    logger.error('Erro ao criar pool de conexões', error);
    return null;
  }
  
  return pool;
}

/** Instância do Drizzle ORM (retorna null se DATABASE_URL não estiver configurado) */
export const db = (() => {
  const connectionPool = initializePool();
  if (!connectionPool) {
    return null;
  }
  return drizzle(connectionPool, { schema });
})();

/** Testa conexão com banco de dados (não expõe credenciais em erros) */
export async function testConnection(): Promise<void> {
  const connectionPool = pool || initializePool();
  
  if (!connectionPool) {
    throw new Error('DATABASE_URL não configurada ou inválida');
  }
  
  try {
    const result = await Promise.race([
      connectionPool.query('SELECT 1 as test'),
      new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error('Timeout na conexão com banco de dados')), 5000)
      ),
    ]);
    
    if (result && typeof result === 'object' && 'rows' in result) {
      logger.info('Conexão com banco de dados estabelecida com sucesso');
      return;
    }
    
    throw new Error('Resposta inválida do banco de dados');
  } catch (error) {
    logger.error('Erro ao conectar com o banco de dados', error);
    throw new Error(
      'Falha na conexão com o banco de dados. Verifique a configuração do DATABASE_URL.'
    );
  }
}

/** Valida se o banco de dados está disponível */
export function requireDb(): NonNullable<typeof db> {
  if (!db) {
    throw new Error('Banco de dados não está configurado. Verifique a variável DATABASE_URL.');
  }
  return db;
}

/** Verifica se o banco de dados está disponível */
export function isDbAvailable(): boolean {
  return db !== null;
}

/** Fecha todas as conexões do pool */
export async function closeConnection(): Promise<void> {
  if (pool) {
    try {
      await pool.end();
      pool = null;
      logger.info('Conexões do pool encerradas com sucesso');
    } catch (error) {
      logger.error('Erro ao encerrar pool de conexões', error);
      pool = null;
    }
  }
}

