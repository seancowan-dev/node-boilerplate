CREATE TABLE IF NOT EXISTS
user_comments(
        id uuid DEFAULT uuid_generate_v4 (),
        user_id uuid NOT NULL,
        reply boolean NOT NULL,
        movie_id VARCHAR(128),
        replying_comment uuid,
        comment VARCHAR(128) NOT NULL,
        updated_at TIMESTAMPTZ NOT NULL,
        PRIMARY KEY(id)
);