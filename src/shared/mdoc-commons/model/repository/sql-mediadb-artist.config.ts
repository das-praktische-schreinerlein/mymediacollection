import {AdapterFilterActions} from '@dps/mycms-commons/dist/search-commons/services/mapper.utils';
import {TableConfig} from '@dps/mycms-commons/dist/search-commons/services/sql-query.builder';
import {KeywordModelConfigJoinType} from '@dps/mycms-commons/dist/action-commons/actions/common-sql-keyword.adapter';
import {RateModelConfigTableType} from '@dps/mycms-commons/dist/action-commons/actions/common-sql-rate.adapter';
import {ActionTagAssignTableConfigType} from '@dps/mycms-commons/dist/action-commons/actiontags/common-sql-actiontag-assign.adapter';
import {ActionTagBlockTableConfigType} from '@dps/mycms-commons/dist/action-commons/actiontags/common-sql-actiontag-block.adapter';
import {ActionTagReplaceTableConfigType} from '@dps/mycms-commons/dist/action-commons/actiontags/common-sql-actiontag-replace.adapter';
import {MediaDocSqlUtils} from '../../services/mdoc-sql.utils';

export class SqlMediaDbArtistConfig {
    public static readonly tableConfig: TableConfig = {
        key: 'artist',
        tableName: 'bands',
        selectFrom: 'bands LEFT JOIN  musikrichtung ON musikrichtung.mr_id = bands.mr_id ',
        optionalGroupBy: [
            {
                from: 'LEFT JOIN titles ON titles.b_id=bands.b_id ' +
                    'LEFT JOIN titles_playlist ON titles.t_id=titles_playlist.t_id ' +
                    'LEFT JOIN playlist ON titles_playlist.p_id=playlist.p_id',
                triggerParams: ['id', 'playlists_txt'],
                groupByFields: ['GROUP_CONCAT(DISTINCT playlist.p_name ORDER BY playlist.p_name SEPARATOR ", ") AS b_playlists']
            },
            {
                from: 'LEFT JOIN bands_keyword ON bands.b_id=bands_keyword.b_id ' +
                    'LEFT JOIN keyword ON bands_keyword.kw_id=keyword.kw_id ',
                triggerParams: ['id', 'keywords_txt', 'todoKeywords'],
                groupByFields: ['GROUP_CONCAT(DISTINCT keyword.kw_name ORDER BY keyword.kw_name SEPARATOR ", ") AS b_keywords']
            },
            {
                from: 'LEFT JOIN album_bands ON bands.b_id=album_bands.b_id ' +
                    'LEFT JOIN album ON album_bands.a_id=album.a_id OR album.b_id=bands.b_id ',
                triggerParams: ['id', 'album_id_i', 'album_id_is'],
                groupByFields: ['GROUP_CONCAT(DISTINCT album.a_id ORDER BY album.a_id SEPARATOR ", ") AS b_a_ids',
                    'GROUP_CONCAT(DISTINCT album.a_id ORDER BY album.a_id SEPARATOR ", ") AS b_kb_ids']
            },
            {
                from: 'INNER JOIN (SELECT b_id AS id FROM bands INNER JOIN' +
                    '                (SELECT DISTINCT b_key FROM bands GROUP BY b_key' +
                    '                 HAVING COUNT(*) > 1) doublettes' +
                    '                ON bands.b_key = doublettes.b_key) doublettes2' +
                    '             ON bands.b_id = doublettes2.id',
                triggerParams: ['doublettes'],
                groupByFields: []
            },
            {
                from: 'INNER JOIN' +
                    '      (SELECT DISTINCT b_id AS id FROM bands' +
                    '       WHERE b_id IN (SELECT DISTINCT b_ID FROM titles WHERE t_rate = 0 OR t_rate IS NULL)' +
                    '       AND b_id NOT IN (SELECT DISTINCT b_ID FROM titles WHERE t_rate <> 0 AND t_rate IS NOT NULL)' +
                    '      ) noFavoriteChildren' +
                    '  ON bands.b_id=noFavoriteChildren.id',
                triggerParams: ['noFavoriteChildren'],
                groupByFields: []
            },
            {
                from: 'INNER JOIN (SELECT DISTINCT b_id AS id FROM bands WHERE b_id IN' +
                    '      (SELECT DISTINCT b_ID FROM titles WHERE t_rate = 0 OR t_rate IS NULL)) unRatedChildren' +
                    '   ON bands.b_id=unRatedChildren.id',
                triggerParams: ['unRatedChildren'],
                groupByFields: []
            },
            {
                from: 'INNER JOIN (SELECT DISTINCT b_id AS id FROM bands WHERE b_id NOT IN ' +
                    '     (SELECT DISTINCT b_ID FROM titles INNER JOIN titles_playlist ON titles.t_id=titles_playlist.t_ID WHERE p_id IN ' +
                    '          (SELECT DISTINCT p_id FROM playlist WHERE p_name like "%Artist_Favorites%"))' +
                    '      AND b_id IN (SELECT DISTINCT b_ID FROM titles WHERE t_rate = 0 OR t_rate IS NULL)) noMainFavoriteChildren' +
                    ' ON bands.b_id=noMainFavoriteChildren.id',
                triggerParams: ['noMainFavoriteChildren'],
                groupByFields: []
            }
        ],
        loadDetailData: [
            {
                profile: 'keywords',
                sql: 'select GROUP_CONCAT(DISTINCT keyword.kw_name ORDER BY keyword.kw_name SEPARATOR ", ") AS keywords ' +
                    'FROM bands INNER JOIN bands_keyword ON bands.b_id=bands_keyword.b_id' +
                    ' INNER JOIN keyword on bands_keyword.kw_id=keyword.kw_id ' +
                    'WHERE bands.b_id in (:id)',
                parameterNames: ['id']
            },
            {
                profile: 'extended_object_properties',
                sql: 'SELECT CONCAT("category=ENTITYCOUNT:::name=ALBUM_COUNT:::value=", CAST(COUNT(DISTINCT album.a_id) AS CHAR)) AS extended_object_properties' +
                    '       FROM bands' +
                    '       INNER JOIN album ON album.b_id = bands.b_id' +
                    '       LEFT JOIN album_bands ON album.a_id = album_bands.a_id' +
                    '       WHERE album_bands.b_id IN (:id) OR album.b_id IN (:id)' +
                    '   UNION ' +
                    'SELECT CONCAT("category=ENTITYCOUNT:::name=AUDIO_COUNT:::value=", CAST(COUNT(DISTINCT titles.t_id) AS CHAR)) AS extended_object_properties' +
                    '       FROM bands' +
                    '       INNER JOIN titles ON titles.b_id=bands.b_id' +
                    '       WHERE bands.b_id IN (:id)' +
                    '   UNION ' +
                    'SELECT CONCAT("category=ENTITYCOUNT:::name=AUDIO_TOP_COUNT:::value=", CAST(COUNT(DISTINCT titles.t_id) AS CHAR)) AS extended_object_properties' +
                    '       FROM bands' +
                    '       INNER JOIN titles ON titles.b_id=bands.b_id' +
                    '       WHERE bands.b_id IN (:id) AND t_rate >= 6' +
                    '   UNION ' +
                    'SELECT CONCAT("category=ENTITYCOUNT:::name=AUDIO_FAV_COUNT:::value=", CAST(COUNT(DISTINCT titles.t_id) AS CHAR)) AS extended_object_properties' +
                    '       FROM bands' +
                    '       INNER JOIN titles ON titles.b_id=bands.b_id' +
                    '       WHERE bands.b_id IN (:id) AND t_rate > 0',
                parameterNames: ['id']
            },
            {
                profile: 'navigation_objects',
                sql: '(SELECT CONCAT("navid=ARTIST_", b_id, ":::name=", COALESCE(b_name, "null"), ":::navtype=", "PREDECESSOR")' +
                    '  AS navigation_objects' +
                    '  FROM bands WHERE b_name < (SELECT b_name FROM bands WHERE b_id IN (:id))' +
                    '  ORDER BY b_name DESC, b_id DESC LIMIT 1) ' +
                    'UNION ' +
                    ' (SELECT CONCAT("navid=ARTIST_", b_id, ":::name=", COALESCE(b_name, "null"), ":::navtype=", "SUCCESSOR")' +
                    '  AS navigation_objects' +
                    '  FROM bands WHERE b_name > (SELECT b_name FROM bands WHERE b_id IN (:id))' +
                    '   ORDER BY b_name, b_id LIMIT 1)',
                parameterNames: ['id'],
                modes: ['details']
            }
        ],
        groupbBySelectFieldListIgnore: ['a_keywords', 'a_playlists'],
        selectFieldList: [
            '"ARTIST" AS type',
            'CONCAT("ARTIST", "_", bands.b_id) AS id',
            'bands.b_id',
            'bands.mr_id',
            'b_name',
            'b_name AS name',
            'mr_name',
            'mr_key',
            'b_key',
            'b_key as key',
            'b_rate',
            'CONCAT(b_name, " - ", mr_name) AS html',
            // changelog
            'b_createdat',
            'b_updatedat',
            'b_updateversion'
        ],
        facetConfigs: {
            // dashboard
            'doublettes': {
                selectSql: 'SELECT COUNT(bands.b_id) AS count, "doublettes" AS value,' +
                    ' "doublettes" AS label, "true" AS id' +
                    ' FROM bands INNER JOIN (SELECT b_id AS id FROM bands INNER JOIN' +
                    '                (SELECT DISTINCT b_key FROM bands GROUP BY b_key' +
                    '                 HAVING COUNT(*) > 1) doublettes' +
                    '                ON bands.b_key = doublettes.b_key) doublettes2' +
                    '             ON bands.b_id = doublettes2.id',
                cache: {
                    useCache: false
                }
            },
            'conflictingRates': {
                constValues: ['conflictingRates'],
                filterField: '"666dummy999"'
            },
            'noFavoriteChildren': {
                selectSql: 'SELECT COUNT(bands.b_id) AS count, "noFavoriteChildren" AS value,' +
                    ' "noFavoriteChildren" AS label, "true" AS id' +
                    ' FROM bands INNER JOIN' +
                    '      (SELECT DISTINCT b_id AS id FROM bands' +
                    '       WHERE b_id IN (SELECT DISTINCT b_ID FROM titles WHERE t_rate = 0 OR t_rate IS NULL)' +
                    '       AND b_id NOT IN (SELECT DISTINCT b_ID FROM titles WHERE t_rate <> 0 AND t_rate IS NOT NULL)' +
                    '      ) noFavoriteChildren' +
                    '  ON bands.b_id=noFavoriteChildren.id',
                cache: {
                    useCache: false
                }
            },
            'noGenre': {
                selectSql: 'SELECT COUNT(bands.b_id) AS count, "noGenre" AS value,' +
                    ' "noGenre" AS label, "true" AS id' +
                    ' FROM bands WHERE mr_id IS NULL OR mr_id IN (0,1 )',
                filterField: 'bands.mr_id',
                action: AdapterFilterActions.IN
            },
            'noMainFavoriteChildren': {
                selectSql: 'SELECT COUNT(bands.b_id) AS count, "noMainFavoriteChildren" AS value,' +
                    ' "noMainFavoriteChildren" AS label, "true" AS id' +
                    ' FROM bands INNER JOIN (SELECT DISTINCT b_id AS id FROM bands WHERE b_id NOT IN ' +
                    '     (SELECT DISTINCT b_ID FROM titles INNER JOIN titles_playlist ON titles.t_id=titles_playlist.t_id WHERE p_id IN ' +
                    '          (SELECT DISTINCT p_id FROM playlist WHERE p_name like "%Artist_Favorites%"))' +
                    '      AND b_id IN (SELECT DISTINCT b_ID FROM titles WHERE t_rate = 0 OR t_rate IS NULL)) noMainFavoriteChildren' +
                    ' ON bands.b_id=noMainFavoriteChildren.id',
                cache: {
                    useCache: false
                }
            },
            'noSubType': {
                constValues: ['noSubType'],
                filterField: '"666dummy999"'
            },
            'todoKeywords': {
                selectSql: 'SELECT COUNT(bands.b_id) AS count, "todoKeywords" AS value,' +
                    ' "todoKeywords" AS label, "true" AS id' +
                    ' FROM bands INNER JOIN bands_keyword ON bands.b_id=bands_keyword.b_id' +
                    ' INNER JOIN keyword ON bands_keyword.kw_id=keyword.kw_id ' +
                    'WHERE keyword.kw_name IN ("KW_TODOKEYWORDS")',
                filterField: 'keyword.kw_name',
                action: AdapterFilterActions.IN
            },
            'unrated': {
                selectSql: 'SELECT COUNT(bands.b_id) AS count, "unrated" AS value,' +
                    ' "unrated" AS label, "true" AS id' +
                    ' FROM bands WHERE b_rate IS NULL OR b_rate in (0)',
                filterField: 'bands.b_rate',
                action: AdapterFilterActions.IN
            },
            'unRatedChildren': {
                selectSql: 'SELECT COUNT(bands.b_id) AS count, "unRatedChildren" AS value,' +
                    ' "unRatedChildren" AS label, "true" AS id' +
                    ' FROM bands INNER JOIN (SELECT DISTINCT b_id AS id FROM bands WHERE b_id IN' +
                    '      (SELECT DISTINCT b_ID FROM titles WHERE t_rate = 0 OR t_rate IS NULL)) unRatedChildren' +
                    '   ON bands.b_id=unRatedChildren.id',
                cache: {
                    useCache: false
                }
            },
            // others
            'artist_ss': {
                noFacet: true
            },
            'genre_id_is': {
                selectSql: 'SELECT COUNT(bands.b_id) AS count, musikrichtung.mr_id AS value,' +
                    ' mr_name AS label, musikrichtung.mr_id AS id' +
                    ' FROM musikrichtung LEFT JOIN bands ON musikrichtung.mr_id = bands.mr_id ' +
                    ' GROUP BY value, label, id' +
                    ' ORDER BY label',
                filterField: 'bands.mr_id',
                action: AdapterFilterActions.IN
            },
            'genre_ss': {
                selectSql: 'SELECT COUNT(bands.b_id) AS count, mr_name AS value,' +
                    ' mr_name AS label, musikrichtung.mr_id AS id' +
                    ' FROM musikrichtung LEFT JOIN bands ON musikrichtung.mr_id = bands.mr_id ' +
                    ' GROUP BY value, label, id' +
                    ' ORDER BY label',
                filterField: 'musikrichtung.mr_name',
                action: AdapterFilterActions.IN
            },
            'initial_s': {
                selectSql: 'SELECT COUNT(*) as count, ' +
                    ' SUBSTR(UPPER(b_name), 1, 1) as value ' +
                    'FROM bands ' +
                    'WHERE LENGTH(b_name) > 0 ' +
                    'GROUP BY SUBSTR(UPPER(b_name), 1, 1)' +
                    'ORDER BY value',
            },
            'blocked_is': {
                noFacet: true
            },
            'keywords_txt': {
                selectSql: 'SELECT COUNT(keyword.kw_id) AS count, ' +
                    ' kw_name AS value ' +
                    'FROM' +
                    ' keyword LEFT JOIN bands_keyword ON keyword.kw_id=bands_keyword.kw_id' +
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
                    ' LEFT JOIN titles ON titles.t_id=titles_playlist.t_id' +
                    ' LEFT JOIN bands ON titles.b_id=bands.b_id' +
                    ' GROUP BY value' +
                    ' ORDER BY value',
                filterField: 'playlist.p_name',
                action: AdapterFilterActions.IN
            },
            'rate_pers_gesamt_is': {
                selectField: 'bands.b_rate',
                orderBy: 'value asc'
            },
            'subtype_ss': {
                noFacet: true
            },
            'type_ss': {
                constValues: ['audio', 'genre', 'artist', 'album', 'playlist'],
                filterField: '"artist"',
                selectLimit: 1
            },
            'week_is': {
                noFacet: true
            },
            'year_is': {
                noFacet: true
            }
        },
        changelogConfig: {
            createDateField: 'b_createdat',
            updateDateField: 'b_updatedat',
            updateVersionField: 'b_updateversion',
            table: 'bands',
            fieldId: 'b_id'
        },
        sortMapping: {
            'countAlbums': '(SELECT COUNT(DISTINCT a_sort.a_id) FROM album a_sort' +
                '      LEFT JOIN album_bands ab_sort ON a_sort.a_id = ab_sort.a_id' +
                '      WHERE ab_sort.b_id = bands.b_id OR a_sort.b_id = bands.b_id) ASC',
            'countAlbumsDesc': '(SELECT COUNT(DISTINCT a_sort.a_id) FROM album a_sort ' +
                '      LEFT JOIN album_bands ab_sort ON a_sort.a_id = ab_sort.a_id' +
                '      WHERE ab_sort.b_id = bands.b_id OR a_sort.b_id = bands.b_id) DESC',
            'countAudios': '(SELECT COUNT(DISTINCT t_sort.t_id) FROM titles t_sort WHERE t_sort.b_id = bands.b_id) ASC',
            'countAudiosDesc': '(SELECT COUNT(DISTINCT t_sort.t_id) FROM titles t_sort WHERE t_sort.b_id = bands.b_id) DESC',
            'countFavAudios': '(SELECT COUNT(DISTINCT t_sort.t_id) FROM titles t_sort WHERE t_rate > 0 AND t_sort.b_id = bands.b_id) ASC',
            'countFavAudiosDesc': '(SELECT COUNT(DISTINCT t_sort.t_id) FROM titles t_sort WHERE t_rate > 0 AND t_sort.b_id = bands.b_id) DESC',
            'forExport': 'bands.b_id ASC',
            'name': 'bands.b_name ASC',
            'ratePers': 'bands.b_rate DESC',
            'relevance': 'bands.b_id DESC',
            'createdAt': 'b_createdat DESC, bands.b_id DESC',
            'updatedAt': 'b_updatedat DESC, bands.b_id DESC'
        },
        filterMapping: {
            // dashboard
            doublettes: '"doublettes"',
            conflictingRates: '"666dummy999"',
            noFavoriteChildren: '"noFavoriteChildren"',
            noMainFavoriteChildren: '"noMainFavoriteChildren"',
            noGenre: 'bands.mr_id',
            noSubType: '"666dummy999"',
            todoKeywords: 'keyword.kw_name',
            unrated: 'bands.b_rate',
            unRatedChildren: '"unRatedChildren"',
            // changelog
            createdafter_dt: 'b_createdat',
            updatedafter_dt: 'b_updatedat',
            // others
            id: 'bands.b_id',
            album_id_i: 'album.a_id',
            album_id_is: 'album.a_id',
            artist_id_i: 'bands.b_id',
            artist_id_is: 'bands.b_id',
            audio_id_i: '"dummy"',
            audio_id_is: '"dummy"',
            genre_id_i: 'bands.mr_id',
            genre_id_is: 'bands.mr_id',
            playlist_id_i: '"dummy"',
            playlist_id_is: '"dummy"',
            name_s: 'bands.b_name',
            name_lower_hex: 'LOWER(HEX(' + MediaDocSqlUtils.generateLower('bands.b_name') + '))',
            html: 'bands.b_name',
            initial_s: 'SUBSTR(UPPER(bands.b_name), 1, 1)'

        },
        writeMapping: {
            'bands.mr_id': ':genre_id_i:',
            'bands.b_beschreibung': ':desc_txt:',
            'bands.b_name': ':name_s:',
            'bands.b_rate': ':rate_pers_gesamt_i:',
            'bands.b_key': ':key_s:'
        },
        fieldMapping: {
            id: 'id',
            artist_id_i: 'b_id',
            artist_id_is: 'b_id',
            genre_id_i: 'mr_id',
            genre_id_is: 'mr_id',
            artist_s: 'b_name',
            blocked_i: 'b_gesperrt',
            desc_txt: 'b_beschreibung',
            genre_s: 'mr_name',
            playlists_txt: 'b_playlists',
            name_s: 'name',
            rate_pers_gesamt_i: 'b_rate',
            key_s: 'key',
            type_s: 'type',
            subtype_s: 'subtype',
            // changelog
            createdat_dt: 'b_createdat',
            updatedat_dt: 'b_updatedat',
            updateversion_i: 'b_updateversion'
        }
    };

    public static readonly keywordModelConfigType: KeywordModelConfigJoinType = {
        table: 'bands', joinTable: 'bands_keyword', fieldReference: 'b_id',
        changelogConfig: SqlMediaDbArtistConfig.tableConfig.changelogConfig
    };

    public static readonly rateModelConfigType: RateModelConfigTableType = {
        fieldId: 'b_id',
        table: 'bands',
        rateFields: {
            'gesamt': 'b_rate'
        },
        fieldSum: undefined,
        changelogConfig: SqlMediaDbArtistConfig.tableConfig.changelogConfig
    };

    public static readonly actionTagAssignConfig: ActionTagAssignTableConfigType = {
        table: 'bands',
        idField: 'b_id',
        references: {
            'genre_id_is': {
                table: 'musikrichtung', idField: 'mr_id', referenceField: 'mr_id'
            },
            'artist_id_is': {
                table: 'bands', idField: 'b_id', referenceField: 'b_id'
            }
        },
        changelogConfig: SqlMediaDbArtistConfig.tableConfig.changelogConfig
    };

    public static readonly actionTagBlockConfig: ActionTagBlockTableConfigType = {
        table: 'bands', idField: 'b_id', blockField: 'b_blocked',
        changelogConfig: SqlMediaDbArtistConfig.tableConfig.changelogConfig
    };

    public static readonly actionTagReplaceConfig: ActionTagReplaceTableConfigType = {
        table: 'bands',
        fieldId: 'b_id',
        referenced: [
            { table: 'album', fieldReference: 'b_id' },
            { table: 'album_bands', fieldReference: 'a_id' },
            { table: 'titles', fieldReference: 'b_id' }
        ],
        joins: [
            { table: 'bands_keyword', fieldReference: 'b_id' }
        ],
        changelogConfig: SqlMediaDbArtistConfig.tableConfig.changelogConfig
    };
}

