-- ------------------------------------
-- create functions
-- ------------------------------------

DROP FUNCTION IF EXISTS `GetTechName`  $$
CREATE FUNCTION GetTechName(pName TEXT) RETURNS VARCHAR(2000)
  DETERMINISTIC
  BEGIN
    RETURN LOWER(REGEXP_REPLACE(pName, '[- /()+;.]', '_'));
END $$
