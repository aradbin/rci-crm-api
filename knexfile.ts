import { config } from 'dotenv';
import { Knex } from 'knex';

config();
console.log(`${process.env.DATABASE_URL}?sslmode=require`);
module.exports = {
  client: 'pg',
  connection: {
    connectionString: `${process.env.DATABASE_URL}?sslmode=require`,
  },
  pool: {
    min: 0,
    max: 10,
    idleTimeoutMillis: 30000,
    acquireTimeoutMillis: 60000
  },
  migrations: {
    directory: './src/database/migrations',
    stub: './src/database/migration.stub',
  },
  seeds: {
    directory: './src/database/seeds',
    stub: './src/database/seed.stub',
  },
} as Knex.Config;
