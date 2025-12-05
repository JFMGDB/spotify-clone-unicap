import { createApp } from './app';
import { env, validateEnv } from './config/env';
import { testConnection, closeConnection } from './config/db';
import { logger } from './common/utils/logger';
import { Server } from 'http';

/** Instância do servidor para graceful shutdown */
let server: Server | null = null;

/** Função para encerrar o servidor graciosamente */
async function gracefulShutdown(signal: string): Promise<void> {
  logger.info(`Recebido sinal ${signal}. Iniciando graceful shutdown...`);
  
  if (server) {
    server.close(() => {
      logger.info('Servidor HTTP encerrado');
    });
  }
  
  try {
    await closeConnection();
    logger.info('Conexões do banco de dados encerradas');
    process.exit(0);
  } catch (error) {
    logger.error('Erro durante graceful shutdown', error);
    process.exit(1);
  }
}

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
    
    // Vincular ao 0.0.0.0 para aceitar conexoes de dispositivos externos
    const host = '0.0.0.0';
    server = app.listen(port, host, () => {
      logger.info(`Servidor rodando em http://${host}:${port}`);
      logger.info(`Ambiente: ${env.NODE_ENV}`);
      logger.info(`Health check: http://localhost:${port}/health`);
    });
    
    server.on('error', (error: NodeJS.ErrnoException) => {
      if (error.code === 'EADDRINUSE') {
        logger.error(`Porta ${port} já está em uso. Escolha outra porta.`, error);
      } else if (error.code === 'EACCES') {
        logger.error(`Sem permissão para usar a porta ${port}. Use uma porta acima de 1024.`, error);
      } else {
        logger.error('Erro ao iniciar servidor', error);
      }
      throw error;
    });

    // Configurar handlers para graceful shutdown
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
    
    // Tratamento de erros não capturados
    process.on('uncaughtException', (error: Error) => {
      logger.error('Erro não capturado', error);
      gracefulShutdown('uncaughtException');
    });
    
    process.on('unhandledRejection', (reason: unknown) => {
      logger.error('Promise rejeitada não tratada', reason);
      gracefulShutdown('unhandledRejection');
    });
  } catch (error) {
    logger.error('Erro ao iniciar servidor', error);
    process.exit(1);
  }
}

if (require.main === module) {
  startServer();
}

