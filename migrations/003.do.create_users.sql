CREATE TABLE IF NOT EXISTS
      registered_users(
        id uuid DEFAULT uuid_generate_v4 (),
        name VARCHAR(128) UNIQUE NOT NULL,
        email VARCHAR(128) UNIQUE NOT NULL,
        password VARCHAR(128) NOT NULL,
        created_at TIMESTAMPTZ NOT NULL,
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        PRIMARY KEY(id)
      )