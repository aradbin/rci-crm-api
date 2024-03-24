import { Knex } from 'knex';

const tableName = 'voip_logs';

export async function up(knex: Knex) {
  return knex.schema.createTable(tableName, (table) => {
    table.increments();

    table.string('call_id').nullable();
    table.string('remote_number').nullable();
    table.string('local_number').nullable();

    table.jsonb('log').nullable();
    table.text('note').nullable();
    table.integer('received_by').nullable();
    table.integer('customer_id').nullable();

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
