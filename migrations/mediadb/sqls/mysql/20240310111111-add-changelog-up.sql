-- ------------------------------------
-- add changelog
-- ------------------------------------

ALTER TABLE album ADD COLUMN IF NOT EXISTS a_createdat DATE;
ALTER TABLE album ADD COLUMN IF NOT EXISTS a_updatedat DATE;
ALTER TABLE album ADD COLUMN IF NOT EXISTS a_updateversion INTEGER;

ALTER TABLE bands ADD COLUMN IF NOT EXISTS b_createdat DATE;
ALTER TABLE bands ADD COLUMN IF NOT EXISTS b_updatedat DATE;
ALTER TABLE bands ADD COLUMN IF NOT EXISTS b_updateversion INTEGER;

ALTER TABLE musikrichtung ADD COLUMN IF NOT EXISTS mr_createdat DATE;
ALTER TABLE musikrichtung ADD COLUMN IF NOT EXISTS mr_updatedat DATE;
ALTER TABLE musikrichtung ADD COLUMN IF NOT EXISTS mr_updateversion INTEGER;

ALTER TABLE playlist ADD COLUMN IF NOT EXISTS p_createdat DATE;
ALTER TABLE playlist ADD COLUMN IF NOT EXISTS p_updatedat DATE;
ALTER TABLE playlist ADD COLUMN IF NOT EXISTS p_updateversion INTEGER;

ALTER TABLE titles ADD COLUMN IF NOT EXISTS t_createdat DATE;
ALTER TABLE titles ADD COLUMN IF NOT EXISTS t_updatedat DATE;
ALTER TABLE titles ADD COLUMN IF NOT EXISTS t_updateversion INTEGER;
