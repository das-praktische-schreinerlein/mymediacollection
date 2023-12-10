import {ChangeDetectionStrategy, ChangeDetectorRef, Component} from '@angular/core';
import {MediaDocRecord} from '../../../../shared/mdoc-commons/model/records/mdoc-record';
import {ActivatedRoute} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {ErrorResolver} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/resolver/error.resolver';
import {GenericAppService} from '@dps/mycms-commons/dist/commons/services/generic-app.service';
import {PageUtils} from '@dps/mycms-frontend-commons/dist/angular-commons/services/page.utils';
import {MediaDocSearchResult} from '../../../../shared/mdoc-commons/model/container/mdoc-searchresult';
import {AngularMarkdownService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/angular-markdown.service';
import {AngularHtmlService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/angular-html.service';
import {CommonRoutingService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/common-routing.service';
import {GenericTrackingService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/generic-tracking.service';
import {PlatformService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/platform.service';
import {MediaDocDataService} from '../../../../shared/mdoc-commons/services/mdoc-data.service';
import {BeanUtils} from '@dps/mycms-commons/dist/commons/utils/bean.utils';
import {MediaDocContentUtils} from '../../../shared-mdoc/services/mdoc-contentutils.service';
import {MediaDocRoutingService} from '../../../../shared/mdoc-commons/services/mdoc-routing.service';
import {LayoutService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/layout.service';
import {environment} from '../../../../environments/environment';
import {
    CommonDocEditpageComponent,
    CommonDocEditpageComponentConfig
} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/components/cdoc-editpage.component';
import {MediaDocSearchForm} from '../../../../shared/mdoc-commons/model/forms/mdoc-searchform';
import {CommonDocMultiActionManager} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/services/cdoc-multiaction.manager';
import {MediaDocActionTagService} from '../../../shared-mdoc/services/mdoc-actiontag.service';

@Component({
    selector: 'app-mdoc-editpage',
    templateUrl: './mdoc-editpage.component.html',
    styleUrls: ['./mdoc-editpage.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MediaDocEditpageComponent
    extends CommonDocEditpageComponent<MediaDocRecord, MediaDocSearchForm, MediaDocSearchResult, MediaDocDataService> {
    multiActionManager: CommonDocMultiActionManager<MediaDocRecord, MediaDocSearchForm, MediaDocSearchResult, MediaDocDataService>;
    showResultListTrigger: {
        ALBUM: boolean|number;
        ARTIST: boolean|number;
        AUDIO: boolean|number;
        GENRE: boolean|number;
    } = {
        ALBUM: true,
        ARTIST: true,
        AUDIO: true,
        GENRE: true
    };
    availableTabs = {
        'ALBUM': true,
        'ARTIST': true,
        'AUDIO': true,
        'GENRE': true
    };

    constructor(protected route: ActivatedRoute, protected cdocRoutingService: MediaDocRoutingService,
                protected toastr: ToastrService, contentUtils: MediaDocContentUtils,
                protected errorResolver: ErrorResolver, protected pageUtils: PageUtils,
                protected commonRoutingService: CommonRoutingService, protected angularMarkdownService: AngularMarkdownService,
                protected angularHtmlService: AngularHtmlService, protected cd: ChangeDetectorRef,
                protected trackingProvider: GenericTrackingService, protected appService: GenericAppService,
                protected platformService: PlatformService, protected layoutService: LayoutService,
                protected mdocDataService: MediaDocDataService, protected actionService: MediaDocActionTagService) {
        super(route, cdocRoutingService, toastr, contentUtils, errorResolver, pageUtils, commonRoutingService, angularMarkdownService,
            angularHtmlService, cd, trackingProvider, appService, platformService, layoutService, environment, mdocDataService);
        this.multiActionManager = new CommonDocMultiActionManager(appService, actionService);
    }

    protected getComponentConfig(config: {}): CommonDocEditpageComponentConfig {
        return {
            baseSearchUrl: ['mdoc'].join('/'),
            baseSearchUrlDefault: ['mdoc'].join('/'),
            editAllowed: (BeanUtils.getValue(config, 'permissions.mdocWritable') === true)
        };
    }

    getFiltersForType(record: MediaDocRecord, type: string): any {
        return (<MediaDocContentUtils>this.contentUtils).getMediaDocSubItemFiltersForType(record, type,
            (this.pdoc ? this.pdoc.theme : undefined));
    }
}
