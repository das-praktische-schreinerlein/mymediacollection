import {ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Input} from '@angular/core';
import {MediaDocDataService} from '../../../../shared/mdoc-commons/services/mdoc-data.service';
import {MediaDocRecord} from '../../../../shared/mdoc-commons/model/records/mdoc-record';
import {MediaDocSearchForm} from '../../../../shared/mdoc-commons/model/forms/mdoc-searchform';
import {MediaDocSearchResult} from '../../../../shared/mdoc-commons/model/container/mdoc-searchresult';
import {MediaDocSearchFormConverter} from '../../services/mdoc-searchform-converter.service';
import {ToastrService} from 'ngx-toastr';
import {GenericAppService} from '@dps/mycms-commons/dist/commons/services/generic-app.service';
import {CommonRoutingService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/common-routing.service';
import {PageUtils} from '@dps/mycms-frontend-commons/dist/angular-commons/services/page.utils';
import {CommonDocInlineSearchpageComponent} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/components/cdoc-inline-searchpage/cdoc-inline-searchpage.component';
import {MediaDocRoutingService} from '../../../../shared/mdoc-commons/services/mdoc-routing.service';
import {MediaDocActionTagService} from '../../services/mdoc-actiontag.service';
import {MediaDocSearchFormUtils} from '../../services/mdoc-searchform-utils.service';
import {SearchFormUtils} from '@dps/mycms-frontend-commons/dist/angular-commons/services/searchform-utils.service';
import {CommonDocMultiActionManager} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/services/cdoc-multiaction.manager';

@Component({
    selector: 'app-mdoc-inline-searchpage',
    templateUrl: './mdoc-inline-searchpage.component.html',
    styleUrls: ['./mdoc-inline-searchpage.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MediaDocInlineSearchpageComponent extends
    CommonDocInlineSearchpageComponent<MediaDocRecord, MediaDocSearchForm, MediaDocSearchResult, MediaDocDataService> {

    @Input()
    public baseSearchUrl ? = 'mdoc/';

    constructor(appService: GenericAppService, commonRoutingService: CommonRoutingService,
                mdocDataService: MediaDocDataService, searchFormConverter: MediaDocSearchFormConverter,
                cdocRoutingService: MediaDocRoutingService, toastr: ToastrService,
                cd: ChangeDetectorRef, elRef: ElementRef, pageUtils: PageUtils, searchFormUtils: SearchFormUtils,
                mdocSearchFormUtils: MediaDocSearchFormUtils, protected actionService: MediaDocActionTagService) {
        super(appService, commonRoutingService, mdocDataService, searchFormConverter, cdocRoutingService,
            toastr, cd, elRef, pageUtils, searchFormUtils, mdocSearchFormUtils,
            new CommonDocMultiActionManager(appService, actionService));
    }
}
