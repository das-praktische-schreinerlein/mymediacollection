import {TableConfig} from '@dps/mycms-commons/dist/search-commons/services/sql-query.builder';
import {ActionTagReplaceTableConfigType} from '@dps/mycms-commons/dist/action-commons/actiontags/common-sql-actiontag-replace.adapter';
import {AdapterFilterActions} from '@dps/mycms-commons/dist/search-commons/services/mapper.utils';
import {MediaDocSqlUtils} from '../../services/mdoc-sql.utils';

export class SqlMediaDbPlaylistConfig {
    public static readonly tableConfig: TableConfig = {
        key: 'playlist',
        tableName: 'playlist',
        selectFrom: 'playlist',
        optionalGroupBy: [
            {
                from: 'LEFT JOIN titles_playlist tip ON playlist.p_id = tip.p_id ' +
                    'LEFT JOIN titles ptitles ON tip.t_id = ptitles.t_id',
                triggerParams: ['audio_id_i', 'audio_id_is'],
                groupByFields: []
            },
            {
                from: 'INNER JOIN (SELECT p_id AS id FROM playlist WHERE ' + MediaDocSqlUtils.generateDoubletteNameSql('p_name') +
                    '              IN (SELECT DISTINCT ' + MediaDocSqlUtils.generateDoubletteNameSql('p_name') + ' AS name' +
                    '                  FROM playlist GROUP BY name HAVING COUNT(*) > 1)' +
                    '             ) doublettes' +
                    '             ON playlist.p_id=doublettes.id',
                triggerParams: ['doublettes'],
                groupByFields: []
            }
        ],
        groupbBySelectFieldList: true,
        groupbBySelectFieldListIgnore: ['p_keywords'],
        loadDetailData: [
            {
                profile: 'extended_object_properties',
                sql: 'SELECT CONCAT("category=ENTITYCOUNT:::name=AUDIO_COUNT:::value=", CAST(COUNT(DISTINCT titles_playlist.t_id) AS CHAR)) AS extended_object_properties' +
                    '      FROM titles_playlist' +
                    '      WHERE titles_playlist.p_id IN (:id)',
                parameterNames: ['id']
            },
            {
                profile: 'navigation_objects',
                sql: '(SELECT CONCAT("navid=PLAYLIST_", p_id, ":::name=", COALESCE(p_name, "null"), ":::navtype=", "PREDECESSOR")' +
                    '  AS navigation_objects' +
                    '  FROM playlist WHERE p_id < (SELECT p_id FROM playlist WHERE p_id IN (:id))' +
                    '  ORDER BY p_id DESC, p_id DESC LIMIT 1) ' +
                    'UNION ' +
                    ' (SELECT CONCAT("navid=PLAYLIST_", p_id, ":::name=", COALESCE(p_name, "null"), ":::navtype=", "SUCCESSOR")' +
                    '  AS navigation_objects' +
                    '  FROM playlist WHERE p_id > (SELECT p_id FROM playlist WHERE p_id IN (:id))' +
                    '   ORDER BY p_id, p_id LIMIT 1)',
                parameterNames: ['id'],
                modes: ['details']
            }
        ],
        selectFieldList: [
            '"PLAYLIST" AS type',
            'CONCAT("PLAYLIST", "_", playlist.p_id) AS id',
            'playlist.p_id',
            'playlist.p_name',
            'CONCAT(p_name, " ", COALESCE(p_meta_desc,"")) AS html',
            'p_meta_desc',
            'p_meta_desc AS p_meta_desc_md',
            'p_meta_desc AS p_meta_desc_html'],
        facetConfigs: {
            // dashboard
            'doublettes': {
                selectSql: 'SELECT COUNT(playlist.p_id) AS count, "doublettes" AS value,' +
                    ' "doublettes" AS label, "true" AS id' +
                    ' FROM playlist INNER JOIN (SELECT p_id AS id FROM playlist WHERE ' + MediaDocSqlUtils.generateDoubletteNameSql('p_name') +
                    '              IN (SELECT DISTINCT ' + MediaDocSqlUtils.generateDoubletteNameSql('p_name') + ' AS name' +
                    '                  FROM playlist GROUP BY name HAVING COUNT(*) > 1)' +
                    '             ) doublettes' +
                    '             ON playlist.p_id=doublettes.id',
                cache: {
                    useCache: false
                }
            },
            'conflictingRates': {
                constValues: ['conflictingRates'],
                filterField: '"666dummy999"'
            },
            'noFavoriteChildren': {
                constValues: ['noFavoriteChildren'],
                filterField: '"666dummy999"'
            },
            'noGenre': {
                constValues: ['noGenre'],
                filterField: '"666dummy999"'
            },
            'noMainFavoriteChildren': {
                constValues: ['noMainFavoriteChildren'],
                filterField: '"666dummy999"'
            },
            'noRoute': {
                constValues: ['noRoute'],
                filterField: '"666dummy999"'
            },
            'noSubType': {
                constValues: ['noSubType'],
                filterField: '"666dummy999"'
            },
            'todoKeywords': {
                constValues: ['todoKeywords'],
                filterField: '"666dummy999"'
            },
            'unrated': {
                constValues: ['unrated'],
                filterField: '"666dummy999"'
            },
            'unRatedChildren': {
                constValues: ['unRatedChildren'],
                filterField: '"666dummy999"'
            },
            // common
            'id_notin_is': {
                filterField: 'CONCAT("PLAYLIST", "_", playlist.p_id)',
                action: AdapterFilterActions.NOTIN
            },
            'artist_ss': {
                noFacet: true
            },
            'genre_id_is': {
                noFacet: true
            },
            'genre_ss': {
                noFacet: true
            },
            'initial_s': {
                selectSql: 'SELECT COUNT(*) as count, ' +
                    ' SUBSTR(UPPER(p_name), 1, 1) as value ' +
                    'FROM playlist ' +
                    'WHERE LENGTH(p_name) > 0 ' +
                    'GROUP BY SUBSTR(UPPER(p_name), 1, 1)' +
                    'ORDER BY value',
            },
            'blocked_is': {
                noFacet: true
            },
            'keywords_txt': {
                constValues: ['keywords_txt'],
                filterField: '"666dummy999"'
            },
            'month_is': {
                noFacet: true
            },
            'playlists_txt': {
                selectSql: 'SELECT COUNT(playlist.p_id) AS count, ' +
                    ' p_name AS value ' +
                    'FROM' +
                    ' playlist' +
                    ' GROUP BY value' +
                    ' ORDER BY value',
                filterField: 'playlist.p_name',
                action: AdapterFilterActions.IN
            },
            'rate_pers_gesamt_is': {
                noFacet: true
            },
            'subtype_ss': {
                constValues: ['subtype_ss'],
                filterField: '"666dummy999"'
            },
            'type_ss': {
                constValues: ['playlist', 'audio', 'genre', 'artist', 'album'],
                filterField: '"playlist"',
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
            'countAudios': '(SELECT COUNT(DISTINCT p_sort.t_id) FROM titles_playlist p_sort WHERE p_sort.p_id = playlist.p_id) ASC, p_name ASC',
            'countAudiosDesc': '(SELECT COUNT(DISTINCT p_sort.t_id) FROM titles_playlist p_sort WHERE p_sort.p_id = playlist.p_id) DESC, p_name ASC',
            'forExport': 'playlist.p_id ASC, p_name ASC',
            'relevance': 'playlist.p_id DESC, p_name ASC'
        },
        filterMapping: {
            // dashboard
            doublettes: '"doublettes"',
            conflictingRates: '"666dummy999"',
            noFavoriteChildren: '"666dummy999"',
            noMainFavoriteChildren: '"666dummy999"',
            noGenre: '"666dummy999"',
            noSubType: '"666dummy999"',
            todoKeywords: '"666dummy999"',
            unrated: '"666dummy999"',
            unRatedChildren: '"666dummy999"',
            // common
            id: 'playlist.p_id',
            album_id_i: '"dummy"',
            album_id_is: '"dummy"',
            artist_id_i: '"dummy"',
            artist_id_is: '"dummy"',
            audio_id_is: 'ptitles.t_id',
            audio_id_i: 'ptitles.t_id',
            genre_id_i: '"dummy"',
            genre_id_is: '"dummy"',
            name_s: 'playlist.p_name',
            name_lower_hex: 'LOWER(HEX(' + MediaDocSqlUtils.generateLower('playlist.p_name') + '))',
            playlist_id_i: 'playlist.p_id',
            playlist_id_is: 'playlist.p_id',
            html: 'CONCAT(playlist.p_name, " ", COALESCE(p_meta_desc,""))',
            initial_s: 'SUBSTR(UPPER(playlist.p_name), 1, 1)'
        },
        writeMapping: {
            'playlist.p_meta_desc': ':desc_txt:',
            'playlist.p_name': ':name_s:'
        },
        fieldMapping: {
            id: 'id',
            playlist_id_i: 'p_id',
            playlist_id_is: 'p_id',
            desc_txt: 'p_meta_desc',
            desc_md_txt: 'p_meta_desc_md',
            desc_html_txt: 'p_meta_desc_html',
            playlist_name_s: 'p_name',
            playlist_desc_txt: 'p_meta_desc',
            name_s: 'p_name',
            type_s: 'type'
        }
    };

    public static readonly actionTagReplaceConfig: ActionTagReplaceTableConfigType = {
        table: 'playlist',
        fieldId: 'p_id',
        referenced: [],
        joins: [
            { table: 'titles_playlist', fieldReference: 'p_id' }
        ]
    };
}

