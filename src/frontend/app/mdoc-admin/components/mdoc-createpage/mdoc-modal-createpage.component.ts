import {ChangeDetectionStrategy, ChangeDetectorRef, Component} from '@angular/core';
import {MediaDocCreatepageComponent} from './mdoc-createpage.component';
import {ActivatedRoute, Router} from '@angular/router';
import {MediaDocRoutingService} from '../../../../shared/mdoc-commons/services/mdoc-routing.service';
import {ToastrService} from 'ngx-toastr';
import {MediaDocContentUtils} from '../../../shared-mdoc/services/mdoc-contentutils.service';
import {ErrorResolver} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/resolver/error.resolver';
import {PageUtils} from '@dps/mycms-frontend-commons/dist/angular-commons/services/page.utils';
import {CommonRoutingService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/common-routing.service';
import {AngularMarkdownService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/angular-markdown.service';
import {AngularHtmlService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/angular-html.service';
import {GenericTrackingService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/generic-tracking.service';
import {GenericAppService} from '@dps/mycms-commons/dist/commons/services/generic-app.service';
import {PlatformService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/platform.service';
import {LayoutService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/layout.service';
import {MediaDocDataService} from '../../../../shared/mdoc-commons/services/mdoc-data.service';
import {MediaDocRecord} from '../../../../shared/mdoc-commons/model/records/mdoc-record';

@Component({
    selector: 'app-mdoc-modal-createpage',
    templateUrl: './mdoc-modal-createpage.component.html',
    styleUrls: ['./mdoc-createpage.component.css',
        '../../../../../../node_modules/@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/styles/cdoc-modal-createpage.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MediaDocModalCreatepageComponent extends MediaDocCreatepageComponent {

    constructor(protected route: ActivatedRoute, protected cdocRoutingService: MediaDocRoutingService,
                protected toastr: ToastrService, contentUtils: MediaDocContentUtils,
                protected errorResolver: ErrorResolver, protected pageUtils: PageUtils,
                protected commonRoutingService: CommonRoutingService, protected angularMarkdownService: AngularMarkdownService,
                protected angularHtmlService: AngularHtmlService, protected cd: ChangeDetectorRef,
                protected trackingProvider: GenericTrackingService, protected appService: GenericAppService,
                protected platformService: PlatformService, protected layoutService: LayoutService,
                protected mdocDataService: MediaDocDataService, router: Router) {
        super(route, cdocRoutingService, toastr, contentUtils, errorResolver, pageUtils, commonRoutingService,
            angularMarkdownService, angularHtmlService, cd, trackingProvider, appService,
            platformService, layoutService, mdocDataService, router);
        this.modal = true;
    }

    submitSave(values: {}) {
        const me = this;
        this.cdocDataService.add(values).then(function doneDocCreated(cdoc: MediaDocRecord) {
                me.closeModal();
            },
            function errorCreate(reason: any) {
                console.error('create add failed:', reason);
                me.toastr.error('Es gibt leider Probleme bei der Speichern - am besten noch einmal probieren :-(', 'Oje!');
            }
        );
        return false;
    }

}
