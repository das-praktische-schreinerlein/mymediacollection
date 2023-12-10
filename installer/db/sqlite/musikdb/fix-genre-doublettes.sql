UPDATE
      bands
SET MR_ID = (SELECT min(mr_id)
             FROM musikrichtung
             WHERE mr_name in (select mr_name from musikrichtung where mr_id = bands.mr_id)
            )
where mr_id not null;

UPDATE
      album
SET MR_ID = (SELECT min(mr_id)
             FROM musikrichtung
             WHERE mr_name in (select mr_name from musikrichtung where mr_id = album.mr_id)
            )
where mr_id not null;

UPDATE
      titles
SET MR_ID = (SELECT min(mr_id)
             FROM musikrichtung
             WHERE mr_name in (select mr_name from musikrichtung where mr_id = titles.mr_id)
            )
where mr_id not null;

select * from musikrichtung where mr_id not in (
    select mr_id from album where mr_id not null
    union
        select mr_id from bands where mr_id not null
    union
        select mr_id from titles where mr_id not null
    );

delete from musikrichtung where mr_id not in (
    select mr_id from album where mr_id not null
    union
        select mr_id from bands where mr_id not null
    union
        select mr_id from titles where mr_id not null
    );
