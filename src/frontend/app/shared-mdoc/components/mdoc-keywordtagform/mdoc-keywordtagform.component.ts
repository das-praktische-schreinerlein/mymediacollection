import {ChangeDetectionStrategy, ChangeDetectorRef, Component} from '@angular/core';
import {MediaDocRecord} from '../../../../shared/mdoc-commons/model/records/mdoc-record';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {FormBuilder} from '@angular/forms';
import {ToastrService} from 'ngx-toastr';
import {CommonDocKeywordTagFormComponent} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/components/cdoc-keywordtagform/cdoc-keywordtagform.component';

@Component({
    selector: 'app-mdoc-keywordtagform',
    templateUrl: './../../../../../../node_modules/@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/components/cdoc-keywordtagform/cdoc-keywordtagform.component.html',
    styleUrls: ['./../../../../../../node_modules/@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/components/cdoc-keywordtagform/cdoc-keywordtagform.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MediaDocKeywordTagFormComponent
    extends CommonDocKeywordTagFormComponent<MediaDocRecord> {

    constructor(public fb: FormBuilder, public activeModal: NgbActiveModal, protected cd: ChangeDetectorRef, toastr: ToastrService) {
        super(fb, activeModal, cd, toastr);
    }

}
