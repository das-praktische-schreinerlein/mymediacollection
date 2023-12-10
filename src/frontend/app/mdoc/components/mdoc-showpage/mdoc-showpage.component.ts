import {ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef} from '@angular/core';
import {MediaDocRecord} from '../../../../shared/mdoc-commons/model/records/mdoc-record';
import {ActivatedRoute, Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {Layout, LayoutService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/layout.service';
import {ErrorResolver} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/resolver/error.resolver';
import {GenericAppService} from '@dps/mycms-commons/dist/commons/services/generic-app.service';
import {PageUtils} from '@dps/mycms-frontend-commons/dist/angular-commons/services/page.utils';
import {MediaDocSearchResult} from '../../../../shared/mdoc-commons/model/container/mdoc-searchresult';
import {AngularMarkdownService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/angular-markdown.service';
import {AngularHtmlService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/angular-html.service';
import {CommonRoutingService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/common-routing.service';
import {GenericTrackingService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/generic-tracking.service';
import {PlatformService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/platform.service';
import {MediaDocSearchForm} from '../../../../shared/mdoc-commons/model/forms/mdoc-searchform';
import {Facets} from '@dps/mycms-commons/dist/search-commons/model/container/facets';
import {BeanUtils} from '@dps/mycms-commons/dist/commons/utils/bean.utils';
import {isArray, isNumber} from 'util';
import {MediaDocDataService} from '../../../../shared/mdoc-commons/services/mdoc-data.service';
import {
    CommonDocShowpageComponent,
    CommonDocShowpageComponentConfig
} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/components/cdoc-showpage.component';
import {MediaDocContentUtils} from '../../../shared-mdoc/services/mdoc-contentutils.service';
import {MediaDocRoutingService} from '../../../../shared/mdoc-commons/services/mdoc-routing.service';
import {environment} from '../../../../environments/environment';

export interface MediaDocShowpageComponentAvailableTabs {
    ALBUM?: boolean;
    ARTIST?: boolean;
    AUDIO?: boolean;
    AUDIO_FAVORITES?: boolean;
    GENRE?: boolean;
    PLAYLIST?: boolean;
}

@Component({
    selector: 'app-mdoc-showpage',
    templateUrl: './mdoc-showpage.component.html',
    styleUrls: ['./mdoc-showpage.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MediaDocShowpageComponent extends CommonDocShowpageComponent<MediaDocRecord, MediaDocSearchForm, MediaDocSearchResult,
    MediaDocDataService> {
    tagcloudSearchResult = new MediaDocSearchResult(new MediaDocSearchForm({}), 0, undefined, new Facets());
    defaultSubAudioLayout = Layout.SMALL;
    flgShowTopAudios = true;
    flgTopAudiosAvailable = true;
    showResultListTrigger: {
        ALBUM: boolean|number;
        ARTIST: boolean|number;
        AUDIO: boolean|number;
        AUDIO_FAVORITES: boolean|number;
        GENRE: boolean|number;
        PLAYLIST: boolean|number;

    } = {
        ALBUM: true,
        ARTIST: true,
        AUDIO: true,
        AUDIO_FAVORITES: true,
        GENRE: true,
        PLAYLIST: true
    };
    availableTabs: MediaDocShowpageComponentAvailableTabs = {
        'ALBUM': true,
        'ARTIST': true,
        'AUDIO': true,
        'AUDIO_FAVORITES': true,
        'GENRE': true,
        'PLAYLIST': true
    };

    constructor(route: ActivatedRoute, cdocRoutingService: MediaDocRoutingService,
                toastr: ToastrService, contentUtils: MediaDocContentUtils,
                errorResolver: ErrorResolver, pageUtils: PageUtils, commonRoutingService: CommonRoutingService,
                angularMarkdownService: AngularMarkdownService, angularHtmlService: AngularHtmlService,
                cd: ChangeDetectorRef, trackingProvider: GenericTrackingService, appService: GenericAppService,
                platformService: PlatformService, layoutService: LayoutService, protected elRef: ElementRef, protected router: Router) {
        super(route, cdocRoutingService, toastr, contentUtils, errorResolver, pageUtils, commonRoutingService,
            angularMarkdownService, angularHtmlService, cd, trackingProvider, appService, platformService, layoutService,
            environment, router);
    }

    getFiltersForType(record: MediaDocRecord, type: string): any {
        const minPerPage = isNumber(this.showResultListTrigger[type]) ? this.showResultListTrigger[type] : 0;

        const theme = this.pdoc ? this.pdoc.theme : undefined;
        const filters = (<MediaDocContentUtils>this.contentUtils).getMediaDocSubItemFiltersForType(record, type, theme, minPerPage);

        return filters;
    }

    onTopAudiosFound(searchResult: MediaDocSearchResult) {
        if (searchResult === undefined || searchResult.recordCount <= 3) {
            this.flgTopAudiosAvailable = false;
        } else {
            this.flgTopAudiosAvailable = true;
        }
        this.flgShowTopAudios = this.flgTopAudiosAvailable;
        if (!this.layoutService.isDesktop()) {
            this.flgShowTopAudios = false;
        }
        this.cd.markForCheck();

        return false;
    }

    protected getComponentConfig(config: {}): CommonDocShowpageComponentConfig {
        return {
            baseSearchUrl: ['mdoc'].join('/'),
            baseSearchUrlDefault: ['mdoc'].join('/')
        };
    }

    protected configureProcessingOfResolvedData(): void {
        const me = this;
        const config = me.appService.getAppConfig();
        if (BeanUtils.getValue(config, 'components.mdoc-showpage.showBigImages') === true) {
            this.defaultSubAudioLayout = Layout.BIG;
        }
        if (BeanUtils.getValue(config, 'components.mdoc-showpage.availableTabs') !== undefined) {
            me.availableTabs = BeanUtils.getValue(config, 'components.mdoc-showpage.availableTabs');
        }
        if (isArray(BeanUtils.getValue(config, 'components.mdoc-showpage.allowedQueryParams'))) {
            const allowedParams = BeanUtils.getValue(config, 'components.mdoc-showpage.allowedQueryParams');
            for (const type in me.showResultListTrigger) {
                const paramName = 'show' + type;
                if (allowedParams.indexOf(paramName) >= 0 && me.queryParamMap && me.queryParamMap.get(paramName)) {
                    me.showResultListTrigger[type] =
                        MediaDocSearchForm.genericFields.perPage.validator.sanitize(me.queryParamMap.get(paramName));
                }
            }
        }
    }

    protected getConfiguredIndexableTypes(config: {}): string[] {
        let indexableTypes = [];
        if (BeanUtils.getValue(config, 'services.seo.mdocIndexableTypes')) {
            indexableTypes = config['services']['seo']['mdocIndexableTypes'];
        }

        return indexableTypes;
    }

    protected doProcessAfterResolvedData(): void {
        const me = this;
        me.tagcloudSearchResult = new MediaDocSearchResult(new MediaDocSearchForm({}), 0, undefined, new Facets());
    }
}
