import {ChangeDetectionStrategy, ChangeDetectorRef, Component} from '@angular/core';
import {MediaDocRecord} from '../../../../shared/mdoc-commons/model/records/mdoc-record';
import {MediaDocSearchForm} from '../../../../shared/mdoc-commons/model/forms/mdoc-searchform';
import {MediaDocSearchResult} from '../../../../shared/mdoc-commons/model/container/mdoc-searchresult';
import {MediaDocDataService} from '../../../../shared/mdoc-commons/services/mdoc-data.service';
import {FormBuilder} from '@angular/forms';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {SearchFormUtils} from '@dps/mycms-frontend-commons/dist/angular-commons/services/searchform-utils.service';
import {ToastrService} from 'ngx-toastr';
import {IMultiSelectOption} from 'angular-2-dropdown-multiselect';
import {
    CommonDocAssignJoinFormComponent
} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/components/cdoc-assignjoinform/cdoc-assignjoinform.component';

@Component({
    selector: 'app-mdoc-assignform',
    templateUrl: '../../../../../../node_modules/@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/components/cdoc-assignjoinform/cdoc-assignjoinform.component.html',
    styleUrls: ['../../../../../../node_modules/@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/components/cdoc-assignjoinform/cdoc-assignjoinform.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MediaDocAssignJoinFormComponent
    extends CommonDocAssignJoinFormComponent<MediaDocRecord, MediaDocSearchForm, MediaDocSearchResult, MediaDocDataService> {

    constructor(public fb: FormBuilder, public activeModal: NgbActiveModal, protected cd: ChangeDetectorRef,
                searchFormUtils: SearchFormUtils, mdocDataService: MediaDocDataService, toastr: ToastrService) {
        super(fb, activeModal, cd, searchFormUtils, mdocDataService, toastr);
    }

    protected getReferenceNamesForRecordType(type: string): string[] {
        switch (type) {
            case 'ALBUM':
                return ['artist_id_is'];
            default:
                return undefined;
        }
    }

    protected generateSelectIdValues(facetName: string, keyValues: any[]): IMultiSelectOption[] {
        return super.generateSelectIdValues(facetName, keyValues);
    }
}
