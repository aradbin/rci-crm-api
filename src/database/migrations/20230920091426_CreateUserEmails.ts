import { Knex } from "knex"

const tableName = 'user_emails'

export async function up(knex: Knex) {
    return knex.schema.createTable(tableName, table => {
      table.increments()
      table.string('host').nullable();
      table.string('username').nullable();
      table.string('password').nullable();
      table.timestamp('created_at').nullable()
      table.integer('created_by').nullable()
      table.timestamp('updated_at').nullable()
      table.integer('updated_by').nullable()
      table.timestamp('deleted_at').nullable()
      table.integer('deleted_by').nullable()
    })
}

export async function down(knex: Knex) {
  return knex.schema.dropTable(tableName)
}