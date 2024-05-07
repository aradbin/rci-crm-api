import { Knex } from 'knex';

const tableName = 'whatsapp_messages';

export async function up(knex: Knex) {
  return knex.schema.createTable(tableName, (table) => {
    table.increments();

    table.integer('conversation_id').nullable();
    table.string('message_id').nullable();
    table.jsonb('payload').nullable();
    table.string('status').nullable(); // sent, delivered, read, etc

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
