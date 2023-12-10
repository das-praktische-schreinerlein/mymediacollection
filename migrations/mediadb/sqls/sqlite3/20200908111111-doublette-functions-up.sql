-- ------------------------------------
-- doublette functions
-- ------------------------------------
select 1;

-- ------------------------------------
-- doublette indexes
-- ------------------------------------
DROP INDEX IF EXISTS idx_t__t_DIR_FILE;
CREATE INDEX idx_t__t_DIR_FILE ON titles (t_DIR, t_FILE) ;

-- ------------------------------------
-- fields
-- ------------------------------------
ALTER TABLE titles ADD COLUMN t_key VARCHAR(255) DEFAULT '' ;
ALTER TABLE titles ADD COLUMN t_metadata TEXT;
UPDATE titles SET t_key=REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(LOWER(t_name), "ß", "ss"), "ö", "oe"), "ü", "ue"), "ä", "ae"), "[^a-z0-9]", "") ;
DROP INDEX IF EXISTS idx_t__t_key;
CREATE INDEX idx_t__t_key ON titles (t_key);

ALTER TABLE album ADD COLUMN a_key VARCHAR(255) NOT NULL DEFAULT '' ;
UPDATE album SET a_key=REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(LOWER(a_name), "ß", "ss"), "ö", "oe"), "ü", "ue"), "ä", "ae"), "[^a-z0-9]", "") ;
DROP INDEX IF EXISTS idx_a__a_key;
CREATE INDEX idx_a__a_key ON album (a_key);

ALTER TABLE bands ADD COLUMN b_key VARCHAR(255) NOT NULL DEFAULT '' ;
UPDATE bands SET b_key=REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(LOWER(b_name), "die ", ""), "the ", ""), "ß", "ss"), "ö", "oe"), "ü", "ue"), "ä", "ae"), "[^a-z0-9]", "") ;
DROP INDEX IF EXISTS idx_b__b_key;
CREATE INDEX idx_b__b_key ON bands (b_key);

ALTER TABLE musikrichtung ADD COLUMN mr_key VARCHAR(255) NOT NULL DEFAULT '' ;
UPDATE musikrichtung SET mr_key=REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(LOWER(mr_name), "ß", "ss"), "ö", "oe"), "ü", "ue"), "ä", "ae"), "[^a-z0-9]", "") ;
DROP INDEX IF EXISTS idx_mr__mr_key;
CREATE INDEX idx_mr__mr_key ON musikrichtung (mr_key);
