-- ------------------------------------
-- prepare default-data
-- ------------------------------------
INSERT INTO MUSIKRICHTUNG (MR_NAME) values ('Unbekanntes Genre');
INSERT INTO BANDS (B_NAME, MR_ID) values ('Unbekannter Artist', 1);

INSERT INTO PLAYLIST (P_META_DESC, P_NAME) select null, 'Favorites' where not exists (select p_id from playlist where lower(p_name) like lower('Favorites'));
INSERT INTO PLAYLIST (P_META_DESC, P_NAME) select null, 'Album_Favorites' where not exists (select p_id from playlist where lower(p_name) like lower('Album_Favorites'));
INSERT INTO PLAYLIST (P_META_DESC, P_NAME) select null, 'Artist_Favorites' where not exists (select p_id from playlist where lower(p_name) like lower('Artist_Favorites'));
INSERT INTO PLAYLIST (P_META_DESC, P_NAME) select null, 'Genre_Favorites' where not exists (select p_id from playlist where lower(p_name) like lower('Genre_Favorites'));
INSERT INTO PLAYLIST (P_META_DESC, P_NAME) select null, 'Hardcore Favorites' where not exists (select p_id from playlist where lower(p_name) like lower('Hardcore Favorites'));
INSERT INTO PLAYLIST (P_META_DESC, P_NAME) select null, 'Punk Favorites' where not exists (select p_id from playlist where lower(p_name) like lower('Punk Favorites'));
INSERT INTO PLAYLIST (P_META_DESC, P_NAME) select null, 'Misfits-Favorites' where not exists (select p_id from playlist where lower(p_name) like lower('Misfits-Favorites'));
INSERT INTO PLAYLIST (P_META_DESC, P_NAME) select null, 'PunknRoll-Favorites' where not exists (select p_id from playlist where lower(p_name) like lower('PunknRoll-Favorites'));
INSERT INTO PLAYLIST (P_META_DESC, P_NAME) select null, 'Country-Favorites' where not exists (select p_id from playlist where lower(p_name) like lower('Country-Favorites'));
INSERT INTO PLAYLIST (P_META_DESC, P_NAME) select null, 'Psychobilly-Favorites' where not exists (select p_id from playlist where lower(p_name) like lower('Psychobilly-Favorites'));
INSERT INTO PLAYLIST (P_META_DESC, P_NAME) select null, 'Pop-Favorites' where not exists (select p_id from playlist where lower(p_name) like lower('Pop-Favorites'));
INSERT INTO PLAYLIST (P_META_DESC, P_NAME) select null, 'Ramones-Favorites' where not exists (select p_id from playlist where lower(p_name) like lower('Ramones-Favorites'));
INSERT INTO PLAYLIST (P_META_DESC, P_NAME) select null, 'Romantik-Favorites' where not exists (select p_id from playlist where lower(p_name) like lower('Romantik-Favorites'));
INSERT INTO PLAYLIST (P_META_DESC, P_NAME) select null, 'Hardrock-Favorites' where not exists (select p_id from playlist where lower(p_name) like lower('Hardrock-Favorites'));
INSERT INTO PLAYLIST (P_META_DESC, P_NAME) select null, 'Metal-Favorites' where not exists (select p_id from playlist where lower(p_name) like lower('Metal-Favorites'));
INSERT INTO PLAYLIST (P_META_DESC, P_NAME) select null, 'Rockabilly-Favorites' where not exists (select p_id from playlist where lower(p_name) like lower('Rockabilly-Favorites'));
