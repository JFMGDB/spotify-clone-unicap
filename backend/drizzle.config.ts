import { defineConfig } from 'drizzle-kit';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env' });

/** Configuração do Drizzle Kit para PostgreSQL */
export default defineConfig({
  schema: './src/db/schema.ts',
  out: './src/db/migrations',
  driver: 'pg',
  dbCredentials: {
    connectionString: process.env.DATABASE_URL || '',
  },
  verbose: true,
  strict: true,
} as Parameters<typeof defineConfig>[0]);

