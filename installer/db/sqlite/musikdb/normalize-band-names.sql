UPDATE bands SET b_name=REPLACE(b_name, 'The ', '') WHERE b_name LIKE 'The %';
UPDATE bands SET b_name=REPLACE(b_name, 'the ', '') WHERE b_name LIKE 'the %';
UPDATE bands SET b_name=REPLACE(b_name, 'Die ', '') WHERE b_name LIKE 'Die %';
UPDATE bands SET b_name=REPLACE(b_name, 'die ', '') WHERE b_name LIKE 'die %';


SELECT b_id, b_name as old, b_name as new from bands
WHERE SUBSTR(b_name, 1, 4) IN (SELECT SUBSTR(b_name, 1, 4) AS name FROM bands GROUP BY SUBSTR(b_name, 1, 4) HAVING COUNT(*) > 1)
ORDER BY b_name;

