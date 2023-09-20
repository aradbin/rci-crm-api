import { Knex } from 'knex';

const tableName = 'tasks';

export async function up(knex: Knex) {
  return knex.schema.createTable(tableName, (table) => {
    table.increments();

    table
      .integer('customer_id')
      .unsigned()
      .references('id')
      .inTable('customers')
      .onDelete('SET NULL')
      .index();

    table
      .integer('assignee_id')
      .unsigned()
      .references('id')
      .inTable('users')
      .onDelete('SET NULL')
      .index();

    table.string('title').nullable();
    table.string('description').nullable();
    table.smallint('priority').nullable();

    table
      .enum('status', ['created', 'assigned', 'finished', 'delivered'])
      .nullable();

    table.enum('progress_status', ['to_do', 'doing', 'done']).nullable();

    table.jsonb('metadata').nullable();
    table.jsonb('activity_log').nullable();
    table.jsonb('attachments').nullable();

    table.timestamp('due_date').nullable();
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
