import {ChangeDetectionStrategy, ChangeDetectorRef, Component} from '@angular/core';
import {MediaDocDataService} from '../../../../shared/mdoc-commons/services/mdoc-data.service';
import {MediaDocRecord} from '../../../../shared/mdoc-commons/model/records/mdoc-record';
import {ActivatedRoute} from '@angular/router';
import {MediaDocSearchForm} from '../../../../shared/mdoc-commons/model/forms/mdoc-searchform';
import {MediaDocSearchResult} from '../../../../shared/mdoc-commons/model/container/mdoc-searchresult';
import {MediaDocSearchFormConverter} from '../../../shared-mdoc/services/mdoc-searchform-converter.service';
import {ToastrService} from 'ngx-toastr';
import {ErrorResolver} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/resolver/error.resolver';
import {GenericAppService} from '@dps/mycms-commons/dist/commons/services/generic-app.service';
import {PageUtils} from '@dps/mycms-frontend-commons/dist/angular-commons/services/page.utils';
import {CommonRoutingService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/common-routing.service';
import {GenericTrackingService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/generic-tracking.service';
import {FormBuilder} from '@angular/forms';
import {MediaDocAlbumService} from '../../../shared-mdoc/services/mdoc-album.service';
import {BeanUtils} from '@dps/mycms-commons/dist/commons/utils/bean.utils';
import {MediaDocRoutingService} from '../../../../shared/mdoc-commons/services/mdoc-routing.service';
import {
    CommonDocAlbumpageComponent,
    CommonDocAlbumpageComponentConfig
} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/components/cdoc-albumpage/cdoc-albumpage.component';
import {PlatformService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/platform.service';
import {LayoutService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/layout.service';
import {environment} from '../../../../environments/environment';
import {MediaDocPlaylistService} from '../../../shared-mdoc/services/mdoc-playlist.service';
import {CommonDocMultiActionManager} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/services/cdoc-multiaction.manager';
import {MediaDocActionTagService} from '../../../shared-mdoc/services/mdoc-actiontag.service';
import {SearchFormUtils} from '@dps/mycms-frontend-commons/dist/angular-commons/services/searchform-utils.service';
import {MediaDocSearchFormUtils} from '../../../shared-mdoc/services/mdoc-searchform-utils.service';

@Component({
    selector: 'app-mdoc-albumpage',
    templateUrl: './mdoc-albumpage.component.html',
    styleUrls: ['../../../../../../node_modules/@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/components/cdoc-albumpage/cdoc-albumpage.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MediaDocAlbumpageComponent
    extends CommonDocAlbumpageComponent<MediaDocRecord, MediaDocSearchForm, MediaDocSearchResult, MediaDocDataService> {

    constructor(route: ActivatedRoute, commonRoutingService: CommonRoutingService,
                errorResolver: ErrorResolver, cdocDataService: MediaDocDataService,
                searchFormConverter: MediaDocSearchFormConverter, cdocRoutingService: MediaDocRoutingService,
                toastr: ToastrService, pageUtils: PageUtils, cd: ChangeDetectorRef,
                trackingProvider: GenericTrackingService, fb: FormBuilder, cdocAlbumService: MediaDocAlbumService,
                appService: GenericAppService, platformService: PlatformService, layoutService: LayoutService,
                searchFormUtils: SearchFormUtils, mdocSearchFormUtils: MediaDocSearchFormUtils,
                playlistService: MediaDocPlaylistService, protected actionService: MediaDocActionTagService) {
        super(route, commonRoutingService, errorResolver, cdocDataService, searchFormConverter, cdocRoutingService, toastr,
            pageUtils, cd, trackingProvider, fb, cdocAlbumService, appService, platformService, layoutService,
            searchFormUtils, mdocSearchFormUtils, playlistService, new CommonDocMultiActionManager(appService, actionService), environment);
    }

    protected getComponentConfig(config: {}): CommonDocAlbumpageComponentConfig {
        return {
            baseAlbumUrl: 'mdoc/album',
            baseSearchUrl: ['mdoc', ''].join('/'),
            baseSearchUrlDefault: ['mdoc', ''].join('/'),
            maxAllowedItems: config && config['mdocMaxItemsPerAlbum'] >= 0 ? config['mdocMaxItemsPerAlbum'] : -1,
            autoPlayAllowed: BeanUtils.getValue(config, 'permissions.allowAutoPlay') &&
                BeanUtils.getValue(config, 'components.mdoc-albumpage.allowAutoplay') + '' === 'true',
            m3uAvailable: BeanUtils.getValue(config, 'permissions.m3uAvailable') &&
                BeanUtils.getValue(config, 'components.mdoc-albumpage.m3uAvailable') + '' === 'true'
        };
    }
}
