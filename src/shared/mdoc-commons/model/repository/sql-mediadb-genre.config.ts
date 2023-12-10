import {AdapterFilterActions} from '@dps/mycms-commons/dist/search-commons/services/mapper.utils';
import {TableConfig} from '@dps/mycms-commons/dist/search-commons/services/sql-query.builder';
import {RateModelConfigTableType} from '@dps/mycms-commons/dist/action-commons/actions/common-sql-rate.adapter';
import {ActionTagAssignTableConfigType} from '@dps/mycms-commons/dist/action-commons/actiontags/common-sql-actiontag-assign.adapter';
import {ActionTagBlockTableConfigType} from '@dps/mycms-commons/dist/action-commons/actiontags/common-sql-actiontag-block.adapter';
import {ActionTagReplaceTableConfigType} from '@dps/mycms-commons/dist/action-commons/actiontags/common-sql-actiontag-replace.adapter';
import {MediaDocSqlUtils} from '../../services/mdoc-sql.utils';

export class SqlMediaDbGenreConfig {
    public static readonly tableConfig: TableConfig = {
        key: 'genre',
        tableName: 'musikrichtung',
        selectFrom: 'musikrichtung',
        optionalGroupBy: [
            {
                from: 'LEFT JOIN titles ON titles.mr_id=musikrichtung.mr_id ' +
                    'LEFT JOIN titles_playlist ON titles.t_id=titles_playlist.t_id ' +
                    'LEFT JOIN playlist ON titles_playlist.p_id=playlist.p_id',
                triggerParams: ['id', 'playlists_txt'],
                groupByFields: ['GROUP_CONCAT(DISTINCT playlist.p_name ORDER BY playlist.p_name SEPARATOR ", ") AS playlists']
            },
            {
                from: 'LEFT JOIN musikrichtung_keyword ON musikrichtung.mr_id=musikrichtung_keyword.mr_id ' +
                    'LEFT JOIN keyword ON musikrichtung_keyword.kw_id=keyword.kw_id ',
                triggerParams: ['id', 'keywords_txt', 'todoKeywords'],
                groupByFields: ['GROUP_CONCAT(DISTINCT keyword.kw_name ORDER BY keyword.kw_name SEPARATOR ", ") AS mr_keywords']
            },
            {
                from: 'INNER JOIN (SELECT mr_id AS id FROM musikrichtung INNER JOIN' +
                    '                (SELECT DISTINCT mr_key FROM musikrichtung GROUP BY mr_key' +
                    '                 HAVING COUNT(*) > 1) doublettes' +
                    '                ON musikrichtung.mr_key = doublettes.mr_key) doublettes2' +
                    '             ON musikrichtung.mr_id = doublettes2.id',
                triggerParams: ['doublettes'],
                groupByFields: []
            },
            {
                from: 'INNER JOIN' +
                    '      (SELECT DISTINCT mr_id AS id FROM musikrichtung' +
                    '       WHERE mr_id IN (SELECT DISTINCT mr_ID FROM titles WHERE t_rate = 0 OR t_rate IS NULL)' +
                    '       AND mr_id NOT IN (SELECT DISTINCT mr_ID FROM titles WHERE t_rate <> 0 AND t_rate IS NOT NULL)' +
                    '      ) noFavoriteChildren' +
                    '  ON musikrichtung.mr_id=noFavoriteChildren.id',
                triggerParams: ['noFavoriteChildren'],
                groupByFields: []
            },
            {
                from: 'INNER JOIN (SELECT DISTINCT mr_id AS id FROM musikrichtung WHERE mr_id IN' +
                    '      (SELECT DISTINCT mr_ID FROM titles WHERE t_rate = 0 OR t_rate IS NULL)) unRatedChildren' +
                    '   ON musikrichtung.mr_id=unRatedChildren.id',
                triggerParams: ['unRatedChildren'],
                groupByFields: []
            },
            {
                from: 'INNER JOIN (SELECT DISTINCT mr_id AS id FROM musikrichtung WHERE mr_id NOT IN ' +
                    '     (SELECT DISTINCT mr_ID FROM titles INNER JOIN titles_playlist ON titles.t_id=titles_playlist.t_ID WHERE p_id IN ' +
                    '          (SELECT DISTINCT p_id FROM playlist WHERE p_name like "%Genre_Favorites%"))' +
                    '      AND mr_id IN (SELECT DISTINCT mr_ID FROM titles WHERE t_rate = 0 OR t_rate IS NULL)) noMainFavoriteChildren' +
                    ' ON musikrichtung.mr_id=noMainFavoriteChildren.id',
                triggerParams: ['noMainFavoriteChildren'],
                groupByFields: []
            }
        ],
        loadDetailData: [
            {
                profile: 'extended_object_properties',
                sql: 'SELECT CONCAT("category=ENTITYCOUNT:::name=ARTIST_COUNT:::value=", CAST(COUNT(DISTINCT bands.b_id) AS CHAR)) AS extended_object_properties' +
                    '       FROM musikrichtung' +
                    '       INNER JOIN bands ON bands.mr_id=musikrichtung.mr_id' +
                    '       WHERE musikrichtung.mr_id IN (:id)' +
                    '   UNION ' +
                    'SELECT CONCAT("category=ENTITYCOUNT:::name=ALBUM_COUNT:::value=", CAST(COUNT(DISTINCT album.a_id) AS CHAR)) AS extended_object_properties' +
                    '       FROM musikrichtung' +
                    '       INNER JOIN album ON album.mr_id=musikrichtung.mr_id' +
                    '       WHERE musikrichtung.mr_id IN (:id)' +
                    '   UNION ' +
                    'SELECT CONCAT("category=ENTITYCOUNT:::name=AUDIO_COUNT:::value=", CAST(COUNT(DISTINCT titles.t_id) AS CHAR)) AS extended_object_properties' +
                    '       FROM musikrichtung' +
                    '       INNER JOIN titles ON titles.mr_id=musikrichtung.mr_id' +
                    '       WHERE musikrichtung.mr_id IN (:id)' +
                    '   UNION ' +
                    'SELECT CONCAT("category=ENTITYCOUNT:::name=AUDIO_TOP_COUNT:::value=", CAST(COUNT(DISTINCT titles.t_id) AS CHAR)) AS extended_object_properties' +
                    '       FROM musikrichtung' +
                    '       INNER JOIN titles ON titles.mr_id=musikrichtung.mr_id' +
                    '       WHERE musikrichtung.mr_id IN (:id) AND t_rate >= 6' +
                    '   UNION ' +
                    'SELECT CONCAT("category=ENTITYCOUNT:::name=AUDIO_FAV_COUNT:::value=", CAST(COUNT(DISTINCT titles.t_id) AS CHAR)) AS extended_object_properties' +
                    '       FROM musikrichtung' +
                    '       INNER JOIN titles ON titles.mr_id=musikrichtung.mr_id' +
                    '       WHERE musikrichtung.mr_id IN (:id) AND t_rate > 0',
                parameterNames: ['id']
            },
            {
                profile: 'navigation_objects',
                sql: '(SELECT CONCAT("navid=GENRE_", mr_id, ":::name=", COALESCE(mr_name, "null"), ":::navtype=", "PREDECESSOR")' +
                    '  AS navigation_objects' +
                    '  FROM musikrichtung WHERE mr_name < (SELECT mr_name FROM musikrichtung WHERE mr_id IN (:id))' +
                    '  ORDER BY mr_name DESC, mr_id DESC LIMIT 1) ' +
                    'UNION ' +
                    ' (SELECT CONCAT("navid=GENRE_", mr_id, ":::name=", COALESCE(mr_name, "null"), ":::navtype=", "SUCCESSOR")' +
                    '  AS navigation_objects' +
                    '  FROM musikrichtung WHERE mr_name > (SELECT mr_name FROM musikrichtung WHERE mr_id IN (:id))' +
                    '   ORDER BY mr_name,  mr_id LIMIT 1)',
                parameterNames: ['id'],
                modes: ['details']
            }
        ],
        groupbBySelectFieldListIgnore: [],
        selectFieldList: [
            '"GENRE" AS type',
            'CONCAT("GENRE", "_", musikrichtung.mr_id) AS id',
            'musikrichtung.mr_id',
            'mr_name',
            'mr_name AS name',
            'mr_key',
            'mr_key AS key',
            'mr_rate',
            'mr_name AS html'
        ],
        facetConfigs: {
            // dashboard
            'doublettes': {
                selectSql: 'SELECT COUNT(musikrichtung.mr_id) AS count, "doublettes" AS value,' +
                    ' "doublettes" AS label, "true" AS id' +
                    ' FROM musikrichtung INNER JOIN (SELECT mr_id AS id FROM musikrichtung INNER JOIN' +
                    '                (SELECT DISTINCT mr_key FROM musikrichtung GROUP BY mr_key' +
                    '                 HAVING COUNT(*) > 1) doublettes' +
                    '                ON musikrichtung.mr_key = doublettes.mr_key) doublettes2' +
                    '             ON musikrichtung.mr_id = doublettes2.id',
                cache: {
                    useCache: false
                }
            },
            'conflictingRates': {
                constValues: ['conflictingRates'],
                filterField: '"666dummy999"'
            },
            'noFavoriteChildren': {
                selectSql: 'SELECT COUNT(musikrichtung.mr_id) AS count, "noFavoriteChildren" AS value,' +
                    ' "noFavoriteChildren" AS label, "true" AS id' +
                    ' FROM musikrichtung INNER JOIN' +
                    '      (SELECT DISTINCT mr_id AS id FROM musikrichtung' +
                    '       WHERE mr_id IN (SELECT DISTINCT mr_ID FROM titles WHERE t_rate = 0 OR t_rate IS NULL)' +
                    '       AND mr_id NOT IN (SELECT DISTINCT mr_ID FROM titles WHERE t_rate <> 0 AND t_rate IS NOT NULL)' +
                    '      ) noFavoriteChildren' +
                    '  ON musikrichtung.mr_id=noFavoriteChildren.id',
                cache: {
                    useCache: false
                }
            },
            'noGenre': {
                constValues: ['noGenre'],
                filterField: '"666dummy999"'
            },
            'noMainFavoriteChildren': {
                selectSql: 'SELECT COUNT(musikrichtung.mr_id) AS count, "noMainFavoriteChildren" AS value,' +
                    ' "noMainFavoriteChildren" AS label, "true" AS id' +
                    ' FROM musikrichtung INNER JOIN (SELECT DISTINCT mr_id AS id FROM musikrichtung WHERE mr_id NOT IN ' +
                    '     (SELECT DISTINCT mr_ID FROM titles INNER JOIN titles_playlist ON titles.t_id=titles_playlist.t_id WHERE p_id IN ' +
                    '          (SELECT DISTINCT p_id FROM playlist WHERE p_name like "%Genre_Favorites%"))' +
                    '      AND mr_id IN (SELECT DISTINCT mr_ID FROM titles WHERE t_rate = 0 OR t_rate IS NULL)) noMainFavoriteChildren' +
                    ' ON musikrichtung.mr_id=noMainFavoriteChildren.id',
                cache: {
                    useCache: false
                }
            },
            'noSubType': {
                constValues: ['noSubType'],
                filterField: '"666dummy999"'
            },
            'todoKeywords': {
                selectSql: 'SELECT COUNT(musikrichtung.mr_id) AS count, "todoKeywords" AS value,' +
                    ' "todoKeywords" AS label, "true" AS id' +
                    ' FROM musikrichtung INNER JOIN musikrichtung_keyword ON musikrichtung.mr_id=musikrichtung_keyword.mr_id' +
                    ' INNER JOIN keyword ON musikrichtung_keyword.kw_id=keyword.kw_id ' +
                    'WHERE keyword.kw_name IN ("KW_TODOKEYWORDS")',
                filterField: 'keyword.kw_name',
                action: AdapterFilterActions.IN
            },
            'unrated': {
                selectSql: 'SELECT COUNT(musikrichtung.mr_id) AS count, "unrated" AS value,' +
                    ' "unrated" AS label, "true" AS id' +
                    ' FROM musikrichtung WHERE mr_rate IS NULL OR mr_rate in (0)',
                filterField: 'musikrichtung.mr_rate',
                action: AdapterFilterActions.IN
            },
            'unRatedChildren': {
                selectSql: 'SELECT COUNT(musikrichtung.mr_id) AS count, "unRatedChildren" AS value,' +
                    ' "unRatedChildren" AS label, "true" AS id' +
                    ' FROM musikrichtung INNER JOIN (SELECT DISTINCT mr_id AS id FROM musikrichtung WHERE mr_id IN' +
                    '      (SELECT DISTINCT mr_ID FROM titles WHERE t_rate = 0 OR t_rate IS NULL)) unRatedChildren' +
                    '   ON musikrichtung.mr_id=unRatedChildren.id',
                cache: {
                    useCache: false
                }
            },
            // others
            'artist_ss': {
                noFacet: true
            },
            'genre_ss': {
                selectSql: 'SELECT COUNT(album.a_id) AS count, mr_name AS value,' +
                    ' mr_name AS label, musikrichtung.mr_id AS id' +
                    ' FROM musikrichtung LEFT JOIN album ON musikrichtung.mr_id = album.mr_id ' +
                    ' GROUP BY value, label, id' +
                    ' ORDER BY label',
                filterField: 'musikrichtung.mr_name',
                action: AdapterFilterActions.IN
            },
            'blocked_is': {
                noFacet: true
            },
            'initial_s': {
                noFacet: true
            },
            'keywords_txt': {
                noFacet: true
            },
            'month_is': {
                noFacet: true
            },
            'playlists_txt': {
                selectSql: 'SELECT COUNT(playlist.p_id) AS count, ' +
                    ' p_name AS value ' +
                    'FROM' +
                    ' playlist LEFT JOIN titles_playlist ON playlist.p_id=titles_playlist.p_id ' +
                    ' LEFT JOIN titles ON titles.t_id=titles_playlist.t_id' +
                    ' LEFT JOIN musikrichtung ON titles.mr_id=musikrichtung.mr_id' +
                    ' GROUP BY value' +
                    ' ORDER BY value',
                filterField: 'p_name',
                action: AdapterFilterActions.IN
            },
            'rate_pers_gesamt_is': {
                selectField: 'musikrichtung.mr_rate',
                orderBy: 'value asc'
            },
            'subtype_ss': {
                noFacet: true
            },
            'type_ss': {
                constValues: ['genre', 'artist', 'album', 'audio', 'playlist'],
                filterField: '"genre"',
                selectLimit: 1
            },
            'week_is': {
                noFacet: true
            },
            'year_is': {
                noFacet: true
            }
        },
        sortMapping: {
            'countAlbums': '(SELECT COUNT(DISTINCT a_sort.a_id) FROM album a_sort WHERE a_sort.mr_id = musikrichtung.mr_id) ASC',
            'countAlbumsDesc': '(SELECT COUNT(DISTINCT a_sort.a_id) FROM album a_sort WHERE a_sort.mr_id = musikrichtung.mr_id) DESC',
            'countArtists': '(SELECT COUNT(DISTINCT b_sort.b_id) FROM bands b_sort WHERE b_sort.mr_id = musikrichtung.mr_id) ASC',
            'countArtistsDesc': '(SELECT COUNT(DISTINCT b_sort.b_id) FROM bands b_sort WHERE b_sort.mr_id = musikrichtung.mr_id) DESC',
            'countAudios': '(SELECT COUNT(DISTINCT t_sort.t_id) FROM titles t_sort WHERE t_sort.mr_id = musikrichtung.mr_id) ASC',
            'countAudiosDesc': '(SELECT COUNT(DISTINCT t_sort.t_id) FROM titles t_sort WHERE t_sort.mr_id = musikrichtung.mr_id) DESC',
            'countFavAudios': '(SELECT COUNT(DISTINCT t_sort.t_id) FROM titles t_sort WHERE t_rate > 0 AND t_sort.mr_id = musikrichtung.mr_id) ASC',
            'countFavAudiosDesc': '(SELECT COUNT(DISTINCT t_sort.t_id) FROM titles t_sort WHERE t_rate > 0 AND t_sort.mr_id = musikrichtung.mr_id) DESC',
            'forExport': 'musikrichtung.mr_id ASC',
            'name': 'mr_name ASC',
            'ratePers': 'musikrichtung.mr_rate DESC',
            'relevance': 'musikrichtung.mr_id DESC'
        },
        filterMapping: {
            // dashboard
            doublettes: '"doublettes"',
            conflictingRates: '"666dummy999"',
            noFavoriteChildren: '"noFavoriteChildren"',
            noMainFavoriteChildren: '"noMainFavoriteChildren"',
            noGenre: '"666dummy999"',
            noSubType: '"666dummy999"',
            todoKeywords: 'keyword.kw_name',
            unrated: 'musikrichtung.mr_rate',
            unRatedChildren: '"unRatedChildren"',
            // others
            id: 'musikrichtung.mr_id',
            album_id_i: '"dummy"',
            album_id_is: '"dummy"',
            audio_id_i: '"dummy"',
            audio_id_is: '"dummy"',
            artist_id_i: '"dummy"',
            artist_id_is: '"dummy"',
            genre_id_i: 'musikrichtung.mr_id',
            genre_id_is: 'musikrichtung.mr_id',
            playlist_id_i: '"dummy"',
            playlist_id_is: '"dummy"',
            name_s: 'mr_name',
            name_lower_hex: 'LOWER(HEX(' + MediaDocSqlUtils.generateLower('mr_name') + '))',
            html: 'mr_name'
        },
        writeMapping: {
            'musikrichtung.mr_name': ':name_s:',
            'musikrichtung.mr_rate': ':rate_pers_gesamt_i:',
            'musikrichtung.mr_key': ':key_s:'
        },
        fieldMapping: {
            id: 'id',
            genre_id_i: 'mr_id',
            genre_id_is: 'mr_id',
            blocked_i: 'mr_gesperrt',
            desc_txt: 'mr_beschreibung',
            genre_s: 'mr_name',
            name_s: 'name',
            rate_pers_gesamt_i: 'mr_rate',
            key_s: 'key',
            type_s: 'type',
            subtype_s: 'subtype'
        }
    };

    public static readonly rateModelConfigType: RateModelConfigTableType = {
        fieldId: 'mr_id',
        table: 'musikrichtung',
        rateFields: {
            'gesamt': 'mr_rate'
        },
        fieldSum: undefined
    };

    public static readonly actionTagAssignConfig: ActionTagAssignTableConfigType = {
        table: 'musikrichtung',
        idField: 'mr_id',
        references: {
        }
    };

    public static readonly actionTagBlockConfig: ActionTagBlockTableConfigType = {
        table: 'musikrichtung', idField: 'mr_id', blockField: 'mr_blocked'
    };

    public static readonly actionTagReplaceConfig: ActionTagReplaceTableConfigType = {
        table: 'musikrichtung',
        fieldId: 'mr_id',
        referenced: [
            { table: 'album', fieldReference: 'mr_id' },
            { table: 'bands', fieldReference: 'mr_id' },
            { table: 'titles', fieldReference: 'mr_id' }
        ],
        joins: [
            { table: 'musikrichtung_keyword', fieldReference: 'mr_id' }
        ]
    };
}

