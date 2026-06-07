-- Current pressures: AI & automation impact layer (curated pilot).

DO $$ BEGIN
  CREATE TYPE pressure_type AS ENUM (
    'augmented',
    'displaced_tasks',
    'transformed',
    'resilient',
    'emerging'
  );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

ALTER TABLE occupations
  ADD COLUMN IF NOT EXISTS pressure_type pressure_type,
  ADD COLUMN IF NOT EXISTS pressure_confidence date_confidence,
  ADD COLUMN IF NOT EXISTS pressure_summary text;

CREATE INDEX IF NOT EXISTS occupations_pressure_type_idx
  ON occupations (pressure_type);