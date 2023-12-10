export class MediaDocSqlUtils {
    public static generateDoubletteNameSql(field: string): string {
        return 'REGEXP_REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(LOWER(' + field + '), "ß", "ss"),' +
            ' "ö", "oe"),' +
            ' "ü", "ue"),' +
            ' "ä", "ae"),' +
            ' "[^a-z0-9]", "")';
    }

    public static generateLower(field: string): string {
        return 'REPLACE(REPLACE(REPLACE(REPLACE(LOWER(' + field + '), "ß", "ß"),' +
            ' "Ö", "ö"),' +
            ' "Ü", "ü"),' +
            ' "Ä", "ä")';
    }

    public static transformToSqliteDialect(sql: string): string {
        // dirty workaround because sqlite has no functions as mysql
        sql = sql.replace(/GetTechName\(([a-zA-Z0-9_.]+)\)/g,
            'REPLACE(REPLACE(LOWER($1), " ", "_"), "/", "_")');
        sql = sql.replace(/REGEXP_REPLACE\(/g, 'REPLACE(');
        sql = sql.replace(/MD5\(CONCAT\(([a-zA-Z0-9_.]+), "_", ([a-zA-Z0-9_.]+), "_", ([a-zA-Z0-9_.]+), "_", ([a-zA-Z0-9_.]+)\)\)/g,
            'REPLACE(REPLACE(LOWER($1 || "_" || $2 || "_" || $3 || "_" || $4), " ", "_"), "/", "_")');
        sql = sql.replace(/\(SELECT CONCAT\("type=addartist:::name=", COALESCE\(b_name, "null"\), ":::refId=", CAST\(bands.b_id AS CHAR\)\)/g,
            'SELECT linkedartists FROM (SELECT "type=addartist:::name="  ||  COALESCE(b_name, "null")  ||  ":::refId="  ||  CAST(bands.b_id AS CHAR)');
        sql = sql.replace(/SELECT CONCAT\("type=playlist:::name=", COALESCE\(p_name, "null"\), ":::refId=", CAST\(playlist.p_id AS CHAR\),   ":::position=", COALESCE\((.*?), "null"\)\)/g,
            'SELECT "type=playlist:::name=" || COALESCE(p_name, "null") ||' +
            '    ":::refId=" || CAST(playlist.p_id AS CHAR) || ":::position=" || COALESCE($1, "null")');
        sql = sql.replace(/\(SELECT CONCAT\("navid=(.*?)", (.*?), ":::name=", COALESCE\((.*?), "null"\), ":::navtype=", "/g,
            'SELECT navigation_objects FROM (SELECT ("navid=$1" || $2 || ":::name=" || COALESCE($3, "null") || ":::navtype=');
        sql = sql.replace(/CONCAT\((.*?), CAST\(COUNT\(DISTINCT (.*?)\) AS CHAR\)\)/g,
            '$1 || CAST(COUNT(DISTINCT $2) AS CHAR(50))');
        sql = sql.replace(/CONCAT\((.*?), CAST\(COUNT\(DISTINCT (.*?)\) AS CHAR\)\)/g,
            '$1 || CAST(COUNT(DISTINCT $2) AS CHAR(50))');
        sql = sql.replace(/CONCAT\((.*?), CAST\(COUNT\(DISTINCT (.*?)\) AS CHAR\)\)/g,
            '$1 || CAST(COUNT(DISTINCT $2) AS CHAR(50))');
        sql = sql.replace(/CONCAT\(a_key, COALESCE\(a_dir, ""\)\)/g,
        'a_key || COALESCE(a_dir, "")');
        sql = sql.replace(/CONCAT\(titles.t_file, CAST\(t_filesize AS CHAR\)\)/g,
            'titles.t_file || CAST(t_filesize AS TEXT)');
        sql = sql.replace(/CONCAT\(a_key, b_key, t_key, CAST\(COALESCE\(t_tracknr, 999\) AS CHAR\)\)/g,
            'a_key || b_key || t_key || CAST(COALESCE(t_tracknr, 999) AS CHAR(50))');
        sql = sql.replace(/FROM DUAL/g, '');

        return sql;
    }
}

