-- ------------------------------------
-- create mediadb-model
-- ------------------------------------

SET FOREIGN_KEY_CHECKS = 0;

-----------------
--- configuration-tables
-----------------
CREATE TABLE IF NOT EXISTS musikrichtung (
    MR_ID INT AUTO_INCREMENT PRIMARY KEY,
    MR_NAME CHAR(50) NULL,
    MR_BESCHREIBUNG CHAR(50) NULL
);
CREATE OR REPLACE INDEX idx_MR__MR_ID ON musikrichtung (MR_ID);

CREATE TABLE IF NOT EXISTS playlist (
    P_ID INT auto_increment primary key,
    P_META_DESC text NULL,
    P_NAME VARCHAR(255) NULL
);
CREATE OR REPLACE index idx_P__P_ID on playlist (P_ID);

-----------------
--- main-tables
-----------------
CREATE TABLE IF NOT EXISTS bands (
    B_ID INT AUTO_INCREMENT PRIMARY KEY,
    B_NAME CHAR(50) NULL,
    MR_ID INT NULL,
    B_BESCHREIBUNG CHAR(255) NULL,
    B_URL CHAR(255) NULL,
    CONSTRAINT bands_ibfk_1 FOREIGN KEY (MR_ID) REFERENCES musikrichtung (MR_ID)
);
CREATE OR REPLACE index idx_B__B_ID on bands (B_ID);
CREATE OR REPLACE index idx_B__MR_ID on bands (MR_ID);

CREATE TABLE IF NOT EXISTS album (
    A_ID INT auto_increment primary key,
    B_ID INT NULL,
    MR_ID INT NULL,
    A_DESC text NULL,
    A_DIR VARCHAR(255) NULL,
    A_NAME VARCHAR(255) NULL,
    CONSTRAINT album_ibfk_1 FOREIGN KEY (B_ID) REFERENCES bands (B_ID),
    CONSTRAINT album_ibfk_2 FOREIGN KEY (MR_ID) REFERENCES musikrichtung (MR_ID)
);
CREATE OR REPLACE index idx_A__A_ID on album (A_ID);
CREATE OR REPLACE index idx_A__B_ID on album (B_ID);
CREATE OR REPLACE index idx_A__MR_ID on album (MR_ID);


CREATE TABLE IF NOT EXISTS titles (
    T_ID INT auto_increment primary key,
    B_ID INT NULL,
    MR_ID INT NULL,
    A_ID INT NULL,
    T_BASEPATH VARCHAR(255) NULL,
    T_DATE DATETIME NULL,
    T_DESC text NULL,
    T_DIR VARCHAR(255) NULL,
    T_DISKLABEL VARCHAR(255) NULL,
    T_DURATION INT NULL,
    T_FILE VARCHAR(255) NULL,
    T_FILESIZE INT NULL,
    T_NAME VARCHAR(255) NULL,
    T_ORIGPATH VARCHAR(255) NULL,
    t_tracknr INT NULL,
    CONSTRAINT titles_ibfk_1 FOREIGN KEY (A_ID) REFERENCES album (A_ID),
    CONSTRAINT titles_ibfk_2 FOREIGN KEY (B_ID) REFERENCES bands (B_ID),
    CONSTRAINT titles_ibfk_3 FOREIGN KEY (MR_ID) REFERENCES musikrichtung (MR_ID)
);
CREATE OR REPLACE index idx_T__A_ID on titles (A_ID);
CREATE OR REPLACE index idx_T__B_ID on titles (B_ID);
CREATE OR REPLACE index idx_T__MR_ID on titles (MR_ID);
CREATE OR REPLACE index idx_T__T_ID on titles (T_ID);


CREATE TABLE IF NOT EXISTS titles_playlist
(
    TP_ID INT auto_increment primary key,
    T_ID INT default 0 not NULL,
    P_ID INT default 0 not NULL,
    TP_POS INT NULL,
    CONSTRAINT titles_playlist_ibfk_1 FOREIGN KEY (T_ID) REFERENCES titles (T_ID) ON DELETE CASCADE,
    CONSTRAINT titles_playlist_ibfk_2 FOREIGN KEY (P_ID) REFERENCES playlist (P_ID) ON DELETE CASCADE
);
CREATE OR REPLACE index idx_TP__P_ID on titles_playlist (P_ID);
CREATE OR REPLACE index idx_TP__TP_ID on titles_playlist (TP_ID);
CREATE OR REPLACE index idx_TP__T_ID on titles_playlist (T_ID);

SET FOREIGN_KEY_CHECKS = 1;
