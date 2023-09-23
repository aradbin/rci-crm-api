import { Knex } from 'knex';

const tableName = 'customers';

export async function up(knex: Knex) {
  return await knex.schema.createTable(tableName, (table) => {
    table.increments();

    table.string('name');
    table.string('email').nullable().unique();
    table.string('address').nullable();
    table.string('country_code').nullable();
    table.boolean('verified').defaultTo(false);
    table.string('contact').nullable();

    table.timestamp('created_at').nullable();
    table.integer('created_by').nullable();
    table.timestamp('updated_at').nullable();
    table.integer('updated_by').nullable();
    table.timestamp('deleted_at').nullable();
    table.integer('deleted_by').nullable();
  });
}

export async function down(knex: Knex) {
  return await knex.schema.dropTable(tableName);
}
