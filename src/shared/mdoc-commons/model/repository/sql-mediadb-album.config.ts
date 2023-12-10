import {AdapterFilterActions} from '@dps/mycms-commons/dist/search-commons/services/mapper.utils';
import {TableConfig} from '@dps/mycms-commons/dist/search-commons/services/sql-query.builder';
import {KeywordModelConfigJoinType} from '@dps/mycms-commons/dist/action-commons/actions/common-sql-keyword.adapter';
import {RateModelConfigTableType} from '@dps/mycms-commons/dist/action-commons/actions/common-sql-rate.adapter';
import {ActionTagAssignTableConfigType} from '@dps/mycms-commons/dist/action-commons/actiontags/common-sql-actiontag-assign.adapter';
import {ActionTagBlockTableConfigType} from '@dps/mycms-commons/dist/action-commons/actiontags/common-sql-actiontag-block.adapter';
import {ActionTagReplaceTableConfigType} from '@dps/mycms-commons/dist/action-commons/actiontags/common-sql-actiontag-replace.adapter';
import {JoinModelConfigTableType} from '@dps/mycms-commons/dist/action-commons/actions/common-sql-join.adapter';
import {ActionTagAssignJoinTableConfigType} from '@dps/mycms-commons/dist/action-commons/actiontags/common-sql-actiontag-assignjoin.adapter';
import {MediaDocSqlUtils} from '../../services/mdoc-sql.utils';

export class SqlMediaDbAlbumConfig {
    public static readonly tableConfig: TableConfig = {
            key: 'album',
            tableName: 'album',
            selectFrom: 'album LEFT JOIN bands ON bands.b_id = album.b_id ' +
                'LEFT JOIN musikrichtung ON musikrichtung.mr_id = album.mr_id ',
            optionalGroupBy: [
                {
                    from: 'LEFT JOIN titles ON titles.a_id=album.a_id ' +
                        'LEFT JOIN titles_playlist ON titles.t_id=titles_playlist.t_id ' +
                        'LEFT JOIN playlist ON titles_playlist.p_id=playlist.p_id',
                    triggerParams: ['id', 'playlists_txt'],
                    groupByFields: ['GROUP_CONCAT(DISTINCT playlist.p_name ORDER BY playlist.p_name SEPARATOR ", ") AS a_playlists']
                },
                {
                    from: 'LEFT JOIN album_keyword ON album.a_id=album_keyword.a_id ' +
                        'LEFT JOIN keyword ON album_keyword.kw_id=keyword.kw_id ',
                    triggerParams: ['id', 'keywords_txt', 'todoKeywords'],
                    groupByFields: ['GROUP_CONCAT(DISTINCT keyword.kw_name ORDER BY keyword.kw_name SEPARATOR ", ") AS a_keywords']
                },
                {
                    from: 'LEFT JOIN album_bands ON album.a_id=album_bands.a_id ' +
                        'LEFT JOIN bands ab ON album_bands.b_id=ab.b_id OR album.b_id=ab.b_id ',
                    triggerParams: ['artist_id_i', 'artist_id_is'],
                    groupByFields: ['GROUP_CONCAT(DISTINCT ab.b_id ORDER BY ab.b_id SEPARATOR ", ") AS a_ab_ids']
                },
                {
                    from: 'INNER JOIN' +
                        '(' +
                        '    SELECT a_id AS id FROM album' +
                        '      INNER JOIN bands b2 on album.b_id = b2.b_id ' +
                        '      INNER JOIN (SELECT DISTINCT CONCAT(a_key, b_key) as key FROM album' +
                        '           INNER JOIN bands b on album.b_id = b.b_id GROUP BY CONCAT(a_key, b_key) HAVING COUNT(*) > 1) doublettes' +
                        '                ON CONCAT(a_key, b_key) = doublettes.key ' +
                        '  UNION ' +
                        '    SELECT a_id AS id FROM album ' +
                        '      INNER JOIN (SELECT DISTINCT CONCAT(a_key, COALESCE(a_dir, "")) key' +
                        '           FROM album WHERE album.a_dir IS NOT NULL GROUP BY CONCAT(a_key, COALESCE(a_dir, "")) HAVING COUNT(*) > 1) doublettes' +
                        '           ON CONCAT(a_key, COALESCE(a_dir, "")) = doublettes.key WHERE a_dir IS NOT NULL' +
                        ') doublettes2 ON album.a_id = doublettes2.id',
                    triggerParams: ['doublettes'],
                    groupByFields: []
                },
                {
                    from: 'INNER JOIN' +
                        '      (SELECT DISTINCT a_id AS id FROM album' +
                        '       WHERE a_id IN (SELECT DISTINCT a_ID FROM titles WHERE t_rate = 0 OR t_rate IS NULL)' +
                        '       AND a_id NOT IN (SELECT DISTINCT a_ID FROM titles WHERE t_rate <> 0 AND t_rate IS NOT NULL)' +
                        '      ) noFavoriteChildren' +
                        '  ON album.a_id=noFavoriteChildren.id',
                    triggerParams: ['noFavoriteChildren'],
                    groupByFields: []
                },
                {
                    from: 'INNER JOIN (SELECT DISTINCT a_id AS id FROM album WHERE a_id IN' +
                        '      (SELECT DISTINCT a_ID FROM titles WHERE t_rate = 0 OR t_rate IS NULL)) unRatedChildren' +
                        '   ON album.a_id=unRatedChildren.id',
                    triggerParams: ['unRatedChildren'],
                    groupByFields: []
                },
                {
                    from: 'INNER JOIN (SELECT DISTINCT a_id AS id FROM album WHERE a_id NOT IN ' +
                        '     (SELECT DISTINCT a_ID FROM titles INNER JOIN titles_playlist ON titles.t_id=titles_playlist.t_ID WHERE p_id IN ' +
                        '          (SELECT DISTINCT p_id FROM playlist WHERE p_name like "%Album_Favorites%"))' +
                        '      AND a_id IN (SELECT DISTINCT a_ID FROM titles WHERE t_rate = 0 OR t_rate IS NULL)) noMainFavoriteChildren' +
                        ' ON album.a_id=noMainFavoriteChildren.id',
                    triggerParams: ['noMainFavoriteChildren'],
                    groupByFields: []
                }
            ],
            loadDetailData: [
                {
                    profile: 'keywords',
                    sql: 'select GROUP_CONCAT(DISTINCT keyword.kw_name ORDER BY keyword.kw_name SEPARATOR ", ") AS keywords ' +
                        'FROM album INNER JOIN album_keyword ON album.a_id=album_keyword.a_id' +
                        ' INNER JOIN keyword on album_keyword.kw_id=keyword.kw_id ' +
                        'WHERE album.a_id in (:id)',
                    parameterNames: ['id']
                },
                {
                    profile: 'linkedartists',
                    sql: '(SELECT CONCAT("type=addartist:::name=", COALESCE(b_name, "null"), ":::refId=", CAST(bands.b_id AS CHAR))' +
                        '  AS linkedartists' +
                        '  FROM bands INNER JOIN album_bands ON album_bands.b_id = bands.b_id WHERE album_bands.a_id IN (:id)' +
                        '  ORDER BY b_name) ',
                    parameterNames: ['id']
                },
                {
                    profile: 'extended_object_properties',
                    sql: 'SELECT CONCAT("category=ENTITYCOUNT:::name=AUDIO_COUNT:::value=", CAST(COUNT(DISTINCT titles.t_id) AS CHAR)) AS extended_object_properties' +
                        '       FROM album' +
                        '       INNER JOIN titles ON titles.a_id=album.a_id' +
                        '       WHERE album.a_id IN (:id)' +
                        '   UNION ' +
                        'SELECT CONCAT("category=ENTITYCOUNT:::name=AUDIO_TOP_COUNT:::value=", CAST(COUNT(DISTINCT titles.t_id) AS CHAR)) AS extended_object_properties' +
                        '       FROM album' +
                        '       INNER JOIN titles ON titles.a_id=album.a_id' +
                        '       WHERE album.a_id IN (:id) AND t_rate >= 6' +
                        '   UNION ' +
                        'SELECT CONCAT("category=ENTITYCOUNT:::name=AUDIO_FAV_COUNT:::value=", CAST(COUNT(DISTINCT titles.t_id) AS CHAR)) AS extended_object_properties' +
                        '       FROM album' +
                        '       INNER JOIN titles ON titles.a_id=album.a_id' +
                        '       WHERE album.a_id IN (:id) AND t_rate > 0',
                    parameterNames: ['id']
                },
                {
                    profile: 'navigation_objects',
                    sql: '(SELECT CONCAT("navid=ALBUM_", a_id, ":::name=", COALESCE(a_name, "null"), ":::navtype=", "PREDECESSOR")' +
                        '  AS navigation_objects' +
                        '  FROM album WHERE a_name < (SELECT a_name FROM album WHERE a_id IN (:id))' +
                        '  ORDER BY a_name DESC, a_id DESC LIMIT 1) ' +
                        'UNION ' +
                        ' (SELECT CONCAT("navid=ALBUM_", a_id, ":::name=", COALESCE(a_name, "null"), ":::navtype=", "SUCCESSOR")' +
                        '  AS navigation_objects' +
                        '  FROM album WHERE a_name > (SELECT a_name FROM album WHERE a_id IN (:id))' +
                        '   ORDER BY a_name, a_id LIMIT 1)',
                    parameterNames: ['id'],
                    modes: ['details']
                }
            ],
            groupbBySelectFieldListIgnore: ['a_keywords', 'a_playlists'],
            selectFieldList: [
                '"ALBUM" AS type',
                'CONCAT("ALBUM", "_", album.a_id) AS id',
                'album.a_id',
                'album.b_id',
                'album.mr_id',
                'bands.b_name',
                'bands.b_key',
                'mr_name',
                'mr_key',
                'a_name',
                'a_name AS name',
                'a_key',
                'a_key AS key',
                'a_key',
                'a_rate',
                'CONCAT(mr_name, " - ", bands.b_name, " - ", a_name) AS html',
                'CONCAT(album.a_dir, "/", album.a_coverfile) AS i_fav_url_txt'
            ],
            facetConfigs: {
                // dashboard
                'doublettes': {
                    selectSql: 'SELECT COUNT(album.a_id) AS count, "doublettes" AS value,' +
                        ' "doublettes" AS label, "true" AS id' +
                        ' FROM album INNER JOIN' +
                        '(' +
                        '    SELECT a_id AS id FROM album' +
                        '      INNER JOIN bands b2 on album.b_id = b2.b_id ' +
                        '      INNER JOIN (SELECT DISTINCT CONCAT(a_key, b_key) as key FROM album' +
                        '           INNER JOIN bands b on album.b_id = b.b_id GROUP BY CONCAT(a_key, b_key) HAVING COUNT(*) > 1) doublettes' +
                        '                ON CONCAT(a_key, b_key) = doublettes.key ' +
                        '  UNION ' +
                        '    SELECT a_id AS id FROM album ' +
                        '      INNER JOIN (SELECT DISTINCT CONCAT(a_key, COALESCE(a_dir, "")) key' +
                        '            FROM album WHERE album.a_dir IS NOT NULL GROUP BY CONCAT(a_key, COALESCE(a_dir, "")) HAVING COUNT(*) > 1) doublettes' +
                        '           ON CONCAT(a_key, COALESCE(a_dir, "")) = doublettes.key WHERE a_dir IS NOT NULL' +
                        ') doublettes2 ON album.a_id = doublettes2.id',
                    cache: {
                        useCache: false
                    }
                },
                'conflictingRates': {
                    constValues: ['conflictingRates'],
                    filterField: '"666dummy999"'
                },
                'noFavoriteChildren': {
                    selectSql: 'SELECT COUNT(album.a_id) AS count, "noFavoriteChildren" AS value,' +
                        ' "noFavoriteChildren" AS label, "true" AS id' +
                        ' FROM album INNER JOIN' +
                        '      (SELECT DISTINCT a_id AS id FROM album' +
                        '       WHERE a_id IN (SELECT DISTINCT a_ID FROM titles WHERE t_rate = 0 OR t_rate IS NULL)' +
                        '       AND a_id NOT IN (SELECT DISTINCT a_ID FROM titles WHERE t_rate <> 0 AND t_rate IS NOT NULL)' +
                        '      ) noFavoriteChildren' +
                        '  ON album.a_id=noFavoriteChildren.id',
                    cache: {
                        useCache: false
                    }
                },
                'noGenre': {
                    selectSql: 'SELECT COUNT(album.a_id) AS count, "noGenre" AS value,' +
                        ' "noGenre" AS label, "true" AS id' +
                        ' FROM album WHERE mr_id IS NULL OR mr_id IN (0,1 )',
                    filterField: 'album.mr_id',
                    action: AdapterFilterActions.IN
                },
                'noMainFavoriteChildren': {
                    selectSql: 'SELECT COUNT(album.a_id) AS count, "noMainFavoriteChildren" AS value,' +
                        ' "noMainFavoriteChildren" AS label, "true" AS id' +
                        ' FROM album INNER JOIN (SELECT DISTINCT a_id AS id FROM album WHERE a_id NOT IN ' +
                        '     (SELECT DISTINCT a_ID FROM titles INNER JOIN titles_playlist ON titles.t_id=titles_playlist.t_id WHERE p_id IN ' +
                        '          (SELECT DISTINCT p_id FROM playlist WHERE p_name like "%Album_Favorites%"))' +
                        '      AND a_id IN (SELECT DISTINCT a_ID FROM titles WHERE t_rate = 0 OR t_rate IS NULL)) noMainFavoriteChildren' +
                        ' ON album.a_id=noMainFavoriteChildren.id',
                    cache: {
                        useCache: false
                    }
                },
                'noSubType': {
                    constValues: ['noSubType'],
                    filterField: '"666dummy999"'
                },
                'todoKeywords': {
                    selectSql: 'SELECT COUNT(album.a_id) AS count, "todoKeywords" AS value,' +
                        ' "todoKeywords" AS label, "true" AS id' +
                        ' FROM album INNER JOIN album_keyword ON album.a_id=album_keyword.a_id' +
                        ' INNER JOIN keyword ON album_keyword.kw_id=keyword.kw_id ' +
                        'WHERE keyword.kw_name IN ("KW_TODOKEYWORDS")',
                    filterField: 'keyword.kw_name',
                    action: AdapterFilterActions.IN
                },
                'unrated': {
                    selectSql: 'SELECT COUNT(album.a_id) AS count, "unrated" AS value,' +
                        ' "unrated" AS label, "true" AS id' +
                        ' FROM album WHERE a_rate IS NULL OR a_rate in (0)',
                    filterField: 'album.a_rate',
                    action: AdapterFilterActions.IN
                },
                'unRatedChildren': {
                    selectSql: 'SELECT COUNT(album.a_id) AS count, "unRatedChildren" AS value,' +
                        ' "unRatedChildren" AS label, "true" AS id' +
                        ' FROM album INNER JOIN (SELECT DISTINCT a_id AS id FROM album WHERE a_id IN' +
                        '      (SELECT DISTINCT a_ID FROM titles WHERE t_rate = 0 OR t_rate IS NULL)) unRatedChildren' +
                        '   ON album.a_id=unRatedChildren.id',
                    cache: {
                        useCache: false
                    }
                },
                // others
                'artist_id_is': {
                    selectSql: 'SELECT COUNT(album.a_id) AS count, bands.b_id AS value,' +
                        ' b_name AS label, bands.b_id AS id' +
                        ' FROM bands LEFT JOIN album ON bands.b_id = album.b_id ' +
                        ' GROUP BY value, label, id' +
                        ' ORDER BY label',
                    filterField: 'ab.b_id',
                    action: AdapterFilterActions.IN
                },
                'artist_ss': {
                    selectSql: 'SELECT COUNT(album.a_id) AS count, b_name AS value,' +
                        ' b_name AS label, bands.b_id AS id' +
                        ' FROM bands LEFT JOIN album ON bands.b_id = album.b_id ' +
                        ' GROUP BY value, label, id' +
                        ' ORDER BY label',
                    filterField: 'bands.b_name',
                    action: AdapterFilterActions.IN
                },
                'genre_id_is': {
                    selectSql: 'SELECT COUNT(album.a_id) AS count, musikrichtung.mr_id AS value,' +
                        ' mr_name AS label, musikrichtung.mr_id AS id' +
                        ' FROM musikrichtung LEFT JOIN album ON musikrichtung.mr_id = album.mr_id ' +
                        ' GROUP BY value, label, id' +
                        ' ORDER BY label',
                    filterField: 'album.mr_id',
                    action: AdapterFilterActions.IN
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
                    selectSql: 'SELECT COUNT(*) as count, ' +
                        ' SUBSTR(UPPER(a_name), 1, 1) as value ' +
                        'FROM album ' +
                        'WHERE LENGTH(a_name) > 0 ' +
                        'GROUP BY SUBSTR(UPPER(a_name), 1, 1)' +
                        'ORDER BY value',
                },
                'keywords_txt': {
                    selectSql: 'SELECT COUNT(keyword.kw_id) AS count, ' +
                        ' kw_name AS value ' +
                        'FROM' +
                        ' keyword LEFT JOIN album_keyword ON keyword.kw_id=album_keyword.kw_id' +
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
                        ' LEFT JOIN album ON titles.a_id=album.a_id' +
                        ' GROUP BY value' +
                        ' ORDER BY value',
                    filterField: 'playlist.p_name',
                    action: AdapterFilterActions.IN
                },
                'rate_pers_gesamt_is': {
                    selectField: 'album.a_rate',
                    orderBy: 'value asc'
                },
                'subtype_ss': {
                    noFacet: true
                },
                'type_ss': {
                    constValues: ['audio', 'genre', 'artist', 'album', 'playlist'],
                    filterField: '"album"',
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
                'countAudios': '(SELECT COUNT(DISTINCT t_sort.t_id) FROM titles t_sort WHERE t_sort.a_id = album.a_id) ASC',
                'countAudiosDesc': '(SELECT COUNT(DISTINCT t_sort.t_id) FROM titles t_sort WHERE t_sort.a_id = album.a_id) DESC',
                'countFavAudios': '(SELECT COUNT(DISTINCT t_sort.t_id) FROM titles t_sort WHERE t_rate > 0 AND t_sort.a_id = album.a_id) ASC',
                'countFavAudiosDesc': '(SELECT COUNT(DISTINCT t_sort.t_id) FROM titles t_sort WHERE t_rate > 0 AND t_sort.a_id = album.a_id) DESC',
                'forExport': 'album.a_id ASC',
                'name': 'album.a_key ASC, bands.b_key ASC',
                'fullName': 'bands.b_key ASC, album.a_key ASC',
                'ratePers': 'album.a_rate DESC',
                'relevance': 'album.a_id DESC'
            },
            filterMapping: {
                // dashboard
                doublettes: '"doublettes"',
                conflictingRates: '"666dummy999"',
                noFavoriteChildren: '"noFavoriteChildren"',
                noMainFavoriteChildren: '"noMainFavoriteChildren"',
                noGenre: 'album.mr_id',
                noSubType: '"666dummy999"',
                todoKeywords: 'keyword.kw_name',
                unrated: 'album.a_rate',
                unRatedChildren: '"unRatedChildren"',
                // others
                id: 'album.a_id',
                album_id_i: 'album.a_id',
                album_id_is: 'album.a_id',
                artist_id_i: 'ab.b_id',
                artist_id_is: 'ab.b_id',
                audio_id_i: '"dummy"',
                audio_id_is: '"dummy"',
                genre_id_i: 'album.mr_id',
                genre_id_is: 'album.mr_id',
                playlist_id_i: '"dummy"',
                playlist_id_is: '"dummy"',
                name_s: 'album.a_name',
                name_lower_hex: 'LOWER(HEX(' + MediaDocSqlUtils.generateLower(' CONCAT(bands.b_name, " ", album.a_name) ') + '))',
                html: 'CONCAT(bands.b_name, " ", album.a_name)',
                initial_s: 'SUBSTR(UPPER(album.a_name), 1, 1)'
            },
            writeMapping: {
                'album.mr_id': ':genre_id_i:',
                'album.b_id': ':artist_id_i:',
                // 'album.a_gesperrt': ':blocked_i:',
                'album.a_desc': ':desc_txt:',
                'album.a_name': ':name_s:',
                'album.a_rate': ':rate_pers_gesamt_i:',
                'album.a_key': ':key_s:'
            },
            fieldMapping: {
                id: 'id',
                album_id_i: 'a_id',
                album_id_is: 'a_id',
                artist_id_i: 'b_id',
                artist_id_is: 'b_id',
                genre_id_i: 'mr_id',
                genre_id_is: 'mr_id',
                album_s: 'a_name',
                artist_s: 'b_name',
                blocked_i: 'a_gesperrt',
                dateshow_dt: 'a_dateshow',
                desc_txt: 'a_desc',
                genre_s: 'mr_name',
                playlists_txt: 'a_playlists',
                name_s: 'name',
                rate_pers_gesamt_i: 'a_rate',
                key_s: 'key',
                type_s: 'type',
                subtype_s: 'subtype',
                i_fav_url_txt: 'i_fav_url_txt'
            }
        };

    public static readonly keywordModelConfigType: KeywordModelConfigJoinType = {
        table: 'album', joinTable: 'album_keyword', fieldReference: 'a_id'
    };

    public static readonly joinModelConfigTypeLinkedArtists: JoinModelConfigTableType = {
        baseTableIdField: 'a_id',
        joinTable: 'album_bands',
        joinFieldMappings: {
            'b_id': 'refId'
        }
    };

    public static readonly rateModelConfigType: RateModelConfigTableType = {
        fieldId: 'a_id',
        table: 'album',
        rateFields: {
            'gesamt': 'a_rate'
        },
        fieldSum: undefined
    };

    public static readonly actionTagAssignConfig: ActionTagAssignTableConfigType = {
        table: 'album',
        idField: 'a_id',
        references: {
            'genre_id_is': {
                table: 'musikrichtung', idField: 'mr_id', referenceField: 'mr_id'
            },
            'artist_id_is': {
                table: 'bands', idField: 'b_id', referenceField: 'b_id'
            }
        }
    };

    public static readonly actionTagAssignJoinConfig: ActionTagAssignJoinTableConfigType = {
        table: 'album',
        idField: 'a_id',
        references: {
            'artist_id_is': {
                joinedTable: 'bands',
                joinedIdField: 'b_id',
                joinTable: 'album_bands',
                joinBaseIdField: 'a_id',
                joinReferenceField: 'b_id'
            }
        }
    };

    public static readonly actionTagBlockConfig: ActionTagBlockTableConfigType = {
        table: 'album', idField: 'a_id', blockField: 'a_blocked'
    };

    public static readonly actionTagReplaceConfig: ActionTagReplaceTableConfigType = {
        table: 'album',
        fieldId: 'a_id',
        referenced: [
            { table: 'album_bands', fieldReference: 'a_id' },
            { table: 'titles', fieldReference: 'a_id' }
        ],
        joins: [
            { table: 'album_keyword', fieldReference: 'a_id' }
        ]
    };
}

