import { Knex } from 'knex';
import { TaskStatus } from '../enums/tasks';

const tableName = 'tasks';

const CREATE_LOG_TYPE = () => `
CREATE TYPE activity_log_row AS (
  type text, -- status / assignee_id
  old_value text,
  new_value text,
  updated_by text,
  updated_at timestamp
);
`;

const DROP_LOG_TYPE = () => `
DROP TYPE activity_log_row;
`;

const UPDATE_ACTIVITY_LOG_FUNCTION = (column: string) => `
CREATE OR REPLACE FUNCTION update_activity_log_${column}()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.${column} <> OLD.${column} THEN
    NEW.activity_log = jsonb_set(
      COALESCE(OLD.activity_log, '[]'::jsonb),
      ARRAY[jsonb_array_length(COALESCE(NEW.activity_log, '[]'::jsonb))::text],
      to_jsonb(ROW(
        '${column}'::text,
        OLD.${column},
        NEW.${column},
        NEW.updated_by,
        now()
      )::activity_log_row)
    );
    UPDATE tasks SET activity_log = NEW.activity_log WHERE id = NEW.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
`;

const DROP_UPDATE_ACTIVITY_LOG_FUNCTION = (column: string) => `
DROP FUNCTION update_activity_log_on_${column}();
`;

const UPDATE_ACTIVITY_LOG_TRIGGER = (column: string) => `
CREATE TRIGGER update_activity_log_on_${column}_trigger
AFTER UPDATE OF ${column} ON tasks
FOR EACH ROW
EXECUTE FUNCTION update_activity_log_${column}();
`;

const DROP_UPDATE_ACTIVITY_LOG_TRIGGER = (column: string) => `
DROP TRIGGER update_activity_log_on_${column}_trigger;
`;

export async function up(knex: Knex) {
  return await knex.schema
    .createTable(tableName, (table) => {
      table.increments();

      table.integer('customer_id').nullable();
      table.integer('assignee_id').nullable();
      table.integer('reporter_id').nullable();
      table.integer('type_id').nullable();
      table.integer('parent_id').nullable();

      table.string('title').nullable();
      table.string('description').nullable();
      table.smallint('priority').nullable();
      table.string('status').defaultTo(TaskStatus.TODO);
      table.boolean('running').defaultTo(false);

      table.timestamp('due_date').nullable();
      table.string('estimation').nullable();

      table.jsonb('time_log').defaultTo('[]');
      table.jsonb('activity_log').defaultTo('[]');
      table.jsonb('attachments').nullable();

      table.timestamp('created_at').nullable();
      table.integer('created_by').nullable();
      table.timestamp('updated_at').nullable();
      table.integer('updated_by').nullable();
      table.timestamp('completed_at').nullable();
      table.integer('completed_by').nullable();
      table.timestamp('deleted_at').nullable();
      table.integer('deleted_by').nullable();
    })
    .then(
      () => knex.raw(CREATE_LOG_TYPE()),
      (err) => console.log(err),
    )
    .then(
      () => knex.raw(UPDATE_ACTIVITY_LOG_FUNCTION('status')),
      (err) => console.log(err),
    )
    .then(
      () => knex.raw(UPDATE_ACTIVITY_LOG_FUNCTION('assignee_id')),
      (err) => console.log(err),
    )
    .then(
      () => knex.raw(UPDATE_ACTIVITY_LOG_TRIGGER('status')),
      (err) => console.log(err),
    )
    .then(
      () => knex.raw(UPDATE_ACTIVITY_LOG_TRIGGER('assignee_id')),
      (err) => console.log(err),
    );
}

export async function down(knex: Knex) {
  return await knex.schema
    .dropTable(tableName)
    .then(
      () => knex.raw(DROP_UPDATE_ACTIVITY_LOG_TRIGGER('status')),
      (err) => console.log(err),
    )
    .then(
      () => knex.raw(DROP_UPDATE_ACTIVITY_LOG_TRIGGER('assignee_id')),
      (err) => console.log(err),
    )
    .then(
      () => knex.raw(DROP_UPDATE_ACTIVITY_LOG_FUNCTION('status')),
      (err) => console.log(err),
    )
    .then(
      () => knex.raw(DROP_UPDATE_ACTIVITY_LOG_FUNCTION('assignee_id')),
      (err) => console.log(err),
    )
    .then(
      () => knex.raw(DROP_LOG_TYPE()),
      (err) => console.log(err),
    );
}
