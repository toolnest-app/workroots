CREATE OR REPLACE FUNCTION occupations_search_vector_update() RETURNS trigger AS $$
BEGIN
  NEW.search_vector :=
    setweight(to_tsvector('english', coalesce(NEW.name, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(NEW.summary, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(NEW.search_text, '')), 'C');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS occupations_search_vector_trigger ON occupations;
CREATE TRIGGER occupations_search_vector_trigger
  BEFORE INSERT OR UPDATE ON occupations
  FOR EACH ROW EXECUTE FUNCTION occupations_search_vector_update();