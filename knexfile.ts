import { config } from 'dotenv';
import { Knex } from 'knex';

config();
console.log(process.env.DATABASE_URL);
module.exports = {
  client: 'pg',
  connection: process.env.DATABASE_URL,
  pool: {
    min: 0,
    max: 10,
    idleTimeoutMillis: 30000,
    acquireTimeoutMillis: 60000,
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
