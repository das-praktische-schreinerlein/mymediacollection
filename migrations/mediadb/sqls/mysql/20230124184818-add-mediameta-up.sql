-- ----------------
-- add mediameta-fields
-- ----------------
ALTER TABLE titles ADD COLUMN IF NOT EXISTS t_datefile DATETIME DEFAULT NULL;
