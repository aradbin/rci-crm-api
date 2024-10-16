import { Knex } from 'knex';

const tableName = 'users';

export async function up(knex: Knex) {
  return knex.schema.createTable(tableName, (table) => {
    table.increments();

    table.string('name');
    table.string('email').unique();
    table.string('username').nullable().unique();
    table.string('password').nullable();
    table.string('contact').nullable();
    table.string('address').nullable();
    table.string('avatar').nullable();
    table.boolean('verified').defaultTo(false);
    table.boolean('is_active').defaultTo(true);
    table.jsonb('metadata').nullable();

    table.timestamp('created_at').nullable();
    table.integer('created_by').nullable();
    table.timestamp('updated_at').nullable();
    table.integer('updated_by').nullable();
    table.timestamp('deleted_at').nullable();
    table.integer('deleted_by').nullable();
  });
}

export async function down(knex: Knex) {
  return knex.schema.dropTable(tableName);
}
