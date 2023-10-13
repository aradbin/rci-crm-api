import { Knex } from 'knex';

const tableName = 'user_messages';

export async function up(knex: Knex) {
  return knex.schema.createTable(tableName, (table) => {
    table.increments();
    table.integer('recipient_id').nullable();

    table.string('message_body').nullable();
    table.string('context_message_id').nullable();
    table.string('message_type').defaultTo('text'); // text, template, image, video, document, audio, location, contact, sticker, etc
    table.string('message_status').defaultTo('sent'); // sent, delivered, read, etc

    table.jsonb('attachments').nullable();

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
