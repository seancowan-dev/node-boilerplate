CREATE TRIGGER set_timestamp
BEFORE UPDATE ON registered_users
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

CREATE TRIGGER set_timestamp
BEFORE UPDATE ON list_items
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();