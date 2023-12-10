import {ChangeDetectionStrategy, ChangeDetectorRef, Component} from '@angular/core';
import {MediaDocDataService} from '../../../../shared/mdoc-commons/services/mdoc-data.service';
import {MediaDocRecord} from '../../../../shared/mdoc-commons/model/records/mdoc-record';
import {ActivatedRoute} from '@angular/router';
import {MediaDocSearchForm} from '../../../../shared/mdoc-commons/model/forms/mdoc-searchform';
import {MediaDocSearchResult} from '../../../../shared/mdoc-commons/model/container/mdoc-searchresult';
import {MediaDocSearchFormConverter} from '../../../shared-mdoc/services/mdoc-searchform-converter.service';
import {ToastrService} from 'ngx-toastr';
import {LayoutService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/layout.service';
import {ErrorResolver} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/resolver/error.resolver';
import {PageUtils} from '@dps/mycms-frontend-commons/dist/angular-commons/services/page.utils';
import {CommonRoutingService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/common-routing.service';
import {GenericTrackingService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/generic-tracking.service';
import {PlatformService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/platform.service';
import {
    CommonDocSearchpageComponent,
    CommonDocSearchpageComponentConfig
} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/components/cdoc-searchpage.component';
import {MediaDocRoutingService} from '../../../../shared/mdoc-commons/services/mdoc-routing.service';
import {GenericAppService} from '@dps/mycms-commons/dist/commons/services/generic-app.service';
import {environment} from '../../../../environments/environment';
import {CommonDocMultiActionManager} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/services/cdoc-multiaction.manager';
import {MediaDocActionTagService} from '../../../shared-mdoc/services/mdoc-actiontag.service';
import {MediaDocSearchFormUtils} from '../../../shared-mdoc/services/mdoc-searchform-utils.service';
import {SearchFormUtils} from '@dps/mycms-frontend-commons/dist/angular-commons/services/searchform-utils.service';
import {Location} from '@angular/common';
import {BeanUtils} from '@dps/mycms-commons/dist/commons/utils/bean.utils';

@Component({
    selector: 'app-mdoc-searchpage',
    templateUrl: './mdoc-searchpage.component.html',
    styleUrls: ['./mdoc-searchpage.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MediaDocSearchpageComponent extends CommonDocSearchpageComponent<MediaDocRecord, MediaDocSearchForm, MediaDocSearchResult,
    MediaDocDataService> {

    defaultLayoutPerType = {
        'ALBUM': 'BIG',
        'ARTIST': 'BIG',
        'AUDIO': 'BIG',
        'GENRE': 'BIG',
        'PLAYLIST': 'BIG'
    };

    constructor(route: ActivatedRoute, commonRoutingService: CommonRoutingService, errorResolver: ErrorResolver,
                mdocDataService: MediaDocDataService, searchFormConverter: MediaDocSearchFormConverter,
                cdocRoutingService: MediaDocRoutingService, toastr: ToastrService, pageUtils: PageUtils,
                cd: ChangeDetectorRef, trackingProvider: GenericTrackingService, appService: GenericAppService,
                platformService: PlatformService, layoutService: LayoutService, searchFormUtils: SearchFormUtils,
                mdocSearchFormUtils: MediaDocSearchFormUtils, protected actionService: MediaDocActionTagService,
                protected location: Location) {
        super(route, commonRoutingService, errorResolver, mdocDataService, searchFormConverter, cdocRoutingService,
            toastr, pageUtils, cd, trackingProvider, appService, platformService, layoutService, searchFormUtils,
            mdocSearchFormUtils, new CommonDocMultiActionManager(appService, actionService), environment, location);
    }

    protected getComponentConfig(config: {}): CommonDocSearchpageComponentConfig {
        return {
            baseSearchUrl: ['mdoc'].join('/'),
            baseSearchUrlDefault: ['mdoc'].join('/'),
            availableCreateActionTypes: ['ALBUM', 'GENRE', 'ARTIST', 'PLAYLIST', 'album', 'genre', 'artist', 'playlist'],
            defaultLayoutPerType: this.defaultLayoutPerType,
            maxAllowedM3UExportItems: BeanUtils.getValue(config, 'services.serverItemExport.maxAllowedM3UItems')
        };
    }

    protected doProcessAfterResolvedData(config: {}): void {
    }

    protected doPreChecksBeforeSearch(): boolean {
        return super.doPreChecksBeforeSearch();
    }

    onCreateNewRecord(type: string) {
        this.cdocRoutingService.navigateToCreate(type, null, null);
        return false;
    }

}
