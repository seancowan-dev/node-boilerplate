CREATE TABLE IF NOT EXISTS
    list_items(
        id uuid DEFAULT uuid_generate_v4 (),
        title VARCHAR(128) UNIQUE NOT NULL,
        date_added TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        list_id uuid REFERENCES user_lists(id) ON DELETE CASCADE
    )