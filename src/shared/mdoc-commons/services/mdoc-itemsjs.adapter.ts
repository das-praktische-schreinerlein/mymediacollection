import {MediaDocRecord} from '../model/records/mdoc-record';
import {MediaDocSearchForm} from '../model/forms/mdoc-searchform';
import {MediaDocSearchResult} from '../model/container/mdoc-searchresult';
import {MediaDocAdapterResponseMapper} from './mdoc-adapter-response.mapper';
import {ItemsJsConfig} from '@dps/mycms-commons/dist/search-commons/services/itemsjs-query.builder';
import {GenericItemsJsAdapter} from '@dps/mycms-commons/dist/search-commons/services/generic-itemsjs.adapter';
import {ExtendedItemsJsConfig} from '@dps/mycms-commons/dist/search-commons/services/itemsjs.dataimporter';

export class MediaDocItemsJsAdapter extends GenericItemsJsAdapter<MediaDocRecord, MediaDocSearchForm, MediaDocSearchResult> {
    public static itemsJsConfig: ExtendedItemsJsConfig = {
        skipMediaCheck: true,
        aggregationFields: ['id', 'image_id_i', 'genre_id_i', 'artist_id_i', 'album_id_s',
            'video_id_i', 'info_id_i', 'playlist_id_i'],
        refConfigs: [
            { containerField: 'linkedplaylists_clob', refField: 'refId', idPrefix: 'PLAYLIST_', filterFields: ['playlist_id_i', 'playlist_id_is']}
        ],
        spatialField: undefined,
        spatialSortKey: undefined,
        searchableFields: ['id', 'image_id_i', 'genre_id_i', 'artist_id_i', 'album_id_s',
            'video_id_i', 'info_id_i', 'playlist_id_i',
            'album_s', 'artist_s', 'genre_s',
            'desc_txt', 'desc_md_txt', 'desc_html_txt',
            'keywords_txt', 'name_s', 'type_s',
            'subtype_s', 'a_fav_url_txt', 'i_fav_url_txt', 'v_fav_url_txt',
            'navigation_objects_clob', 'extended_object_properties_clob',
            'linkedplaylists_clob',
            'html'],
        aggregations: {
            'initial_s': {
                filterFunction: function(record) {
                    return record['name_s']
                        ? (record['name_s'] + '').substring(0, 1)
                        : undefined
                },
                conjunction: false,
                sort: 'term',
                order: 'asc',
                hide_zero_doc_count: true,
                size: 1000
            },
            'genre_ss': {
                mapField: 'genre_ss',
                conjunction: false,
                sort: 'term',
                order: 'asc',
                hide_zero_doc_count: true,
                size: 1000
            },
            'artist_ss': {
                mapField: 'artist_s',
                conjunction: false,
                sort: 'term',
                order: 'asc',
                hide_zero_doc_count: true,
                size: 1000
            },
            'album_ss': {
                mapField: 'album_s',
                conjunction: false,
                sort: 'term',
                order: 'asc',
                hide_zero_doc_count: true,
                size: 1000
            },
            'keywords_txt': {
                filterFunction: function(record) {
                    return record['keywords_txt']
                        ? record['keywords_txt'].replace(/,,/g, ',').split(',')
                        : undefined
                },
                conjunction: false,
                sort: 'term',
                order: 'asc',
                hide_zero_doc_count: true,
                size: 1000
            },
            'playlists_txt': {
                filterFunction: function(record) {
                    return record['playlists_txt']
                        ? record['playlists_txt'].replace(/,,/g, ',').split(',')
                        : undefined
                },
                conjunction: false,
                sort: 'term',
                order: 'asc',
                hide_zero_doc_count: true,
                size: 1000
            },
            'rate_pers_gesamt_is': {
                mapField: 'rate_pers_gesamt_i',
                conjunction: false,
                sort: 'term',
                order: 'asc',
                hide_zero_doc_count: true,
                size: 1000
            },
            'subtype_ss': {
                mapField: 'subtype_s',
                conjunction: false,
                sort: 'term',
                order: 'asc',
                hide_zero_doc_count: true,
                size: 1000
            },
            'type_ss': {
                mapField: 'type_s',
                conjunction: false,
                sort: 'term',
                order: 'asc',
                hide_zero_doc_count: false,
                size: 1000
            },
            'id': {
                conjunction: false,
                sort: 'term',
                order: 'asc',
                hide_zero_doc_count: true,
                size: 1000
            },
            'year_is': {
                filterFunction: function(record) {
                    return record['mediameta_recordingdate_dt']
                        ? new Date(record['mediameta_recordingdate_dt']).getFullYear()
                        : undefined
                },
                conjunction: false,
                sort: 'term',
                order: 'asc',
                hide_zero_doc_count: true,
                size: 1000
            },
            'UNDEFINED_FILTER': {
                mapField: 'id',
                field: 'id',
                conjunction: true,
                sort: 'term',
                order: 'asc',
                hide_zero_doc_count: true,
                size: 1000
            }
        },
        sortings: {
            // add sorting for artist, album , genre, duration, rating
            'date': {
                field: ['mediameta_recordingdate_dt', 'rate_pers_gesamt_i'],
                order: ['desc', 'desc']
            },
            'dateAsc': {
                field: ['mediameta_recordingdate_dt', 'rate_pers_gesamt_i'],
                order: ['asc', 'desc']
            },
            'genre': {
                field: ['genre_s', 'artist_s', 'album_s', 'name_s'],
                order: ['asc']
            },
            'album': {
                field: ['album_s', 'genre_s', 'artist_s', 'name_s'],
                order: ['asc']
            },
            'artist': {
                field: ['artist_s', 'genre_s', 'album_s', 'name_s'],
                order: ['asc']
            },
            'name': {
                field: ['name_s', 'genre_s', 'artist_s', 'album_s'],
                order: ['asc']
            },
            'ratePers': {
                field: ['rate_pers_gesamt_i', 'dateshow_dt'],
                order: ['desc', 'desc']
            },
            'relevance': {
                field: ['id'],
                order: ['asc']
            }
        },
        filterMapping: {
            'html': 'html_txt',
        },
        fieldMapping: {
        }
    };

    constructor(config: any, records: any, itemsJsConfig: ExtendedItemsJsConfig) {
        console.debug('init itemsjs with config', itemsJsConfig, records ? records.length : 0);
        super(config, new MediaDocAdapterResponseMapper(config), records, itemsJsConfig);
    }

    mapToAdapterDocument(props: any): any {
        // todo remove album-cover
        return this.mapper.mapToAdapterDocument({}, props);
    }

    getItemsJsConfig(): ItemsJsConfig {
        return MediaDocItemsJsAdapter.itemsJsConfig;
    }


}

