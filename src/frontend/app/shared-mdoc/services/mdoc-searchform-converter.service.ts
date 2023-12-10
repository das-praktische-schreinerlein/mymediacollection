import {Injectable} from '@angular/core';
import {MediaDocSearchForm, MediaDocSearchFormValidator} from '../../../shared/mdoc-commons/model/forms/mdoc-searchform';
import {
    GenericSearchFormConverter,
    HumanReadableFilter
} from '@dps/mycms-commons/dist/search-commons/services/generic-searchform.converter';
import {SearchParameterUtils} from '@dps/mycms-commons/dist/search-commons/services/searchparameter.utils';
import {TranslateService} from '@ngx-translate/core';
import {SearchFormUtils} from '@dps/mycms-frontend-commons/dist/angular-commons/services/searchform-utils.service';
import {Layout, LayoutService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/layout.service';

@Injectable()
export class MediaDocSearchFormConverter implements GenericSearchFormConverter<MediaDocSearchForm> {
    public readonly splitter = '_,_';
    public HRD_IDS = {
        album_id_i: 'ALBUM',
        album_id_is: 'ALBUM',
        artist_id_i: 'ARTIST',
        artist_id_is: 'ARTIST',
        audio_id_i: 'AUDIO',
        audio_id_is: 'AUDIO',
        genre_id_i: 'GENRE',
        genre_id_is: 'GENRE'
    };

    constructor(private searchParameterUtils: SearchParameterUtils, private translateService: TranslateService,
                private searchFormUtils: SearchFormUtils) {
    }

    isValid(searchForm: MediaDocSearchForm): boolean {
        return MediaDocSearchFormValidator.isValid(searchForm);
    }

    newSearchForm(values: {}): MediaDocSearchForm {
        return new MediaDocSearchForm(values);
    }

    parseLayoutParams(values: {}, mdocSearchForm: MediaDocSearchForm): Layout {
        if (!values || !values['layout']) {
            return undefined;
        }

        return LayoutService.layoutFromString(values['layout']);
    }

    joinWhereParams(mdocSearchForm: MediaDocSearchForm): string {
        const searchForm = (mdocSearchForm ? mdocSearchForm : new MediaDocSearchForm({}));
        const whereMap = new Map();
        return this.searchParameterUtils.joinParamsToOneRouteParameter(whereMap, this.splitter);
    }

    joinMoreFilterParams(mdocSearchForm: MediaDocSearchForm): string {
        const searchForm = (mdocSearchForm ? mdocSearchForm : new MediaDocSearchForm({}));
        const moreFilterMap = new Map();
        moreFilterMap.set('personalRateOverall', searchForm.personalRateOverall);
        moreFilterMap.set('dashboardFilter', searchForm.dashboardFilter);

        let moreFilter = this.searchParameterUtils.joinParamsToOneRouteParameter(moreFilterMap, this.splitter);
        if (moreFilter !== undefined && moreFilter.length > 0) {
            if (searchForm.moreFilter !== undefined && searchForm.moreFilter.length > 0) {
                moreFilter = [moreFilter, searchForm.moreFilter].join(this.splitter);
            }
        } else {
            moreFilter = searchForm.moreFilter;
        }
        return moreFilter;
    }

    joinWhatParams(mdocSearchForm: MediaDocSearchForm): string {
        const searchForm = (mdocSearchForm ? mdocSearchForm : new MediaDocSearchForm({}));
        const whatMap = new Map();
        whatMap.set('theme', searchForm.theme);
        whatMap.set('keyword', searchForm.what);
        whatMap.set('playlists', searchForm.playlists);
        whatMap.set('initial', searchForm.initial);

        return this.searchParameterUtils.joinParamsToOneRouteParameter(whatMap, this.splitter);
    }

    searchFormToValueMap(mdocSearchForm: MediaDocSearchForm): {[key: string]: string } {
        const searchForm = (mdocSearchForm ? mdocSearchForm : new MediaDocSearchForm({}));

        const where = this.joinWhereParams(searchForm);
        const moreFilter = this.joinMoreFilterParams(searchForm);
        const what = this.joinWhatParams(searchForm);

        const params: {[key: string]: string } = {
            what: this.searchParameterUtils.joinAndUseValueOrDefault(what, 'alles'),
            genre: this.searchParameterUtils.joinAndUseValueOrDefault(searchForm.genre, 'alle'),
            artist: this.searchParameterUtils.joinAndUseValueOrDefault(searchForm.artist, 'alle'),
            album: this.searchParameterUtils.joinAndUseValueOrDefault(searchForm.album, 'alle'),
            fulltext: this.searchParameterUtils.joinAndUseValueOrDefault(searchForm.fulltext, 'egal'),
            moreFilter: this.searchParameterUtils.joinAndUseValueOrDefault(moreFilter, 'ungefiltert'),
            sort: this.searchParameterUtils.joinAndUseValueOrDefault(searchForm.sort, 'relevance'),
            type: this.searchParameterUtils.joinAndUseValueOrDefault(searchForm.type, 'alle'),
            perPage: (+searchForm.perPage || 10) + '',
            pageNum: (+searchForm.pageNum || 1) + ''
        };

        return params;
    }

    searchFormToUrl(baseUrl: string, mdocSearchForm: MediaDocSearchForm): string {
        let url = baseUrl + 'search/';
        const searchForm = (mdocSearchForm ? mdocSearchForm : new MediaDocSearchForm({}));

        const where = this.joinWhereParams(searchForm);
        const moreFilter = this.joinMoreFilterParams(searchForm);
        const what = this.joinWhatParams(searchForm);

        const params: Object[] = [
            this.searchParameterUtils.joinAndUseValueOrDefault(what, 'alles'),
            this.searchParameterUtils.joinAndUseValueOrDefault(searchForm.genre, 'alle'),
            this.searchParameterUtils.joinAndUseValueOrDefault(searchForm.artist, 'alle'),
            this.searchParameterUtils.joinAndUseValueOrDefault(searchForm.album, 'alle'),
            this.searchParameterUtils.joinAndUseValueOrDefault(searchForm.fulltext, 'egal'),
            this.searchParameterUtils.joinAndUseValueOrDefault(moreFilter, 'ungefiltert'),
            this.searchParameterUtils.joinAndUseValueOrDefault(searchForm.sort, 'relevance'),
            this.searchParameterUtils.joinAndUseValueOrDefault(searchForm.type, 'alle'),
            +searchForm.perPage || 10,
            +searchForm.pageNum || 1
        ];
        url += params.join('/');

        const queryParameter = [];
        if (searchForm['layout'] !== undefined) {
            queryParameter.push('layout=' + LayoutService.layoutToString(searchForm['layout']));
        }

        if (searchForm['hideForm']) {
            queryParameter.push('hideForm=true');
        }

        if (queryParameter.length > 0) {
            url += '?' + queryParameter.join('&');
        }

        return url;
    }

    paramsToSearchForm(params: any, defaults: {}, searchForm: MediaDocSearchForm, queryParams?: {}): void {
        params = params || {};
        defaults = defaults || {};
        const moreFilterValues = this.searchParameterUtils.splitValuesByPrefixes(params.moreFilter, this.splitter,
            ['personalRateOverall:', 'dashboardFilter:']);
        let moreFilter = '';
        if (moreFilterValues.has('unknown')) {
            moreFilter += ',' + this.searchParameterUtils.joinValuesAndReplacePrefix(moreFilterValues.get('unknown'), '', ',');
        }
        moreFilter = moreFilter.replace(/[,]+/g, ',').replace(/(^,)|(,$)/g, '');
        const personalRateOverall: string = (moreFilterValues.has('personalRateOverall:') ?
            this.searchParameterUtils.joinValuesAndReplacePrefix(moreFilterValues.get('personalRateOverall:'), 'personalRateOverall:',
                ',') : '');
        const dashboardFilter: string = (params.dashboardFilter
            ? params.dashboardFilter
            : ( moreFilterValues.has('dashboardFilter:') ?
                this.searchParameterUtils.joinValuesAndReplacePrefix(moreFilterValues.get('dashboardFilter:'), 'dashboardFilter:',
                    ',')
                : ''));

        const whatFilterValues = this.searchParameterUtils.splitValuesByPrefixes(params.what, this.splitter,
            ['theme:', 'keyword:', 'playlists:', 'initial:']);
        let whatFilter = '';
        if (whatFilterValues.has('unknown')) {
            whatFilter += ',' + this.searchParameterUtils.joinValuesAndReplacePrefix(whatFilterValues.get('unknown'), '', ',');
        }
        whatFilter = whatFilter.replace(/[,]+/g, ',').replace(/(^,)|(,$)/g, '');
        const theme: string = (whatFilterValues.has('theme:') ?
            this.searchParameterUtils.joinValuesAndReplacePrefix(whatFilterValues.get('theme:'), 'theme:', ',') : '');
        const what: string = (whatFilterValues.has('keyword:') ?
            this.searchParameterUtils.joinValuesAndReplacePrefix(whatFilterValues.get('keyword:'), 'keyword:', ',') : '');
        const playlists: string = (whatFilterValues.has('playlists:') ?
            this.searchParameterUtils.joinValuesAndReplacePrefix(whatFilterValues.get('playlists:'), 'playlists:', ',') : '');
        const initial: string = (whatFilterValues.has('initial:') ?
            this.searchParameterUtils.joinValuesAndReplacePrefix(whatFilterValues.get('initial:'), 'initial:', ',') : '');

        searchForm.album = this.searchParameterUtils.useValueDefaultOrFallback(
            this.searchParameterUtils.replacePlaceHolder(params['album'], /^alle/, ''),
            defaults['album'], '');
        searchForm.artist = this.searchParameterUtils.useValueDefaultOrFallback(
            this.searchParameterUtils.replacePlaceHolder(params['artist'], /^alle/, ''),
            defaults['artist'], '');
        searchForm.genre = this.searchParameterUtils.useValueDefaultOrFallback(
            this.searchParameterUtils.replacePlaceHolder(params['genre'], /^alle/, ''),
            defaults['genre'], '');

        searchForm.theme = this.searchParameterUtils.joinAndUseValueDefaultOrFallback(
            this.searchParameterUtils.replacePlaceHolder(theme || params['theme'], /^alle$/, ''),
            defaults['theme'], '');
        searchForm.what = this.searchParameterUtils.useValueDefaultOrFallback(
            this.searchParameterUtils.replacePlaceHolder(what, /^alles$/, ''),
            defaults['what'], '');
        searchForm.playlists = this.searchParameterUtils.useValueDefaultOrFallback(
            this.searchParameterUtils.replacePlaceHolder(playlists, /^alles$/, ''),
            defaults['playlists'], '');
        searchForm.initial = this.searchParameterUtils.useValueDefaultOrFallback(
            this.searchParameterUtils.replacePlaceHolder(initial, /^alles$/, ''),
            defaults['initial'], '');
        searchForm.fulltext = this.searchParameterUtils.useValueDefaultOrFallback(
            this.searchParameterUtils.replacePlaceHolder(params['fulltext'], /^egal$/, ''),
            defaults['fulltext'], '');
        searchForm.moreFilter = this.searchParameterUtils.useValueDefaultOrFallback(
            this.searchParameterUtils.replacePlaceHolder(moreFilter, /^ungefiltert$/, ''),
            defaults['moreFilter'], '');
        searchForm.personalRateOverall = this.searchParameterUtils.useValueDefaultOrFallback(
            this.searchParameterUtils.replacePlaceHolder(personalRateOverall, /^ungefiltert$/, ''),
            defaults['personalRateOverall'], '');
        searchForm.sort = this.searchParameterUtils.useValueDefaultOrFallback(params['sort'], defaults['sort'], '');
        searchForm.type = this.searchParameterUtils.useValueDefaultOrFallback(
            this.searchParameterUtils.replacePlaceHolder(params['type'], /^alle$/, ''), defaults['type'], '').toLocaleLowerCase();
        searchForm.dashboardFilter = this.searchParameterUtils.useValueDefaultOrFallback(
            this.searchParameterUtils.replacePlaceHolder(dashboardFilter, /^alles$/, ''),
            defaults['dashboardFilter'], '');
        searchForm.perPage = +params['perPage'] || 10;
        searchForm.pageNum = +params['pageNum'] || 1;

        const layout = this.parseLayoutParams(queryParams, searchForm);
        if (layout !== undefined) {
            searchForm['layout'] = layout;
        }

        if (queryParams !== undefined && (queryParams['hideForm'] === true || queryParams['hideForm'] === 'true')) {
            searchForm['hideForm'] = true;
        }
    }

    searchFormToHumanReadableText(filters: HumanReadableFilter[], textOnly: boolean, obJCache: Map<string, string>): string {
        return this.searchFormUtils.searchFormToHumanReadableMarkup(filters, true, obJCache, this.getHrdIds());
    }

    searchFormToHumanReadableFilter(mdocSearchForm: MediaDocSearchForm): HumanReadableFilter[] {
        const searchForm = (mdocSearchForm ? mdocSearchForm : new MediaDocSearchForm({}));

        const res: HumanReadableFilter[] = [];
        res.push(this.translateService.instant('hrt_search') || 'search');
        res.push(this.searchFormUtils.valueToHumanReadableText(mdocSearchForm.type, 'hrt_type', 'hrt_alltypes', true));

        const what = (mdocSearchForm.what ? mdocSearchForm.what : '').replace(new RegExp('kw_', 'gi'), '');
        res.push(this.searchFormUtils.valueToHumanReadableText(what, 'hrt_keyword', undefined, true));

        const moreFilterValues = this.searchParameterUtils.splitValuesByPrefixes(mdocSearchForm.moreFilter, this.splitter,
            Object.getOwnPropertyNames(this.getHrdIds()));
        moreFilterValues.forEach((value, key) => {
            const moreValue = this.searchParameterUtils.joinValuesAndReplacePrefix(moreFilterValues.get(key), key + ':', ',');
            res.push(this.searchFormUtils.valueToHumanReadableText(moreValue, key === 'unknown' ? 'hrt_moreFilter' : 'hrt_' + key,
                undefined, true));
        });

        res.push(this.searchFormUtils.valueToHumanReadableText(mdocSearchForm.initial, 'hrt_initial', undefined, true));
        res.push(this.searchFormUtils.valueToHumanReadableText(mdocSearchForm.fulltext, 'hrt_fulltext', undefined, true));
        res.push(this.searchFormUtils.valueToHumanReadableText(mdocSearchForm.playlists, 'hrt_playlists', undefined, true));
        res.push(this.searchFormUtils.valueToHumanReadableText(mdocSearchForm.personalRateOverall, 'hrt_personalRateOverall',
            undefined, true, 'filter.mdocratepers.gesamt.'));
        res.push(this.searchFormUtils.valueToHumanReadableText(mdocSearchForm.dashboardFilter, 'hrt_dashboardFilter',
            undefined, true, 'label.dashboardColumn.'));

        return res;
    }

    getHrdIds(): {} {
        return this.HRD_IDS;
    }

}
