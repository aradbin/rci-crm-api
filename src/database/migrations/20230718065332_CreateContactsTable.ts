import { Knex } from 'knex';

const tableName = 'contacts';

export async function up(knex: Knex) {
  return await knex.schema.createTable(tableName, (table) => {
    table.increments();

    table.string('name');
    table.string('email').unique();
    table.string('contact').nullable();
    table.string('address').nullable();
    table.string('avatar').nullable();
    table.string('documents').nullable();
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
  return await knex.schema.dropTable(tableName);
}
