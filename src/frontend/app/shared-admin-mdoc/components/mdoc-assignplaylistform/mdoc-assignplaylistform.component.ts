import {ChangeDetectionStrategy, ChangeDetectorRef, Component} from '@angular/core';
import {MediaDocRecord} from '../../../../shared/mdoc-commons/model/records/mdoc-record';
import {MediaDocSearchForm} from '../../../../shared/mdoc-commons/model/forms/mdoc-searchform';
import {MediaDocSearchResult} from '../../../../shared/mdoc-commons/model/container/mdoc-searchresult';
import {MediaDocDataService} from '../../../../shared/mdoc-commons/services/mdoc-data.service';
import {FormBuilder} from '@angular/forms';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {SearchFormUtils} from '@dps/mycms-frontend-commons/dist/angular-commons/services/searchform-utils.service';
import {ToastrService} from 'ngx-toastr';
import {
    CommonDocAssignPlaylistFormComponent
} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/components/cdoc-assignplaylistform/cdoc-assignplaylistform.component';
import {GenericAppService} from '@dps/mycms-commons/dist/commons/services/generic-app.service';

@Component({
    selector: 'app-mdoc-assignplaylistform',
    templateUrl: '../../../../../../node_modules/@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/components/cdoc-assignplaylistform/cdoc-assignplaylistform.component.html',
    styleUrls: ['../../../../../../node_modules/@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/components/cdoc-assignplaylistform/cdoc-assignplaylistform.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MediaDocAssignPlaylistFormComponent
    extends CommonDocAssignPlaylistFormComponent<MediaDocRecord, MediaDocSearchForm, MediaDocSearchResult, MediaDocDataService> {

    constructor(public fb: FormBuilder, public activeModal: NgbActiveModal, protected cd: ChangeDetectorRef,
                searchFormUtils: SearchFormUtils, mdocDataService: MediaDocDataService, toastr: ToastrService,
                appService: GenericAppService) {
        super(fb, activeModal, cd, searchFormUtils, mdocDataService, toastr, appService);
    }

    protected getReferenceNameForRecordType(type: string): string {
        switch (type) {
            case 'AUDIO':
            case undefined:
                return 'playlists_max_txt';
            default:
                return undefined;
        }
    }
}
