import { Knex } from 'knex';

const tableName = 'whatsapp_business_numbers';

export async function up(knex: Knex) {
  return knex.schema.createTable(tableName, (table) => {
    table.increments();

    table.string('name').nullable();
    table.string('access_token').nullable();
    table.string('phone_number').nullable();
    table.string('phone_number_id').nullable();
    table.string('whatsapp_business_account_id').nullable();

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
