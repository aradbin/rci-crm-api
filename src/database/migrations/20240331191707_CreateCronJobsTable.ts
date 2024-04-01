import { Knex } from 'knex';
import { RepeatIntervalType } from '../enums/tasks';

const tableName = 'cron_jobs';

export async function up(knex: Knex) {
    return knex.schema.createTable(tableName, (table) => {
        table.increments();

        table.string('type').nullable();
        table.string('title').nullable();
        table.jsonb('meta_data').defaultTo('{}');

        table.timestamp('next_run_time').nullable();
        table.timestamp('start_date').nullable();
        table.timestamp('end_date').nullable();

        table.integer('repeat_amount').defaultTo(0);
        table.string('repeat_interval').defaultTo(RepeatIntervalType.DAILY);

        table.boolean('is_active').defaultTo(true);

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
