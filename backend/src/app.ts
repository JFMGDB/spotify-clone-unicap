import express, { Express } from 'express';
import cors from 'cors';
import { env } from './config/env';
import routes from './routes';
import { notFoundMiddleware, errorMiddleware } from './common/middleware/error.middleware';

/** Cria e configura a aplicação Express */
export function createApp(): Express {
  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use(
    cors({
      origin: env.CORS_ORIGIN,
      credentials: true,
    })
  );

  app.use('/', routes);
  app.use(notFoundMiddleware);
  app.use(errorMiddleware);

  return app;
}

