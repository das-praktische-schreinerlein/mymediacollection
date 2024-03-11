-- -----------------------
-- start with titles
-- -----------------------

--set updatedate
UPDATE titles SET t_updatedat=t_createdat, t_updateversion=1 WHERE t_updatedat is null;

        
-- -----------------------
-- album
-- -----------------------
--use created=min(t_createdat), updated=max(t_createdat)
UPDATE album
SET a_createdat=children.createdat
FROM (
       SELECT MIN(createdat) AS createdat, a_id FROM (
           SELECT MIN(t_createdat) AS createdat, a_id FROM titles GROUP BY a_id
       ) GROUP BY a_id
     ) AS children
WHERE a_createdat IS NULL AND album.a_id = children.a_id;

UPDATE album
SET a_updatedat=children.createdat,
    a_updateversion=1
FROM (
       SELECT MAX(createdat) AS createdat, a_id FROM (
           SELECT MAX(t_createdat) AS createdat, a_id FROM titles GROUP BY a_id
       ) GROUP BY a_id
     ) AS children
WHERE a_updatedat IS NULL AND album.a_id = children.a_id;

--fallback: use default-value
UPDATE album SET a_createdat='2016-01-07 10:00:00' WHERE a_createdat IS NULL;
UPDATE album SET a_updatedat=a_createdat, a_updateversion=1 WHERE a_updatedat is null;


-- -----------------------
-- bands
-- -----------------------
--use created=min(t_createdat, a_createdat), updated=max(t_updatedat, a_cratedat)
UPDATE bands
SET b_createdat=children.createdat
FROM (
       SELECT MIN(createdat) AS createdat, b_id FROM (
           SELECT MIN(t_createdat) AS createdat, b_id FROM titles GROUP BY b_id
           UNION
           SELECT MIN(a_createdat) AS createdat, b_id FROM album GROUP BY b_id
           UNION
           SELECT MIN(a_createdat) AS createdat, album_bands.b_id FROM album INNER JOIN album_bands WHERE album.a_id=album_bands.a_id GROUP BY album_bands.b_id
       ) GROUP BY b_id
     ) AS children
WHERE b_createdat IS NULL AND bands.b_id = children.b_id;

UPDATE bands
SET b_updatedat=children.createdat,
    b_updateversion=1
FROM (
       SELECT MAX(createdat) AS createdat, b_id FROM (
           SELECT MAX(t_createdat) AS createdat, b_id FROM titles GROUP BY b_id
           UNION
           SELECT MAX(a_createdat) AS createdat, b_id FROM album GROUP BY b_id
           UNION
           SELECT MAX(a_createdat) AS createdat, album_bands.b_id FROM album INNER JOIN album_bands WHERE album.a_id=album_bands.a_id GROUP BY album_bands.b_id
       ) GROUP BY b_id
     ) AS children
WHERE b_updatedat IS NULL AND bands.b_id = children.b_id;

--fallback: use default-value
UPDATE bands SET b_createdat='2016-01-07 10:00:00' WHERE b_createdat IS NULL;
UPDATE bands SET b_updatedat=b_createdat, b_updateversion=1 WHERE b_updatedat is null;


-- -----------------------
-- musikrichtung
-- -----------------------
--use created=min(t_createdat, a_createdat, b_createdat), updated=max(t_updatedat, a_cratedat, b_cratedat)
UPDATE musikrichtung
SET mr_createdat=children.createdat
FROM (
       SELECT MIN(createdat) AS createdat, mr_id FROM (
           SELECT MIN(t_createdat) AS createdat, mr_id FROM titles GROUP BY mr_id
           UNION
           SELECT MIN(a_createdat) AS createdat, mr_id FROM album GROUP BY mr_id
           UNION
           SELECT MIN(b_createdat) AS createdat, mr_id FROM bands GROUP BY mr_id
       ) GROUP BY mr_id
     ) AS children
WHERE mr_createdat IS NULL AND musikrichtung.mr_id = children.mr_id;

UPDATE musikrichtung
SET mr_updatedat=children.createdat,
    mr_updateversion=1
FROM (
       SELECT MAX(createdat) AS createdat, mr_id FROM (
           SELECT MAX(t_createdat) AS createdat, mr_id FROM titles GROUP BY mr_id
           UNION
           SELECT MIN(a_createdat) AS createdat, mr_id FROM album GROUP BY mr_id
           UNION
           SELECT MAX(b_createdat) AS createdat, mr_id FROM bands GROUP BY mr_id
       ) GROUP BY mr_id
     ) AS children
WHERE mr_updatedat IS NULL AND musikrichtung.mr_id = children.mr_id;

--fallback: use default-value
UPDATE musikrichtung SET mr_createdat='2016-01-07 10:00:00' WHERE mr_createdat IS NULL;
UPDATE musikrichtung SET mr_updatedat=mr_createdat, mr_updateversion=1 WHERE mr_updatedat is null;

-- -----------------------
-- playlist
-- -----------------------
--use created=min(t_createdat), updated=max(t_createdat)
UPDATE playlist
  SET p_createdat=children.createdat
  FROM (
    SELECT MIN(createdat) AS createdat, p_id FROM (
        SELECT MIN(t_createdat) AS createdat, p_id FROM titles INNER JOIN titles_playlist ON titles.t_id=titles_playlist.t_id GROUP BY p_id
    ) GROUP BY p_id
  ) AS children
WHERE p_createdat IS NULL AND playlist.p_id = children.p_id;

UPDATE playlist
  SET p_updatedat=children.createdat,
  p_updateversion=1
  FROM (
    SELECT MAX(createdat) AS createdat, p_id FROM (
        SELECT MAX(t_createdat) AS createdat, p_id FROM titles INNER JOIN titles_playlist ON titles.t_id=titles_playlist.t_id GROUP BY p_id
    ) GROUP BY p_id
  ) AS children
WHERE p_updatedat IS NULL AND playlist.p_id = children.p_id;

--fallback: use default-value
UPDATE playlist SET p_createdat='2016-01-07 10:00:00' WHERE p_createdat IS NULL;
UPDATE playlist SET p_updatedat=p_createdat, p_updateversion=1 WHERE p_updatedat is null;


