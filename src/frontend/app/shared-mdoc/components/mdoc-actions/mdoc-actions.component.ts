import {ChangeDetectionStrategy, ChangeDetectorRef, Component} from '@angular/core';
import {MediaDocRecord} from '../../../../shared/mdoc-commons/model/records/mdoc-record';
import {MediaDocDynamicComponentService} from '../../services/mdoc-dynamic-components.service';
import {MediaDocDataService} from '../../../../shared/mdoc-commons/services/mdoc-data.service';
import {ToastrService} from 'ngx-toastr';
import {CommonDocActionsComponent} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/components/cdoc-actions/cdoc-actions.component';
import {MediaDocSearchForm} from '../../../../shared/mdoc-commons/model/forms/mdoc-searchform';
import {MediaDocSearchResult} from '../../../../shared/mdoc-commons/model/container/mdoc-searchresult';
import {GenericAppService} from '@dps/mycms-commons/dist/commons/services/generic-app.service';
import {MediaDocActionTagService} from '../../services/mdoc-actiontag.service';

@Component({
    selector: 'app-mdoc-action',
    templateUrl: './../../../../../../node_modules/@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/components/cdoc-actions/cdoc-actions.component.html',
    styleUrls: ['./../../../../../../node_modules/@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/components/cdoc-actions/cdoc-actions.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MediaDocActionsComponent extends CommonDocActionsComponent<MediaDocRecord, MediaDocSearchForm, MediaDocSearchResult, MediaDocDataService> {
    constructor(protected dynamicComponentService: MediaDocDynamicComponentService,
                protected mdocDataService: MediaDocDataService, protected toastr: ToastrService,
                protected cd: ChangeDetectorRef, protected appService: GenericAppService,
                protected actionTagService: MediaDocActionTagService) {
        super(dynamicComponentService, toastr, cd, appService, actionTagService);
    }
}
