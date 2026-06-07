-- Reader suggestion queue for corrections and feedback.

DO $$ BEGIN
  CREATE TYPE suggestion_type AS ENUM ('correction', 'pressure', 'source', 'other');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE suggestion_status AS ENUM ('pending', 'reviewed', 'dismissed');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS suggestions (
  id serial PRIMARY KEY,
  occupation_slug text,
  type suggestion_type NOT NULL,
  message text NOT NULL,
  email text,
  name text,
  status suggestion_status NOT NULL DEFAULT 'pending',
  ip_hash text NOT NULL,
  created_at timestamp NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS suggestions_status_idx ON suggestions (status);
CREATE INDEX IF NOT EXISTS suggestions_created_at_idx ON suggestions (created_at);
CREATE INDEX IF NOT EXISTS suggestions_ip_created_idx ON suggestions (ip_hash, created_at);