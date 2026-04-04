import { Client } from 'pg';

/**
 * Connects to the default `postgres` database and creates the target
 * database if it doesn't already exist. Must run before NestJS boots
 * so TypeORM can connect successfully.
 */
export async function ensureDatabase(): Promise<void> {
  const host = process.env.DB_HOST ?? 'localhost';
  const port = Number(process.env.DB_PORT ?? 5432);
  const user = process.env.DB_USER ?? 'postgres';
  const password = process.env.DB_PASS ?? 'postgres';
  const dbName = process.env.DB_NAME ?? 'backroom';

  const client = new Client({ host, port, user, password, database: 'postgres' });

  try {
    await client.connect();
    const result = await client.query(
      `SELECT 1 FROM pg_database WHERE datname = $1`,
      [dbName],
    );
    if (result.rowCount === 0) {
      // identifiers can't be parameterised — dbName comes from trusted env
      await client.query(`CREATE DATABASE "${dbName}"`);
      console.log(`✔  Database "${dbName}" created.`);
    } else {
      console.log(`✔  Database "${dbName}" already exists.`);
    }
  } finally {
    await client.end();
  }
}
