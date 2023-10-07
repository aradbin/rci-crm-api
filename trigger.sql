DROP TYPE IF EXISTS activity_log_row ON tasks;

CREATE TYPE activity_log_row AS (
  status_type int, -- 1 means the status was updated, 2 means the progress status was updated
  old_status text,
  new_status text,
  updated_by text,
  updated_at timestamp
);

CREATE OR REPLACE FUNCTION update_activity_log_on_status()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status <> OLD.status THEN
    NEW.activity_log = jsonb_set(
      COALESCE(OLD.activity_log, '{}'::jsonb),
      ARRAY[jsonb_array_length(COALESCE(NEW.activity_log, '{}'::jsonb))::text],
      to_jsonb(ROW(
        1,
        OLD.status,
        NEW.status,
        NEW.updated_by,
        now()
      )::activity_log_row)
    );
    UPDATE tasks SET activity_log = NEW.activity_log WHERE id = NEW.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_activity_log_on_status_trigger ON tasks;

CREATE TRIGGER update_activity_log_on_status_trigger
AFTER UPDATE OF status ON tasks
FOR EACH ROW
EXECUTE FUNCTION update_activity_log_on_status();


CREATE OR REPLACE FUNCTION update_activity_log_on_progress_status()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.progress_status <> OLD.progress_status THEN
    NEW.activity_log = jsonb_set(
      COALESCE(OLD.activity_log, '{}'::jsonb),
      ARRAY[jsonb_array_length(COALESCE(NEW.activity_log, '{}'::jsonb))::text],
      to_jsonb(ROW(
        2,
        OLD.progress_status,
        NEW.progress_status,
        NEW.updated_by,
        now()
      )::activity_log_row)
    );
    UPDATE tasks SET activity_log = NEW.activity_log WHERE id = NEW.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_activity_log_on_progress_status_trigger ON tasks;

CREATE TRIGGER update_activity_log_on_progress_status_trigger
AFTER UPDATE OF progress_status ON tasks
FOR EACH ROW
EXECUTE FUNCTION update_activity_log_on_progress_status();

# Work Schedule
1. 4-10-23 -> 2 hrs
2. 5-10-23 -> 2 hrs
3. 6-10-23 -> 3 hrs
4. 7-10-23 -> 1.5 hrs
