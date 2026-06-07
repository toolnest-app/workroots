-- Enhanced content tier + Wikidata linkage for stub enrichment pipeline.

ALTER TYPE content_tier ADD VALUE IF NOT EXISTS 'enhanced';

ALTER TABLE occupations
  ADD COLUMN IF NOT EXISTS wikidata_id text;

CREATE INDEX IF NOT EXISTS occupations_wikidata_id_idx
  ON occupations (wikidata_id);