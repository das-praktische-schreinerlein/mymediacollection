-- mysql or others: export this an import into sqlite as: import_titles_playlist
select p_name, t_dir, t_file, t_name from titles INNER JOIN titles_playlist tp on titles.t_id = tp.t_id INNER JOIN playlist p on tp.p_id = p.p_id;

-- sqllite
detach importdb;
attach 'F:/playground/mymm-test/mymmbase/importdb.sqlite' as importdb;

-- check
SELECT titles.t_file, titles.t_dir, importdb.import_titles_playlist.t_dir, playlist.p_id FROM titles
    INNER JOIN importdb.import_titles_playlist
        ON (LOWER(titles.t_file) LIKE LOWER(importdb.import_titles_playlist.t_file) OR LOWER(titles.t_file) LIKE LOWER(importdb.import_titles_playlist.t_file))
               AND (LOWER(titles.t_dir) LIKE '%' || LOWER(importdb.import_titles_playlist.t_dir) OR LOWER(importdb.import_titles_playlist.t_dir) LIKE '%' || LOWER(titles.t_dir))
    INNER JOIN playlist ON playlist.p_name like importdb.import_titles_playlist.p_name;

-- import
INSERT INTO titles_playlist (t_id, p_id)
 SELECT titles.t_id, playlist.p_id FROM titles
    INNER JOIN importdb.import_titles_playlist
        ON (LOWER(titles.t_file) LIKE LOWER(importdb.import_titles_playlist.t_file) OR LOWER(titles.t_file) LIKE LOWER(importdb.import_titles_playlist.t_file))
               AND (LOWER(titles.t_dir) LIKE '%' || LOWER(importdb.import_titles_playlist.t_dir) OR LOWER(importdb.import_titles_playlist.t_dir) LIKE '%' || LOWER(titles.t_dir))
    INNER JOIN playlist ON playlist.p_name like importdb.import_titles_playlist.p_name;

INSERT INTO titles_playlist (t_id, p_id)
 SELECT titles.t_id, playlist.p_id FROM titles
    INNER JOIN importdb.import_titles_playlist
        ON (LOWER(titles.t_file) LIKE LOWER(importdb.import_titles_playlist.t_file) OR LOWER(titles.t_file) LIKE LOWER(importdb.import_titles_playlist.t_file))
               AND (LOWER(titles.t_dir) LIKE '%' || LOWER(importdb.import_titles_playlist.t_dir) OR LOWER(importdb.import_titles_playlist.t_dir) LIKE '%' || LOWER(titles.t_dir))
    INNER JOIN playlist ON playlist.p_name like 'Favorites';


update titles set t_rate=MAX(COALESCE(t_rate, 0), 5) where t_id in (select t_id from titles_playlist);
update album set a_rate=MAX(COALESCE(a_rate, 0), 2) where a_id in (select a_id from titles where t_rate >= 2);
update bands set b_rate=MAX(COALESCE(b_rate, 0), 2) where b_id in (select b_id from titles where t_rate >= 2);
update musikrichtung set mr_rate=MAX(COALESCE(mr_rate, 0), 2) where mr_id in (select mr_id from titles where t_rate >= 2);


insert into titles_playlist (t_id, p_id)
    SELECT t_id, (select p_id from playlist where p_name like 'favorites') as p_id from titles
    where t_rate > 2 and t_id not in (select t_id from titles_playlist)
