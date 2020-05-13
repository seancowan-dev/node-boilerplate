CREATE TABLE IF NOT EXISTS
reply_comments(
        id uuid DEFAULT uuid_generate_v4 (),
        user_name VARCHAR(128) NOT NULL,
        user_id uuid NOT NULL,
        movie_id INT,
        replying_to uuid REFERENCES user_comments(id) ON DELETE CASCADE,
        comment VARCHAR(128) NOT NULL,
        updated_at TIMESTAMPTZ NOT NULL,
        PRIMARY KEY(id)
);