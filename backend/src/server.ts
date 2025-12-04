import { createApp } from './app';
import { env, validateEnv } from './config/env';
import { testConnection } from './config/db';
import { logger } from './common/utils/logger';

/** Entry point do servidor em desenvolvimento */
async function startServer(): Promise<void> {
  try {
    validateEnv();

    if (env.DATABASE_URL) {
      try {
        await testConnection();
      } catch (error) {
        logger.error('Erro ao conectar com banco de dados', error);
        if (env.NODE_ENV === 'production') {
          throw error;
        }
        logger.warn('Continuando sem conexão com banco de dados...');
      }
    }

    const app = createApp();
    const port = env.PORT;
    
    app.listen(port, () => {
      logger.info(`Servidor rodando em http://localhost:${port}`);
      logger.info(`Ambiente: ${env.NODE_ENV}`);
      logger.info(`Health check: http://localhost:${port}/health`);
    }).on('error', (error: NodeJS.ErrnoException) => {
      if (error.code === 'EADDRINUSE') {
        logger.error(`Porta ${port} já está em uso. Escolha outra porta.`, error);
      } else if (error.code === 'EACCES') {
        logger.error(`Sem permissão para usar a porta ${port}. Use uma porta acima de 1024.`, error);
      } else {
        logger.error('Erro ao iniciar servidor', error);
      }
      throw error;
    });
  } catch (error) {
    logger.error('Erro ao iniciar servidor', error);
    process.exit(1);
  }
}

if (require.main === module) {
  startServer();
}

