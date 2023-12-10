UPDATE
      album
SET b_id = (SELECT min(b_id)
             FROM bands
             WHERE b_name in (select b_name from bands where b_id = album.b_id)
            )
where b_id not null;

UPDATE
      titles
SET b_id = (SELECT min(b_id)
             FROM bands
             WHERE b_name in (select b_name from bands where b_id = titles.b_id)
            )
where b_id not null;

select * from bands where b_id not in (
    select b_id from album where b_id not null
    union
        select b_id from titles where b_id not null
    );

delete from bands where b_id not in (
    select b_id from album where b_id not null
    union
        select b_id from titles where b_id not null
    );
