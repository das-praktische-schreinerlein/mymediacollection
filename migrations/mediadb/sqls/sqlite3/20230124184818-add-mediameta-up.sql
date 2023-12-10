-- ----------------
-- add mediameta-fields
-- ----------------
ALTER TABLE titles ADD COLUMN t_datefile DATETIME DEFAULT NULL;
