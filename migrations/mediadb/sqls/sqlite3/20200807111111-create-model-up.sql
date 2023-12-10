-- ------------------------------------
-- create mediadb-model
-- ------------------------------------

-----------------
--- configuration-tables
-----------------
CREATE TABLE IF NOT EXISTS musikrichtung (
    mr_id INTEGER PRIMARY KEY,
    mr_name CHAR(50),
    mr_beschreibung CHAR(50)
);
CREATE INDEX IF NOT EXISTS idx_mr__mr_id ON musikrichtung (mr_id);

CREATE TABLE IF NOT EXISTS playlist (
    p_id INTEGER PRIMARY KEY,
    p_meta_desc TEXT,
    p_name VARCHAR(255)
);
CREATE INDEX IF NOT EXISTS idx_P__P_ID ON playlist (p_id);

-----------------
--- main-tables
-----------------
CREATE TABLE IF NOT EXISTS bands (
    b_id INTEGER PRIMARY KEY,
    mr_id INT CONSTRAINT bands_ibfk_1 REFERENCES musikrichtung,
    b_name CHAR(50),
    b_beschreibung CHAR(255),
    b_url CHAR(255)
);
CREATE INDEX IF NOT EXISTS idx_B__B_ID ON bands (b_id);
CREATE INDEX IF NOT EXISTS idx_B__mr_id ON bands (mr_id);


CREATE TABLE IF NOT EXISTS album (
    a_id INTEGER PRIMARY KEY,
    b_id INT CONSTRAINT album_ibfk_1 REFERENCES bands,
    mr_id INT CONSTRAINT album_ibfk_2 REFERENCES musikrichtung,
    a_desc TEXT,
    a_dir VARCHAR(255),
    a_name VARCHAR(255)
);
CREATE INDEX IF NOT EXISTS idx_A__A_ID ON album (a_id);
CREATE INDEX IF NOT EXISTS idx_A__B_ID ON album (b_id);
CREATE INDEX IF NOT EXISTS idx_A__mr_id ON album (mr_id);


CREATE TABLE IF NOT EXISTS titles(
    t_id INTEGER PRIMARY KEY,
    b_id INT CONSTRAINT titles_ibfk_2 REFERENCES bands,
    mr_id INT CONSTRAINT titles_ibfk_3 REFERENCES musikrichtung,
    a_id INT CONSTRAINT titles_ibfk_1 REFERENCES album ON DELETE CASCADE,
    t_basepath VARCHAR(255),
    t_date DATETIME,
    t_desc TEXT,
    t_dir VARCHAR(255),
    t_disklabel VARCHAR(255),
    t_duration INT,
    t_file VARCHAR(255),
    t_filesize INT,
    t_name VARCHAR(255),
    t_origpath VARCHAR(255),
    t_tracknr INT
);
CREATE INDEX IF NOT EXISTS idx_T__A_ID ON titles (a_id);
CREATE INDEX IF NOT EXISTS idx_T__B_ID ON titles (b_id);
CREATE INDEX IF NOT EXISTS idx_T__T_ID ON titles (t_id);
CREATE INDEX IF NOT EXISTS idx_T__mr_id ON titles (mr_id);

CREATE TABLE IF NOT EXISTS titles_playlist(
    tp_id INTEGER PRIMARY KEY,
    t_id INT DEFAULT '0' NOT NULL CONSTRAINT titles_playlist_ibfk_1 REFERENCES titles ON DELETE CASCADE,
    p_id INT DEFAULT '0' NOT NULL CONSTRAINT titles_playlist_ibfk_2 REFERENCES playlist ON DELETE CASCADE,
    tp_pos INT
);
CREATE INDEX IF NOT EXISTS idx_TP__P_ID ON titles_playlist (p_id);
CREATE INDEX IF NOT EXISTS idx_TP__TP_ID ON titles_playlist (tp_id);
CREATE INDEX IF NOT EXISTS idx_TP__T_ID ON titles_playlist (t_id);

