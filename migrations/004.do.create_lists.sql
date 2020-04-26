CREATE TABLE IF NOT EXISTS
    user_lists(
        id uuid DEFAULT uuid_generate_v4 (),
        user_id uuid NOT NULL,
        list_name VARCHAR(128) NOT NULL,
        PRIMARY KEY(id)
    )