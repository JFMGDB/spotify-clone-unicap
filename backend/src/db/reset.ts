import { sql } from 'drizzle-orm';
import { requireDb, closeConnection } from '../config/db';
import { logger } from '../common/utils/logger';

/**
 * Zera o banco de dados deletando todos os dados de todas as tabelas
 * A ordem de deleção respeita as foreign keys
 */
async function resetDatabase(): Promise<void> {
  const database = requireDb();
  
  try {
    logger.info('Iniciando reset do banco de dados...');
    
    // Ordem de deleção respeitando foreign keys:
    // 1. Tabelas de junção primeiro
    // 2. Tabelas que referenciam outras
    // 3. Tabelas base por último
    
    await database.execute(sql`TRUNCATE TABLE playlist_tracks CASCADE`);
    logger.info('✓ Tabela playlist_tracks limpa');
    
    await database.execute(sql`TRUNCATE TABLE playlists CASCADE`);
    logger.info('✓ Tabela playlists limpa');
    
    await database.execute(sql`TRUNCATE TABLE tracks CASCADE`);
    logger.info('✓ Tabela tracks limpa');
    
    await database.execute(sql`TRUNCATE TABLE albums CASCADE`);
    logger.info('✓ Tabela albums limpa');
    
    await database.execute(sql`TRUNCATE TABLE artists CASCADE`);
    logger.info('✓ Tabela artists limpa');
    
    await database.execute(sql`TRUNCATE TABLE users CASCADE`);
    logger.info('✓ Tabela users limpa');
    
    logger.info('✅ Banco de dados zerado com sucesso!');
  } catch (error) {
    logger.error('Erro ao zerar banco de dados:', error);
    throw error;
  } finally {
    await closeConnection();
  }
}

// Executa o reset se o script for chamado diretamente
if (require.main === module) {
  resetDatabase()
    .then(() => {
      process.exit(0);
    })
    .catch((error) => {
      console.error('Erro fatal:', error);
      process.exit(1);
    });
}

export { resetDatabase };




