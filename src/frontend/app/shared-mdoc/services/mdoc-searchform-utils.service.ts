import {Injectable} from '@angular/core';
import {SearchFormUtils} from '@dps/mycms-frontend-commons/dist/angular-commons/services/searchform-utils.service';
import {SearchParameterUtils} from '@dps/mycms-commons/dist/search-commons/services/searchparameter.utils';
import {CommonDocSearchFormUtils} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/services/cdoc-searchform-utils.service';
import {MediaDocSearchResult} from '../../../shared/mdoc-commons/model/container/mdoc-searchresult';

@Injectable()
export class MediaDocSearchFormUtils extends CommonDocSearchFormUtils {

    constructor(protected searchFormUtils: SearchFormUtils, protected searchParameterUtils: SearchParameterUtils) {
        super(searchFormUtils, searchParameterUtils);
    }

    getDashboardFilterValues(searchResult: MediaDocSearchResult): any[] {
        return this.searchFormUtils.getFacetValues(searchResult, 'noSubType', '', 'label.dashboardColumn.').concat(
            this.searchFormUtils.getFacetValues(searchResult, 'noGenre', '', 'label.dashboardColumn.')).concat(
            this.searchFormUtils.getFacetValues(searchResult, 'unrated', '', 'label.dashboardColumn.')).concat(
            this.searchFormUtils.getFacetValues(searchResult, 'doublettes', '', 'label.dashboardColumn.')).concat(
            this.searchFormUtils.getFacetValues(searchResult, 'todoKeywords', '', 'label.dashboardColumn.')).concat(
            this.searchFormUtils.getFacetValues(searchResult, 'noFavoriteChildren', '', 'label.dashboardColumn.')).concat(
            this.searchFormUtils.getFacetValues(searchResult, 'noMainFavoriteChildren', '', 'label.dashboardColumn.')).concat(
            this.searchFormUtils.getFacetValues(searchResult, 'unRatedChildren', '', 'label.dashboardColumn.')).concat(
            this.searchFormUtils.getFacetValues(searchResult, 'conflictingRates', '', 'label.dashboardColumn.'));
    }

    getWhatValues(searchResult: MediaDocSearchResult): any[] {
        return this.searchFormUtils.getFacetValues(searchResult, 'keywords_txt', '', '');
    }

    getGenreValues(searchResult: MediaDocSearchResult): any[] {
        return this.searchFormUtils.getFacetValues(searchResult, 'genre_ss', '', '');
    }

    getArtistValues(searchResult: MediaDocSearchResult): any[] {
        return this.searchFormUtils.getFacetValues(searchResult, 'artist_ss', '', '');
    }

    getAlbumValues(searchResult: MediaDocSearchResult): any[] {
        return this.searchFormUtils.getFacetValues(searchResult, 'album_ss', '', '');
    }

    getPersonalRateOverallValues(searchResult: MediaDocSearchResult): any[] {
        return this.searchFormUtils.getFacetValues(searchResult, 'rate_pers_gesamt_is', '', 'filter.mdocratepers.gesamt.');
    }

}
