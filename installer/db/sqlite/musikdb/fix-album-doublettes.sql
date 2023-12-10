update album set b_id=(SELECT min(b_id) FROM bands WHERE b_name like 'Various Artists') where a_id in (select a_id from titles where t_dir like '%complete/diverses/%');

UPDATE
      titles
SET a_id = (SELECT min(a_id)
             FROM album
             WHERE b_id || a_name in (select b_id || a_name from album where a_id = titles.a_id)
            )
where a_id not null;

select * from album where a_id not in (
    select a_id from titles where a_id not null
    );

delete from album where a_id not in (
    select a_id from titles where a_id not null
    );
