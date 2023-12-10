-- ------------------------------------
-- add keywords and rate
-- ------------------------------------
ALTER TABLE album ADD a_rate int(11) DEFAULT '0';
ALTER TABLE bands ADD b_rate int(11) DEFAULT '0';
ALTER TABLE musikrichtung ADD mr_rate int(11) DEFAULT '0';
ALTER TABLE titles ADD t_rate int(11) DEFAULT '0';

ALTER TABLE album ADD a_coverfile VARCHAR(255);
ALTER TABLE titles ADD t_coverfile VARCHAR(255);


CREATE TABLE IF NOT EXISTS keyword (
    kw_id INTEGER PRIMARY KEY,
    kw_meta_desc text,
    kw_name VARCHAR(255),
    kw_parent_id INT CONSTRAINT keyword_ibfk_1 REFERENCES keyword,
    kw_name_pl VARCHAR(255),
    kw_name_aliases text,
    kw_name_alias text
);
CREATE INDEX IF NOT EXISTS idx_kw__kw_id ON keyword (kw_id);
CREATE INDEX IF NOT EXISTS idx_kw__kw_name ON keyword (kw_name);
CREATE INDEX IF NOT EXISTS idx_kw__kw_name_pl ON keyword (kw_name_pl);
CREATE INDEX IF NOT EXISTS idx_kw__parent_kw_id ON keyword (kw_parent_id);

CREATE TABLE IF NOT EXISTS bands_keyword (
    bk_id INTEGER PRIMARY KEY,
    b_id INT DEFAULT '0' NOT NULL CONSTRAINT bands__keyword_ibfk_1 REFERENCES bands ON DELETE CASCADE,
    kw_id INT DEFAULT '0' NOT NULL CONSTRAINT bands__keyword_ibfk_2 REFERENCES keyword ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_bk__b_id ON bands_keyword (b_id);
CREATE INDEX IF NOT EXISTS idx_bk__bk_id ON bands_keyword (bk_id);
CREATE INDEX IF NOT EXISTS idx_bk__kw_id ON bands_keyword (kw_id);

CREATE TABLE IF NOT EXISTS album_keyword (
    ak_id INTEGER PRIMARY KEY,
    a_id INT DEFAULT '0' NOT NULL CONSTRAINT album_keyword_ibfk_1 REFERENCES album ON DELETE CASCADE,
    kw_id INT DEFAULT '0' NOT NULL CONSTRAINT album_keyword_ibfk_2 REFERENCES keyword ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_ak__a_id ON album_keyword (a_id);
CREATE INDEX IF NOT EXISTS idx_ak__ak_id ON album_keyword (ak_id);
CREATE INDEX IF NOT EXISTS idx_ak__kw_id ON album_keyword (kw_id);

CREATE TABLE IF NOT EXISTS titles_keyword (
    tk_id INTEGER PRIMARY KEY,
    t_id INT DEFAULT '0' NOT NULL CONSTRAINT titles_keyword_ibfk_1 REFERENCES titles ON DELETE CASCADE,
    kw_id INT DEFAULT '0' NOT NULL CONSTRAINT titles_keyword_ibfk_2 REFERENCES keyword ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_tk__kw_id ON titles_keyword (kw_id);
CREATE INDEX IF NOT EXISTS idx_tk__t_id ON titles_keyword (t_id);
CREATE INDEX IF NOT EXISTS idx_tk__tk_id ON titles_keyword (tk_id);

CREATE TABLE IF NOT EXISTS musikrichtung_keyword (
    mrk_id INTEGER PRIMARY KEY,
    mr_id INT DEFAULT '0' NOT NULL CONSTRAINT musikrichtung_keyword_ibfk_1 REFERENCES musikrichtung ON DELETE CASCADE,
    kw_id INT DEFAULT '0' NOT NULL CONSTRAINT musikrichtung_keyword_ibfk_2 REFERENCES keyword ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_mrk__kw_id ON musikrichtung_keyword (kw_id);
CREATE INDEX IF NOT EXISTS idx_mrk__mr_id ON musikrichtung_keyword (mr_id);
CREATE INDEX IF NOT EXISTS idx_mrk__mrk_id ON musikrichtung_keyword (mrk_id);

CREATE TABLE IF NOT EXISTS album_bands (
  ab_id integer PRIMARY KEY,
  a_id int(11) NOT NULL,
  b_id int(11) NOT NULL,
  kb_full int(11) DEFAULT '0',
  CONSTRAINT album_bands_ibfk_1 FOREIGN KEY (a_id) REFERENCES album (a_id) ON DELETE CASCADE,
  CONSTRAINT album_bands_ibfk_2 FOREIGN KEY (b_id) REFERENCES bands (b_id) ON DELETE CASCADE
);

