import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(__dirname, '../../../../.env') });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: Number(process.env.DB_POOL_MAX ?? 5),
  idleTimeoutMillis: Number(process.env.DB_POOL_IDLE_TIMEOUT_MS ?? 15000),
  connectionTimeoutMillis: Number(
    process.env.DB_POOL_CONNECTION_TIMEOUT_MS ?? 5000,
  ),
  statement_timeout: Number(process.env.DB_STATEMENT_TIMEOUT_MS ?? 30000),
  keepAlive: true,
  keepAliveInitialDelayMillis: 10000,
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

async function shutdownPool() {
  try {
    pool.removeAllListeners('error');
    await pool.end();
    console.log('DB pool closed');
  } catch (e) {
    console.error('Error closing DB pool', e);
  }
}

process.on('SIGINT', shutdownPool);
process.on('SIGTERM', shutdownPool);

export const db = drizzle(pool, { schema });
