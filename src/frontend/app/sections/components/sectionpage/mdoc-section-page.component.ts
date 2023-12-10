import {ChangeDetectionStrategy, ChangeDetectorRef, Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {MediaDocSearchFormConverter} from '../../../shared-mdoc/services/mdoc-searchform-converter.service';
import {LayoutService, LayoutSizeData} from '@dps/mycms-frontend-commons/dist/angular-commons/services/layout.service';
import {CommonDocRoutingService} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/services/cdoc-routing.service';
import {ErrorResolver} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/resolver/error.resolver';
import {MediaDocSearchForm, MediaDocSearchFormFactory} from '../../../../shared/mdoc-commons/model/forms/mdoc-searchform';
import {GenericAppService} from '@dps/mycms-commons/dist/commons/services/generic-app.service';
import {PageUtils} from '@dps/mycms-frontend-commons/dist/angular-commons/services/page.utils';
import {MediaDocSearchResult} from '../../../../shared/mdoc-commons/model/container/mdoc-searchresult';
import {Facets} from '@dps/mycms-commons/dist/search-commons/model/container/facets';
import {AngularMarkdownService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/angular-markdown.service';
import {AngularHtmlService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/angular-html.service';
import {CommonRoutingService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/common-routing.service';
import {GenericTrackingService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/generic-tracking.service';
import {PlatformService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/platform.service';
import {BeanUtils} from '@dps/mycms-commons/dist/commons/utils/bean.utils';
import {environment} from '../../../../environments/environment';
import {StaticPagesDataService} from '@dps/mycms-commons/dist/pdoc-commons/services/staticpages-data.service';
import {
    SectionPageComponent
} from '@dps/mycms-frontend-commons/dist/frontend-section-commons/components/sectionpage/section-page.component';
import {PDocRecord} from '@dps/mycms-commons/dist/pdoc-commons/model/records/pdoc-record';

export interface MediaDocSectionPageComponentAvailableTabs {
    ALBUM?: boolean;
    ARTIST?: boolean;
    AUDIO?: boolean;
    GENRE?: boolean;
    PLAYLIST?: boolean;
}

export interface MediaDocSectionPageComponentDashboardRows {
    noSubType?: boolean;
    unrated?: boolean;
    rated?: boolean;
}

@Component({
    selector: 'app-mdoc-sectionpage',
    templateUrl: './mdoc-section-page.component.html',
    styleUrls: ['./mdoc-section-page.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MediaDocSectionPageComponent extends SectionPageComponent {
    objectKeys = Object.keys;
    mdocSearchForm: MediaDocSearchForm = new MediaDocSearchForm({});
    mdocSearchResult: MediaDocSearchResult = new MediaDocSearchResult(this.mdocSearchForm, 0, undefined, new Facets());
    genreSearchResult: MediaDocSearchResult = new MediaDocSearchResult(this.mdocSearchForm, 0, undefined, new Facets());
    pageContainerOrder = [];
    bestMatchingTabsOrder = [];
    favoritesTabsOrder = [];
    availableTabs = {
        ALBUM: true,
        ARTIST: true,
        AUDIO: true,
        GENRE: true,
        PLAYLIST: true
    };
    availableDashboardColumns: MediaDocSectionPageComponentAvailableTabs = {
        ALBUM: true,
        ARTIST: true,
        AUDIO: true,
        GENRE: true
    };

    availableToDoDashboardRows: MediaDocSectionPageComponentDashboardRows = {
    };
    availableDoneDashboardRows: MediaDocSectionPageComponentDashboardRows = {
    };

    flgShowTopTen = false;
    flgShowSearch = false;
    flgShowNews = false;
    flgShowDashboard = false;
    flgShowAdminArea = false;
    flgShowStatisticBoard = false;

    private layoutSize: LayoutSizeData;
    private DEFAULT_PAGECONTAINERORDER = [
        'contentContainer',
        'searchHintContainer',
        'newsContainer',
        'sectionsContainer',
        'topTenContainer',
        'dashBoardContainer',
        'adminAreaContainer',
        'tagcloudContainer',
        'statisticBoardContainer'];
    private DEFAULT_BESTMATCHINGTABORDER = [
        'ARTIST',
        'ALBUM',
        'AUDIO',
        'GENRE',
        'PLAYLIST',
        'ALL'];
    private DEFAULT_FAVORITESTABORDER = [
        'AUDIO',
        'ARTIST',
        'ALBUM',
        'GENRE',
        'PLAYLIST',
        'ALL'];

    constructor(route: ActivatedRoute, pagesDataService: StaticPagesDataService,
                commonRoutingService: CommonRoutingService, private searchFormConverter: MediaDocSearchFormConverter,
                errorResolver: ErrorResolver, private mDocRoutingService: CommonDocRoutingService,
                toastr: ToastrService, pageUtils: PageUtils,
                angularMarkdownService: AngularMarkdownService, angularHtmlService: AngularHtmlService,
                cd: ChangeDetectorRef, trackingProvider: GenericTrackingService, platformService: PlatformService,
                layoutService: LayoutService, appService: GenericAppService) {
        super(route, pagesDataService, commonRoutingService, errorResolver, toastr,
            pageUtils, angularMarkdownService, angularHtmlService, cd, trackingProvider, platformService,
            layoutService, appService);
    }

    getFiltersForType(type: string, sort?: string): any {
        const filters = {
            type: type
        };

        filters['theme'] = this.pdoc.theme;
        filters['perPage'] = 4;

        if (sort) {
            filters['sort'] = sort;
            if (sort === 'ratePers') {
                filters['moreFilter'] = 'personalRateOverall:5,6,7,8,9,10,11,12,13,14,15';
            }
        }

        filters['where'] = this.searchFormConverter.joinWhereParams(this.mdocSearchForm);
        filters['what'] = this.searchFormConverter.joinWhatParams(this.mdocSearchForm);
        filters['fulltext'] = this.mdocSearchForm.fulltext;

        return filters;
    }

    getDashboardFiltersForType(profile: string, recordType: string, sort?: string): any {
        const filters = this.getFiltersForType(recordType, sort);
        const splitter = this.searchFormConverter.splitter;
        switch (profile) {
            // dashboard
            case 'doublettes':
            case 'conflictingRates':
            case 'noFavoriteChildren':
            case 'noMainFavoriteChildren':
            case 'noGenre':
            case 'noSubType':
            case 'todoKeywords':
            case 'unrated':
            case 'unRatedChildren':
                filters['dashboardFilter'] = filters['dashboardFilter'] ? filters['dashboardFilter'] + splitter : '';
                filters['dashboardFilter'] += profile;
                break;
            // Others
            case 'rated':
                filters['moreFilter'] = filters['moreFilter'] ? filters['moreFilter'] + splitter : '';
                filters['moreFilter'] += 'personalRateOverall:1,2,3,4,5,6,7,8,9,10,11,12,13,14,15';
                break;
            case 'rejected':
                filters['moreFilter'] = filters['moreFilter'] ? filters['moreFilter'] + splitter : '';
                filters['moreFilter'] += 'personalRateOverall:-1';
                break;
        }

        return filters;
    }

    getDashboardVisibilityForType(profile: string, recordType: string): boolean {
        switch (profile) {
            case 'noSubType':
                return recordType === 'ALBUM' || recordType === 'ARTIST' || recordType === 'GENRE' || recordType === 'AUDIO';
            case 'noGenre':
                return recordType === 'ALBUM' || recordType === 'ARTIST' || recordType === 'AUDIO';
            case 'unrated':
                return recordType === 'AUDIO';
            case 'todoKeywords':
            case 'doublettes':
                return recordType === 'ALBUM' || recordType === 'ARTIST' || recordType === 'GENRE' || recordType === 'AUDIO';
            case 'conflictingRates':
            case 'noFavoriteChildren':
            case 'unRatedChildren':
            case 'noMainFavoriteChildren':
                return recordType === 'ALBUM' || recordType === 'ARTIST' || recordType === 'GENRE';
            case 'rated':
            case 'rejected':
                return recordType === 'AUDIO';
        }

        return false;
    }

    onSearchDoc(mdocSearchForm: MediaDocSearchForm) {
        this.mdocSearchForm = mdocSearchForm;
        this.mDocRoutingService.setLastSearchUrl(this.getToSearchUrl());
        this.cd.markForCheck();

        return false;
    }

    onTopTenResultFound(mdocSearchResult: MediaDocSearchResult) {
        if (mdocSearchResult !== undefined && mdocSearchResult.searchForm !== undefined) {
            this.mdocSearchResult = mdocSearchResult;
        }

        this.cd.markForCheck();

        return false;
    }

    onTopTenGenreResultFound(mdocSearchResult: MediaDocSearchResult) {
        this.genreSearchResult = mdocSearchResult;
        this.onTopTenResultFound(mdocSearchResult);
    }

    onTagcloudClicked(filterValue: any, filter: string) {
        this.mdocSearchForm.type = this.genreSearchResult.searchForm.type;
        this.mdocSearchForm[filter] = filterValue;
        const url = this.searchFormConverter.searchFormToUrl(this.baseSearchUrl, MediaDocSearchFormFactory.createSanitized({
            theme: this.pdoc.theme,
            perPage: 10,
            type: this.mdocSearchForm.type,
            what: this.mdocSearchForm.what.toString(),
            genre: this.mdocSearchForm.genre.toString(),
            playlists: this.mdocSearchForm.playlists.toString(),
            fulltext: this.mdocSearchForm.fulltext
        }));
        this.commonRoutingService.navigateByUrl(url);

        return false;
    }

    getToSearchUrl() {
        return this.searchFormConverter.searchFormToUrl(this.baseSearchUrl, MediaDocSearchFormFactory.createSanitized({
            theme: this.pdoc.theme,
            perPage: 10,
            type: environment.defaultSearchTypes,
            what: this.mdocSearchForm.what.toString(),
            genre: this.mdocSearchForm.genre.toString(),
        }));
    }

    submitToSearch() {
        const url = this.getToSearchUrl();
        // console.log('submitToSearch: redirect to ', url);

        this.commonRoutingService.navigateByUrl(url);
        return false;
    }

    protected onResize(layoutSizeData: LayoutSizeData): void {
        super.onResize(layoutSizeData);
        this.layoutSize = layoutSizeData;
        this.cd.markForCheck();
    }

    protected configureProcessingOfResolvedData(config: {}): void {
        if (BeanUtils.getValue(config, 'components.pdoc-sectionpage.availableTabs') !== undefined) {
            this.availableTabs = BeanUtils.getValue(config, 'components.pdoc-sectionpage.availableTabs');
        }

        if (BeanUtils.getValue(config, 'permissions.mdocWritable') === true) {
            if (BeanUtils.getValue(config, 'components.pdoc-sectionpage.availableDashboardColumns') !== undefined) {
                this.availableDashboardColumns = BeanUtils.getValue(config, 'components.pdoc-sectionpage.availableDashboardColumns');
            }
            if (BeanUtils.getValue(config, 'components.pdoc-sectionpage.availableToDoDashboardRows') !== undefined) {
                this.availableToDoDashboardRows = BeanUtils.getValue(config, 'components.pdoc-sectionpage.availableToDoDashboardRows');
            }
            if (BeanUtils.getValue(config, 'components.pdoc-sectionpage.availableDoneDashboardRows') !== undefined) {
                this.availableDoneDashboardRows = BeanUtils.getValue(config, 'components.pdoc-sectionpage.availableDoneDashboardRows');
            }
        }
    }

    protected doProcessPageFlags(config: {}, pdoc: PDocRecord): void {
        const flags = pdoc.flags
        ? pdoc.flags.split(',')
                .map(flag => flag.trim())
                .filter(flag => flag !== undefined && flag !== '')
        : [];

        this.flgShowTopTen = flags.includes('flg_ShowTopTen');
        this.flgShowSearch = flags.includes('flg_ShowSearch');
        this.flgShowNews = flags.includes('flg_ShowNews');
        this.flgShowDashboard = flags.includes('flg_ShowDashboard');
        this.flgShowAdminArea = flags.includes('flg_ShowAdminArea');
        this.flgShowStatisticBoard = flags.includes('flg_ShowStatisticBoard');
    }

    protected doProcessAfterResolvedData(config: {}): void {
        this.doProcessPageFlags(config, this.pdoc);

        this.mDocRoutingService.setLastBaseUrl(this.baseSearchUrl);
        this.mDocRoutingService.setLastSearchUrl(this.getToSearchUrl());

        if (this.pdoc['pageContainerOrder']) {
            this.pageContainerOrder = this.pdoc['pageContainerOrder'];
        } else if (BeanUtils.getValue(config, 'components.pdoc-sectionpage.pageContainerOrder') !== undefined) {
            this.pageContainerOrder = BeanUtils.getValue(config, 'components.pdoc-sectionpage.pageContainerOrder');
        } else {
            this.pageContainerOrder = this.DEFAULT_PAGECONTAINERORDER;
        }

        let list = [];
        if (this.pdoc['bestMatchingTabsOrder']) {
            list = this.pdoc['bestMatchingTabsOrder'];
        } else if (BeanUtils.getValue(config, 'components.pdoc-sectionpage.bestMatchingTabsOrder') !== undefined) {
            list = BeanUtils.getValue(config, 'components.pdoc-sectionpage.bestMatchingTabsOrder');
        } else {
            list = this.DEFAULT_BESTMATCHINGTABORDER;
        }

        this.bestMatchingTabsOrder =  list.filter(tab => this.availableTabs[tab]);

        list = [];
        if (this.pdoc['favoritesTabsOrder']) {
            list = this.pdoc['favoritesTabsOrder'];
        } else if (BeanUtils.getValue(config, 'components.pdoc-sectionpage.favoritesTabsOrder') !== undefined) {
            list = BeanUtils.getValue(config, 'components.pdoc-sectionpage.favoritesTabsOrder');
        } else {
            list = this.DEFAULT_FAVORITESTABORDER;
        }

        this.favoritesTabsOrder =  list.filter(tab => this.availableTabs[tab]);
    }

}
