import {ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef} from '@angular/core';
import {MediaDocShowpageComponent} from './mdoc-showpage.component';
import {CommonRoutingService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/common-routing.service';
import {ActivatedRoute, Router} from '@angular/router';
import {MediaDocRoutingService} from '../../../../shared/mdoc-commons/services/mdoc-routing.service';
import {ToastrService} from 'ngx-toastr';
import {MediaDocContentUtils} from '../../../shared-mdoc/services/mdoc-contentutils.service';
import {ErrorResolver} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/resolver/error.resolver';
import {PageUtils} from '@dps/mycms-frontend-commons/dist/angular-commons/services/page.utils';
import {AngularMarkdownService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/angular-markdown.service';
import {AngularHtmlService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/angular-html.service';
import {GenericTrackingService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/generic-tracking.service';
import {GenericAppService} from '@dps/mycms-commons/dist/commons/services/generic-app.service';
import {PlatformService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/platform.service';
import {LayoutService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/layout.service';

@Component({
    selector: 'app-mdoc-modal-showpage',
    templateUrl: './mdoc-showpage.component.html',
    styleUrls: ['./mdoc-showpage.component.css', '../../../../../../node_modules/@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/styles/cdoc-modal-showpage.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MediaDocModalShowpageComponent extends MediaDocShowpageComponent {
    constructor(route: ActivatedRoute, cdocRoutingService: MediaDocRoutingService,
                toastr: ToastrService, contentUtils: MediaDocContentUtils,
                errorResolver: ErrorResolver, pageUtils: PageUtils, commonRoutingService: CommonRoutingService,
                angularMarkdownService: AngularMarkdownService, angularHtmlService: AngularHtmlService,
                cd: ChangeDetectorRef, trackingProvider: GenericTrackingService, appService: GenericAppService,
                platformService: PlatformService, layoutService: LayoutService, protected elRef: ElementRef, protected router: Router) {
        super(route, cdocRoutingService, toastr, contentUtils, errorResolver, pageUtils, commonRoutingService,
            angularMarkdownService, angularHtmlService, cd, trackingProvider, appService, platformService,
            layoutService, elRef, router);
        this.modal = true;
    }

    protected configureProcessingOfResolvedData(): void {
        const me = this;
        super.configureProcessingOfResolvedData();
        me.availableTabs = {};
    }

}
