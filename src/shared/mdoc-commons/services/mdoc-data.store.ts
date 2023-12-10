import {GenericDataStore} from '@dps/mycms-commons/dist/search-commons/services/generic-data.store';
import {MediaDocSearchResult} from '../model/container/mdoc-searchresult';
import {MediaDocSearchForm} from '../model/forms/mdoc-searchform';
import {MediaDocRecord, MediaDocRecordRelation} from '../model/records/mdoc-record';
import {Facets} from '@dps/mycms-commons/dist/search-commons/model/container/facets';
import {SearchParameterUtils} from '@dps/mycms-commons/dist/search-commons/services/searchparameter.utils';

export class MediaDocTeamFilterConfig {
    private values = new Map();

    get(key: string): any {
        return this.values.get(key);
    }

    set(key: string, value: any) {
        this.values.set(key, value);
    }
}

export class MediaDocDataStore extends GenericDataStore<MediaDocRecord, MediaDocSearchForm, MediaDocSearchResult> {

    static UPDATE_RELATION = [].concat(MediaDocRecordRelation.hasOne ? Object.keys(MediaDocRecordRelation.hasOne) : [])
        .concat(MediaDocRecordRelation.hasMany ? Object.keys(MediaDocRecordRelation.hasMany) : []);
    private validMoreNumberFilterNames = {
        // dashboard
        unrated: true,
        noGenre: true,
        // others
        id: true,
        album_id_i: true,
        album_id_is:  true,
        artist_id_i: true,
        artist_id_is:  true,
        audio_id_i: true,
        audio_id_is:  true,
        genre_id_i: true,
        genre_id_is:  true
    };
    private validMoreInFilterNames = {
        // dashboard
        doublettes: true,
        conflictingRates: true,
        id: true,
        id_notin_is: true,
        noFavoriteChildren: true,
        noMainFavoriteChildren: true,
        noSubType: true,
        todoKeywords: true,
        unRatedChildren: true,
        // others
        noMetaOnly: true,
        a_fav_url_hex: true,
        blocked_i: true,
        blocked_is: true,
        playlists_txt: true,
        initial_s: true,
        genre_ss: true
    };

    constructor(private searchParameterUtils: SearchParameterUtils, private teamFilterConfig: MediaDocTeamFilterConfig) {
        super(MediaDocDataStore.UPDATE_RELATION);
    }

    createQueryFromForm(searchForm: MediaDocSearchForm): Object {
        const query = {};

        if (searchForm === undefined) {
            return query;
        }

        let filter: {} = undefined;
        let spatial: {} = undefined;
        if (searchForm.fulltext !== undefined && searchForm.fulltext.length > 0) {
            filter = filter || {};
            filter['html'] = {
                'likei': '%' + searchForm.fulltext + '%'
            };
        }

        if (searchForm.what !== undefined && searchForm.what.length > 0) {
            filter = filter || {};
            filter['keywords_txt'] = {
                'in': searchForm.what.split(/,/)
            };
        }
        if (searchForm.type !== undefined && searchForm.type.length > 0) {
            filter = filter || {};
            filter['type_ss'] = {
                'in': searchForm.type.split(/,/)
            };
        }
        if (searchForm.playlists !== undefined && searchForm.playlists.length > 0) {
            filter = filter || {};
            filter['playlists_txt'] = {
                'in': searchForm.playlists.split(/,/)
            };
        }
        if (searchForm.initial !== undefined && searchForm.initial.length > 0) {
            filter = filter || {};
            filter['initial_s'] = {
                'in': searchForm.initial.split(/,/)
            };
        }
        if (searchForm.personalRateOverall !== undefined && searchForm.personalRateOverall.length > 0) {
            filter = filter || {};
            filter['rate_pers_gesamt_is'] = {
                'in': searchForm.personalRateOverall.split(/,/)
            };
        }
        if (searchForm.moreFilter !== undefined && searchForm.moreFilter.length > 0) {
            filter = filter || {};
            const moreFilters = searchForm.moreFilter.split(/;/);
            for (const index in moreFilters) {
                const moreFilter = moreFilters[index];
                const [filterName, values] = moreFilter.split(/:/);
                if (filterName && values && this.validMoreNumberFilterNames[filterName] === true) {
                    filter[filterName] = {
                        'in_number': values.split(/,/)
                    };
                } else if (filterName && values && this.validMoreInFilterNames[filterName] === true) {
                    filter[filterName] = {
                        'in': values.split(/,/)
                    };
                }

            }
        }

        if (searchForm.dashboardFilter !== undefined && searchForm.dashboardFilter.length > 0) {
            filter = filter || {};
            const moreFilters = searchForm.dashboardFilter.split(/;/);
            for (const index in moreFilters) {
                const moreFilter = moreFilters[index];
                let [filterName, values] = moreFilter.split(/:/);
                if (values === undefined && (filterName === 'noGenre')) {
                    values = 'null,0,1';
                }
                if (values === undefined && (filterName === 'noSubType')) {
                    values = 'null,ac_,ac_null,ac_0';
                }
                if (values === undefined && (filterName === 'todoKeywords')) {
                    values = 'KW_TODOKEYWORDS';
                }
                if (values === undefined && (filterName === 'unrated')) {
                    values = 'null,0';
                }

                if (filterName && values && this.validMoreNumberFilterNames[filterName] === true) {
                    filter[filterName] = {
                        'in_number': values.split(/,/)
                    };
                } else if (filterName && this.validMoreInFilterNames[filterName] === true) {
                    filter[filterName] = {
                        'in': values ? values.split(/,/) : [filterName]
                    };
                }
            }
        }

        if (searchForm.album !== undefined && searchForm.album.length > 0) {
            filter = filter || {};
            filter['album_ss'] = {
                'in': searchForm.album.split(/,/)
            };
        }
        if (searchForm.artist !== undefined && searchForm.artist.length > 0) {
            filter = filter || {};
            filter['artist_ss'] = {
                'in': searchForm.artist.split(/,/)
            };
        }
        if (searchForm.genre !== undefined && searchForm.genre.length > 0) {
            filter = filter || {};
            filter['genre_ss'] = {
                'in': searchForm.genre.split(/,/)
            };
        }

        if (filter !== undefined) {
            query['where'] = filter;
        }
        if (spatial !== undefined) {
            query['spatial'] = spatial;
        }

        const additionalFilter = this.createThemeFilterQueryFromForm(searchForm);
        if (additionalFilter !== undefined) {
            query['additionalWhere'] = additionalFilter;
        }

        return query;
    }

    createThemeFilterQueryFromForm(searchForm: MediaDocSearchForm): Object {
        let queryFilter: {} = undefined;
        if (searchForm === undefined) {
            return queryFilter;
        }

        let filter: {} = undefined;
        if (searchForm.theme !== undefined && searchForm.theme.length > 0 && this.teamFilterConfig.get(searchForm.theme)) {
            filter = filter || {};
            const themeFilter = this.teamFilterConfig.get(searchForm.theme);
            for (const filterProp in themeFilter) {
                filter[filterProp] = themeFilter[filterProp];
            }
        }

        if (filter !== undefined) {
            queryFilter = filter;
        }

        return queryFilter;
    }

    createSearchResult(searchForm: MediaDocSearchForm, recordCount: number, records: MediaDocRecord[],
                       facets: Facets): MediaDocSearchResult {
        return new MediaDocSearchResult(searchForm, recordCount, records, facets);
    }

}
