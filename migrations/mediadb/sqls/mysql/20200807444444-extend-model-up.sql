-- ------------------------------------
-- add keywords and rate
-- ------------------------------------
ALTER TABLE album ADD a_rate int DEFAULT 0;
ALTER TABLE bands ADD b_rate int DEFAULT 0;
ALTER TABLE musikrichtung ADD mr_rate int DEFAULT 0;
ALTER TABLE titles ADD t_rate int DEFAULT 0;

ALTER TABLE album ADD a_coverfile VARCHAR(255) COLLATE latin1_general_ci DEFAULT NULL;
ALTER TABLE titles ADD t_coverfile VARCHAR(255) COLLATE latin1_general_ci DEFAULT NULL;

CREATE TABLE IF NOT EXISTS keyword (
  kw_id INT(11) NOT NULL AUTO_INCREMENT,
  kw_meta_desc text COLLATE latin1_general_ci,
  kw_name VARCHAR(255) COLLATE latin1_general_ci DEFAULT NULL,
  kw_parent_id INT(11) DEFAULT NULL,
  kw_name_pl VARCHAR(255) COLLATE latin1_general_ci DEFAULT NULL,
  kw_name_aliases text COLLATE latin1_general_ci,
  kw_name_alias text COLLATE latin1_general_ci,
  PRIMARY KEY (kw_id),
  KEY idx_kw__kw_id (kw_id),
  KEY idx_kw__parent_kw_id (kw_parent_id),
  KEY idx_kw__kw_name (kw_name),
  KEY idx_kw__kw_name_pl (kw_name_pl),
  CONSTRAINT keyword_ibfk_1 FOREIGN KEY (kw_parent_id) REFERENCES keyword (kw_id)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1 COLLATE=latin1_general_ci;

CREATE TABLE IF NOT EXISTS bands_keyword (
    bk_id INTEGER PRIMARY KEY,
    b_id INT NOT NULL,
    kw_id INT NOT NULL,
    CONSTRAINT bands__keyword_ibfk_1 FOREIGN KEY (b_id) REFERENCES bands ON DELETE CASCADE,
    CONSTRAINT bands__keyword_ibfk_2 FOREIGN KEY (kw_id) REFERENCES keyword ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_bk__b_id ON bands_keyword (b_id);
CREATE INDEX IF NOT EXISTS idx_bk__bk_id ON bands_keyword (bk_id);
CREATE INDEX IF NOT EXISTS idx_bk__kw_id ON bands_keyword (kw_id);

CREATE TABLE IF NOT EXISTS album_keyword (
    ak_id INTEGER PRIMARY KEY,
    a_id INT NOT NULL,
    kw_id INT NOT NULL,
    CONSTRAINT album_keyword_ibfk_1 FOREIGN KEY (a_id) REFERENCES album ON DELETE CASCADE,
    CONSTRAINT album_keyword_ibfk_2 FOREIGN KEY (kw_id) REFERENCES keyword ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_ak__a_id ON album_keyword (a_id);
CREATE INDEX IF NOT EXISTS idx_ak__ak_id ON album_keyword (ak_id);
CREATE INDEX IF NOT EXISTS idx_ak__kw_id ON album_keyword (kw_id);

CREATE TABLE IF NOT EXISTS titles_keyword (
    tk_id INTEGER PRIMARY KEY,
    t_id INT NOT NULL,
    kw_id INT NOT NULL,
    CONSTRAINT titles_keyword_ibfk_1 FOREIGN KEY (t_id)  REFERENCES titles ON DELETE CASCADE,
    CONSTRAINT titles_keyword_ibfk_2 FOREIGN KEY (kw_id) REFERENCES keyword ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_tk__kw_id ON titles_keyword (kw_id);
CREATE INDEX IF NOT EXISTS idx_tk__t_id ON titles_keyword (t_id);
CREATE INDEX IF NOT EXISTS idx_tk__tk_id ON titles_keyword (tk_id);
