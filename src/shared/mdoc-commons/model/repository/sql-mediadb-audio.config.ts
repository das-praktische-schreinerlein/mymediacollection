import {AdapterFilterActions} from '@dps/mycms-commons/dist/search-commons/services/mapper.utils';
import {TableConfig} from '@dps/mycms-commons/dist/search-commons/services/sql-query.builder';
import {ActionTagReplaceTableConfigType} from '@dps/mycms-commons/dist/action-commons/actiontags/common-sql-actiontag-replace.adapter';
import {ActionTagBlockTableConfigType} from '@dps/mycms-commons/dist/action-commons/actiontags/common-sql-actiontag-block.adapter';
import {ActionTagAssignTableConfigType} from '@dps/mycms-commons/dist/action-commons/actiontags/common-sql-actiontag-assign.adapter';
import {KeywordModelConfigJoinType} from '@dps/mycms-commons/dist/action-commons/actions/common-sql-keyword.adapter';
import {PlaylistModelConfigJoinType} from '@dps/mycms-commons/dist/action-commons/actions/common-sql-playlist.adapter';
import {RateModelConfigTableType} from '@dps/mycms-commons/dist/action-commons/actions/common-sql-rate.adapter';
import {MediaDocSqlUtils} from '../../services/mdoc-sql.utils';

export class SqlMediaDbAudioConfig {
    public static readonly tableConfig: TableConfig = {
        key: 'audio',
        tableName: 'titles',
        selectFrom: 'titles LEFT JOIN bands ON bands.b_id = titles.b_id ' +
            'LEFT JOIN album ON album.a_id = titles.a_id ' +
            'LEFT JOIN bands ab ON album.b_id = ab.b_id ' +
            'LEFT JOIN musikrichtung amr ON album.mr_id = amr.mr_id ' +
            'LEFT JOIN musikrichtung ON musikrichtung.mr_id = titles.mr_id ',
        optionalGroupBy: [
            {
                from: 'LEFT JOIN titles_keyword ON titles.t_id=titles_keyword.t_id ' +
                    'LEFT JOIN keyword ON titles_keyword.kw_id=keyword.kw_id ',
                triggerParams: ['id', 'keywords_txt', 'todoKeywords'],
                groupByFields: ['GROUP_CONCAT(DISTINCT keyword.kw_name ORDER BY keyword.kw_name SEPARATOR ", ") AS t_keywords']
            },
            {
                from: 'LEFT JOIN titles_playlist ON titles.t_id=titles_playlist.t_id ' +
                    'LEFT JOIN playlist ON titles_playlist.p_id=playlist.p_id',
                triggerParams: ['id', 'playlists_txt', 'playlists_max_txt', 'playlistPos'],
                groupByFields: ['GROUP_CONCAT(DISTINCT playlist.p_name ORDER BY playlist.p_name SEPARATOR ", ") AS t_playlists']
            },
            {
                from: 'INNER JOIN' +
                    '(' +
                    '    SELECT t_id AS id FROM titles' +
                    '      INNER JOIN album a2 on titles.a_id = a2.a_id ' +
                    '      INNER JOIN bands b2 on a2.b_id = b2.b_id ' +
                    '      INNER JOIN (SELECT DISTINCT CONCAT(a_key, b_key, t_key, CAST(COALESCE(t_tracknr, 999) AS CHAR)) as key FROM titles' +
                    '           INNER JOIN album a on titles.a_id = a.a_id ' +
                    '           INNER JOIN bands b on a.b_id = b.b_id GROUP BY CONCAT(a_key, b_key, t_key, CAST(COALESCE(t_tracknr, 999) AS CHAR)) HAVING COUNT(*) > 1) doublettes' +
                    '                ON CONCAT(a_key, b_key, t_key, CAST(COALESCE(t_tracknr, 999) AS CHAR)) = doublettes.key ' +
                    '  UNION ' +
                    '    SELECT t_id AS id FROM titles ' +
                    '      INNER JOIN (SELECT DISTINCT CONCAT(t_dir, t_file) key FROM titles GROUP BY CONCAT(t_dir, t_file) HAVING COUNT(*) > 1) doublettes' +
                    '           ON CONCAT(titles.t_dir, titles.t_file) = doublettes.key' +
                    '  UNION ' +
                    '    SELECT t_id AS id FROM titles ' +
                    '      INNER JOIN (SELECT DISTINCT CONCAT(t_file, CAST(t_filesize AS CHAR)) key FROM titles GROUP BY CONCAT(t_dir, t_file) HAVING COUNT(*) > 1) doublettes' +
                    '           ON CONCAT(titles.t_file, CAST(t_filesize AS CHAR)) = doublettes.key' +
                    ') doublettes2  ON titles.t_id = doublettes2.id',
                triggerParams: ['doublettes'],
                groupByFields: []
            }
        ],
        loadDetailData: [
            {
                profile: 'playlists',
                sql: 'SELECT GROUP_CONCAT(DISTINCT playlist.p_name ORDER BY playlist.p_name SEPARATOR ", ") AS playlists ' +
                    'FROM titles_playlist' +
                    ' INNER JOIN playlist ON titles_playlist.p_id=playlist.p_id ' +
                    'WHERE titles_playlist.t_id in (:id)',
                parameterNames: ['id']
            },
            {
                profile: 'keywords',
                sql: 'select GROUP_CONCAT(DISTINCT keyword.kw_name ORDER BY keyword.kw_name SEPARATOR ", ") AS keywords ' +
                    'FROM titles_keyword' +
                    ' INNER JOIN keyword on titles_keyword.kw_id=keyword.kw_id ' +
                    'WHERE titles_keyword.t_id in (:id)',
                parameterNames: ['id']
            },
            {
                profile: 'navigation_objects',
                sql: '(SELECT CONCAT("navid=AUDIO_", t_id, ":::name=", COALESCE(t_name, "null"), ":::navtype=", "PREDECESSOR")' +
                    '  AS navigation_objects' +
                    '  FROM titles WHERE t_name < (SELECT t_name FROM titles WHERE t_id IN (:id))' +
                    '  ORDER BY t_name DESC, t_id DESC LIMIT 1) ' +
                    'UNION ' +
                    ' (SELECT CONCAT("navid=TITLES_", t_id, ":::name=", COALESCE(t_name, "null"), ":::navtype=", "SUCCESSOR")' +
                    '  AS navigation_objects' +
                    '  FROM titles WHERE t_name > (SELECT t_name FROM titles WHERE t_id IN (:id))' +
                    '   ORDER BY t_name, t_id LIMIT 1)',
                parameterNames: ['id'],
                modes: ['details']
            },
            {
                profile: 'linkedplaylists',
                sql: 'SELECT CONCAT("type=playlist:::name=", COALESCE(p_name, "null"), ":::refId=", CAST(playlist.p_id AS CHAR),' +
                    '   ":::position=", COALESCE(titles_playlist.tp_pos, "null"))' +
                    '  AS linkedplaylists' +
                    '  FROM playlist INNER JOIN titles_playlist ON playlist.p_id = titles_playlist.p_id WHERE titles_playlist.t_id IN (:id)' +
                    '  ORDER BY p_name',
                parameterNames: ['id']
            }
        ],
        groupbBySelectFieldListIgnore: ['keywords', 'playlists'],
        selectFieldList: [
            '"AUDIO" AS type',
            'CONCAT("AUDIO", "_", titles.t_id) AS id',
            'titles.t_id',
            'titles.a_id',
            'titles.b_id',
            'titles.mr_id',
            'a_name',
            'a_key',
            'amr.mr_name AS album_mr_name',
            'ab.b_name AS album_b_name',
            'bands.b_name',
            'bands.b_key',
            'musikrichtung.mr_name',
            'musikrichtung.mr_key',
            't_tracknr',
            't_key',
            't_key as key',
            't_duration',
            't_date',
            't_datefile',
            't_filesize',
            't_rate',
            't_metadata',
            'CONCAT(titles.t_dir, "/", titles.t_file) AS a_fav_url_txt',
            'CONCAT(titles.t_dir, "/", titles.t_coverfile) AS i_fav_url_txt',
            't_name AS name',
            'CONCAT(musikrichtung.mr_name, " - ", bands.b_name, " - ", album.a_name, " - ", t_name) AS html',
            // changelog
            't_createdat',
            't_updatedat',
            't_updateversion'
        ],
        facetConfigs: {
            // dashboard
            'doublettes': {
                selectSql: 'SELECT COUNT(titles.t_id) AS count, "doublettes" AS value,' +
                    ' "doublettes" AS label, "true" AS id' +
                    ' FROM titles INNER JOIN' +
                    '(' +
                    '    SELECT t_id AS id FROM titles' +
                    '      INNER JOIN album a2 on titles.a_id = a2.a_id ' +
                    '      INNER JOIN bands b2 on a2.b_id = b2.b_id ' +
                    '      INNER JOIN (SELECT DISTINCT CONCAT(a_key, b_key, t_key, CAST(COALESCE(t_tracknr, 999) AS CHAR)) as key FROM titles' +
                    '           INNER JOIN album a on titles.a_id = a.a_id ' +
                    '           INNER JOIN bands b on a.b_id = b.b_id GROUP BY CONCAT(a_key, b_key, t_key, CAST(COALESCE(t_tracknr, 999) AS CHAR)) HAVING COUNT(*) > 1) doublettes' +
                    '                ON CONCAT(a_key, b_key, t_key, CAST(COALESCE(t_tracknr, 999) AS CHAR)) = doublettes.key ' +
                    '  UNION ' +
                    '    SELECT t_id AS id FROM titles ' +
                    '      INNER JOIN (SELECT DISTINCT CONCAT(t_dir, t_file) key FROM titles GROUP BY CONCAT(t_dir, t_file) HAVING COUNT(*) > 1) doublettes' +
                    '           ON CONCAT(titles.t_dir, titles.t_file) = doublettes.key' +
                    '  UNION ' +
                    '    SELECT t_id AS id FROM titles ' +
                    '      INNER JOIN (SELECT DISTINCT CONCAT(t_file, CAST(t_filesize AS CHAR)) key FROM titles GROUP BY CONCAT(t_dir, t_file) HAVING COUNT(*) > 1) doublettes' +
                    '           ON CONCAT(titles.t_file, CAST(t_filesize AS CHAR)) = doublettes.key' +
                    ') doublettes2 ON titles.t_id = doublettes2.id',
                cache: {
                    useCache: false
                }
            },
            'conflictingRates': {
                constValues: ['conflictingRates'],
                filterField: '"666dummy999"'
            },
            'noCoordinates': {
                constValues: ['noCoordinates'],
                filterField: '"666dummy999"'
            },
            'noFavoriteChildren': {
                constValues: ['noFavoriteChildren'],
                filterField: '"666dummy999"'
            },
            'noGenre': {
                selectSql: 'SELECT COUNT(titles.t_id) AS count, "noGenre" AS value,' +
                    ' "noGenre" AS label, "true" AS id' +
                    ' FROM titles WHERE mr_id IS NULL OR mr_id IN (0,1 )',
                filterField: 'titles.mr_id',
                action: AdapterFilterActions.IN
            },
            'noMainFavoriteChildren': {
                constValues: ['noMainFavoriteChildren'],
                filterField: '"666dummy999"'
            },
            'noSubType': {
                constValues: ['noSubType'],
                filterField: '"666dummy999"'
            },
            'todoKeywords': {
                selectSql: 'SELECT COUNT(titles.t_id) AS count, "todoKeywords" AS value,' +
                    ' "todoKeywords" AS label, "true" AS id' +
                    ' FROM titles INNER JOIN titles_keyword ON titles.t_id=titles_keyword.t_id' +
                    ' INNER JOIN keyword ON titles_keyword.kw_id=keyword.kw_id ' +
                    'WHERE keyword.kw_name IN ("KW_TODOKEYWORDS")',
                filterField: 'keyword.kw_name',
                action: AdapterFilterActions.IN
            },
            'unrated': {
                selectSql: 'SELECT COUNT(titles.t_id) AS count, "unrated" AS value,' +
                    ' "unrated" AS label, "true" AS id' +
                    ' FROM titles WHERE t_rate IS NULL OR t_rate in (0)',
                filterField: 'titles.t_rate',
                action: AdapterFilterActions.IN
            },
            'unRatedChildren': {
                constValues: ['unRatedChildren'],
                filterField: '"666dummy999"'
            },
            // others
            'album_id_is': {
                selectSql: 'SELECT COUNT(titles.t_id) AS count, album.a_id AS value,' +
                    ' a_name AS label, album.a_id AS id' +
                    ' FROM album LEFT JOIN titles ON album.a_id = titles.a_id ' +
                    ' GROUP BY value, label, id' +
                    ' ORDER BY label',
                filterField: 'titles.a_id',
                action: AdapterFilterActions.IN
            },
            'album_ss': {
                selectSql: 'SELECT COUNT(titles.t_id) AS count, a_name AS value,' +
                    ' a_name AS label, album.a_id AS id' +
                    ' FROM album LEFT JOIN titles ON album.a_id = titles.a_id ' +
                    ' GROUP BY value, label, id' +
                    ' ORDER BY label',
                filterField: 'album.a_name',
                action: AdapterFilterActions.IN
            },
            'artist_id_is': {
                selectSql: 'SELECT COUNT(titles.t_id) AS count, bands.b_id AS value,' +
                    ' b_name AS label, bands.b_id AS id' +
                    ' FROM bands LEFT JOIN titles ON bands.b_id = titles.b_id ' +
                    ' GROUP BY value, label, id' +
                    ' ORDER BY label',
                filterField: 'titles.b_id',
                action: AdapterFilterActions.IN
            },
            'artist_ss': {
                selectSql: 'SELECT COUNT(titles.t_id) AS count, b_name AS value,' +
                    ' b_name AS label, bands.b_id AS id' +
                    ' FROM bands LEFT JOIN titles ON bands.b_id = titles.b_id ' +
                    ' GROUP BY value, label, id' +
                    ' ORDER BY label',
                filterField: 'bands.b_name',
                action: AdapterFilterActions.IN
            },
            'genre_id_is': {
                selectSql: 'SELECT COUNT(titles.t_id) AS count, musikrichtung.mr_id AS value,' +
                    ' mr_name AS label, musikrichtung.mr_id AS id' +
                    ' FROM musikrichtung LEFT JOIN titles ON musikrichtung.mr_id = titles.mr_id ' +
                    ' GROUP BY value, label, id' +
                    ' ORDER BY label',
                filterField: 'titles.mr_id',
                action: AdapterFilterActions.IN
            },
            'genre_ss': {
                selectSql: 'SELECT COUNT(titles.t_id) AS count, mr_name AS value,' +
                    ' mr_name AS label, musikrichtung.mr_id AS id' +
                    ' FROM musikrichtung LEFT JOIN titles ON musikrichtung.mr_id = titles.mr_id ' +
                    ' GROUP BY value, label, id' +
                    ' ORDER BY label',
                filterField: 'musikrichtung.mr_name',
                action: AdapterFilterActions.IN
            },
            'blocked_is': {
                noFacet: true
            },
            'initial_s': {
                selectSql: 'SELECT COUNT(*) as count, ' +
                    ' SUBSTR(UPPER(t_name), 1, 1) as value ' +
                    'FROM titles ' +
                    'WHERE LENGTH(t_name) > 0 ' +
                    'GROUP BY SUBSTR(UPPER(t_name), 1, 1)' +
                    'ORDER BY value',
            },
            'keywords_txt': {
                selectSql: 'SELECT COUNT(keyword.kw_id) AS count, ' +
                    ' kw_name AS value ' +
                    'FROM' +
                    ' keyword LEFT JOIN titles_keyword ON keyword.kw_id=titles_keyword.kw_id' +
                    ' GROUP BY value' +
                    ' ORDER BY value',
                filterField: 'keyword.kw_name',
                action: AdapterFilterActions.IN
            },
            'month_is': {
                noFacet: true
            },
            'playlists_txt': {
                selectSql: 'SELECT COUNT(playlist.p_id) AS count, ' +
                    ' p_name AS value ' +
                    'FROM' +
                    ' playlist LEFT JOIN titles_playlist ON playlist.p_id=titles_playlist.p_id' +
                    ' GROUP BY value' +
                    ' ORDER BY value',
                filterField: 'playlist.p_name',
                action: AdapterFilterActions.IN
            },
            'playlists_max_txt': {
                selectSql: 'SELECT max(tp_pos) AS count, ' +
                    '  p_name AS value ' +
                    'FROM' +
                    ' playlist LEFT OUTER JOIN titles_playlist ON playlist.p_id = titles_playlist.p_id' +
                    ' GROUP BY value' +
                    ' ORDER BY value',
                cache: {
                    useCache: false
                },
                filterField: 'p_name',
                action: AdapterFilterActions.IN
            },
            'rate_pers_gesamt_is': {
                selectField: 'titles.t_rate',
                orderBy: 'value asc'
            },
            'subtype_ss': {
                noFacet: true
            },
            'type_ss': {
                constValues: ['audio', 'genre', 'artist', 'album', 'playlist'],
                filterField: '"audio"',
                selectLimit: 1
            },
            'week_is': {
                noFacet: true
            },
            'year_is': {
                selectField: 'YEAR(t_date)',
                orderBy: 'value asc'
            },
        },
        changelogConfig: {
            createDateField: 't_createdat',
            updateDateField: 't_updatedat',
            updateVersionField: 't_updateversion',
            table: 'titles',
            fieldId: 't_id'
        },
        sortMapping: {
            'forExport': 'titles.t_id ASC',
            'name': 't_key ASC, bands.b_key ASC, album.a_key ASC',
            'fullName': 'bands.b_key ASC, album.a_key ASC, t_name ASC',
            'm3uExport': 'musikrichtung.mr_name, album_b_name, album.a_key ASC, COALESCE(t_tracknr, 999) ASC, t_name ASC',
            'order': 'bands.b_key ASC, album.a_key ASC, COALESCE(t_tracknr, 999) ASC, t_name ASC',
            'file': 'a_fav_url_txt ASC',
            'ratePers': 'titles.t_rate DESC',
            'playlistPos': 'titles_playlist.tp_pos ASC',
            'relevance': 'bands.b_key ASC, album.a_key ASC, COALESCE(t_tracknr, 999) ASC, t_name ASC',
            'createdAt': 't_createdat DESC, titles.t_id DESC',
            'updatedAt': 't_updatedat DESC, titles.t_id DESC'
        },
        filterMapping: {
            // dashboard
            doublettes: '"doublettes"',
            conflictingRates: '"666dummy999"',
            noFavoriteChildren: '"666dummy999"',
            noMainFavoriteChildren: '"666dummy999"',
            noMetaOnly: 'COALESCE(t_metadata, "noMetaOnly")',
            noGenre: 'titles.mr_id',
            noSubType: '"666dummy999"',
            todoKeywords: 'keyword.kw_name',
            unrated: 'titles.t_rate',
            unRatedChildren: '"666dummy999"',
            // changelog
            createdafter_dt: 't_createdat',
            updatedafter_dt: 't_updatedat',
            // others
            id: 'titles.t_id',
            album_id_i: 'titles.a_id',
            album_id_is: 'titles.a_id',
            artist_id_i: 'titles.b_id',
            artist_id_is: 'titles.b_id',
            audio_id_i: 'titles.t_id',
            audio_id_is: 'titles.t_id',
            genre_id_i: 'titles.mr_id',
            genre_id_is: 'titles.mr_id',
            playlist_id_i: '"dummy"',
            playlist_id_is: '"dummy"',
            name_s: 't_name',
            name_lower_hex: 'LOWER(HEX(' + MediaDocSqlUtils.generateLower('t_name') + '))',
            html: 'CONCAT(musikrichtung.mr_name, " ", bands.b_name, " ", album.a_name, " ", t_name, " ", titles.t_dir, "/", titles.t_file)',
            initial_s: 'SUBSTR(UPPER(t_name), 1, 1)',
            a_fav_url_hex: 'LOWER(HEX(' + MediaDocSqlUtils.generateLower(' CONCAT(titles.t_dir, "/", titles.t_file) ') + '))'
        },
        writeMapping: {
            'titles.mr_id': ':genre_id_i:',
            'titles.b_id': ':artist_id_i:',
            'titles.a_id': ':album_id_i:',
//                'titles.t_gesperrt': ':blocked_i:',
            'titles.t_desc': ':desc_txt:',
            'titles.t_name': ':name_s:',
            'titles.t_key': ':key_s:',
            'titles.t_rate': ':rate_pers_gesamt_i:',
            'titles.t_datefile': ':mediameta_filecreated_dt:',
            'titles.t_metadata': ':mediameta_metadata_txt:',
            'titles.t_duration': ':mediameta_duration_i:',
            'titles.t_filesize': ':mediameta_filesize_i:',
            'titles.t_date': ':mediameta_recordingdate_dt:',
            'titles.t_tracknr': ':trackno_i:'
        },
        fieldMapping: {
            id: 'id',
            album_id_i: 'a_id',
            album_id_is: 'a_id',
            artist_id_i: 'b_id',
            artist_id_is: 'b_id',
            audio_id_i: 't_id',
            audio_id_is: 't_id',
            genre_id_i: 'mr_id',
            genre_id_is: 'mr_id',
            playlist_id_i: '"dummy"',
            playlist_id_is: '"dummy"',
            album_s: 'a_name',
            album_artist_s: 'album_b_name',
            album_genre_s: 'album_mr_name',
            artist_s: 'b_name',
            // blocked_i: 't_gesperrt',
            dateshow_dt: 't_dateshow',
            desc_txt: 't_desc',
            genre_s: 'mr_name',
            playlists_txt: 't_playlists',
            name_s: 'name',
            trackno_i: 't_tracknr',
            mediameta_duration_i: 't_duration',
            mediameta_filecreated_dt: 't_datefile',
            mediameta_filename_s: 'a_fav_url_txt',
            mediameta_filesize_i: 't_filesize',
            mediameta_metadata_txt: 't_metadata',
            mediameta_recordingdate_dt: 't_date',
            rate_pers_gesamt_i: 't_rate',
            key_s: 'key',
            type_s: 'type',
            subtype_s: 'subtype',
            a_fav_url_txt: 'a_fav_url_txt',
            i_fav_url_txt: 'i_fav_url_txt',
            // changelog
            createdat_dt: 't_createdat',
            updatedat_dt: 't_updatedat',
            updateversion_i: 't_updateversion'
        }
    };

    public static readonly keywordModelConfigType: KeywordModelConfigJoinType = {
        table: 'titles', joinTable: 'titles_keyword', fieldReference: 't_id',
        changelogConfig: SqlMediaDbAudioConfig.tableConfig.changelogConfig
    };

    public static readonly playlistModelConfigType: PlaylistModelConfigJoinType = {
        table: 'titles', joinTable: 'titles_playlist', fieldReference: 't_id', positionField: 'tp_pos',
        changelogConfig: SqlMediaDbAudioConfig.tableConfig.changelogConfig
    };

    public static readonly rateModelConfigType: RateModelConfigTableType = {
        fieldId: 't_id',
        table: 'titles',
        rateFields: {
            'gesamt': 't_rate'
        },
        fieldSum: undefined,
        changelogConfig: SqlMediaDbAudioConfig.tableConfig.changelogConfig
    };

    public static readonly rateModelConfigTypeAlbumAudios: RateModelConfigTableType = {
        fieldId: 'a_id',
        table: 'titles',
        rateFields: {
            'gesamt': 't_rate'
        },
        fieldSum: undefined,
        changelogConfig: SqlMediaDbAudioConfig.tableConfig.changelogConfig
    };

    public static readonly actionTagAssignConfig: ActionTagAssignTableConfigType = {
        table: 'titles',
        idField: 't_id',
        references: {
            'genre_id_is': {
                table: 'musikrichtung', idField: 'mr_id', referenceField: 'mr_id'
            },
            'artist_id_is': {
                table: 'bands', idField: 'b_id', referenceField: 'b_id'
            },
            'album_id_is': {
                table: 'album', idField: 'a_id', referenceField: 'a_id'
            },
        },
        changelogConfig: SqlMediaDbAudioConfig.tableConfig.changelogConfig
    };

    public static readonly actionTagBlockConfig: ActionTagBlockTableConfigType = {
        table: 'titles', idField: 't_id', blockField: 't_blocked',
        changelogConfig: SqlMediaDbAudioConfig.tableConfig.changelogConfig
    };

    public static readonly actionTagReplaceConfig: ActionTagReplaceTableConfigType = {
        table: 'titles',
        fieldId: 't_id',
        referenced: [],
        joins: [
            { table: 'titles_keyword', fieldReference: 't_id' },
            { table: 'titles_playlist', fieldReference: 't_id' }
        ],
        changelogConfig: SqlMediaDbAudioConfig.tableConfig.changelogConfig
    };
}

