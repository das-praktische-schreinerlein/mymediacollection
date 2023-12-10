SELECT a_id, b_name, a_name as old, a_name as new FROM album inner join bands on album.b_id=bands.b_id
WHERE album.b_id || '_' || SUBSTR(a_name, 1, 4) IN (SELECT b_id || '_' || SUBSTR(a_name, 1, 4) AS name
                               FROM album GROUP BY b_id || '_' || SUBSTR(a_name, 1, 4) HAVING COUNT(*) > 1)
ORDER BY b_name, a_name;


