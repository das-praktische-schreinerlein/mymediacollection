-- ------------------------------------
-- add changelog
-- ------------------------------------

ALTER TABLE album ADD COLUMN a_createdat DATE;
ALTER TABLE album ADD COLUMN a_updatedat DATE;
ALTER TABLE album ADD COLUMN a_updateversion INTEGER;

ALTER TABLE bands ADD COLUMN b_createdat DATE;
ALTER TABLE bands ADD COLUMN b_updatedat DATE;
ALTER TABLE bands ADD COLUMN b_updateversion INTEGER;

ALTER TABLE musikrichtung ADD COLUMN mr_createdat DATE;
ALTER TABLE musikrichtung ADD COLUMN mr_updatedat DATE;
ALTER TABLE musikrichtung ADD COLUMN mr_updateversion INTEGER;

ALTER TABLE playlist ADD COLUMN p_createdat DATE;
ALTER TABLE playlist ADD COLUMN p_updatedat DATE;
ALTER TABLE playlist ADD COLUMN p_updateversion INTEGER;

ALTER TABLE titles ADD COLUMN t_createdat DATE;
ALTER TABLE titles ADD COLUMN t_updatedat DATE;
ALTER TABLE titles ADD COLUMN t_updateversion INTEGER;
