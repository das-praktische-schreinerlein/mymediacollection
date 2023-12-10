import {ChangeDetectionStrategy, ChangeDetectorRef, Component} from '@angular/core';
import {MediaDocRecord} from '../../../../shared/mdoc-commons/model/records/mdoc-record';
import {SearchFormUtils} from '@dps/mycms-frontend-commons/dist/angular-commons/services/searchform-utils.service';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {FormBuilder} from '@angular/forms';
import {MediaDocDataService} from '../../../../shared/mdoc-commons/services/mdoc-data.service';
import {ToastrService} from 'ngx-toastr';
import {MediaDocAdapterResponseMapper} from '../../../../shared/mdoc-commons/services/mdoc-adapter-response.mapper';
import {
    CommonDocReplaceFormComponent
} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/components/cdoc-replaceform/cdoc-replaceform.component';
import {MediaDocSearchForm} from '../../../../shared/mdoc-commons/model/forms/mdoc-searchform';
import {MediaDocSearchResult} from '../../../../shared/mdoc-commons/model/container/mdoc-searchresult';

@Component({
    selector: 'app-mdoc-replaceform',
    templateUrl: '../../../../../../node_modules/@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/components/cdoc-replaceform/cdoc-replaceform.component.html',
    styleUrls: ['../../../../../../node_modules/@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/components/cdoc-replaceform/cdoc-replaceform.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MediaDocReplaceFormComponent
    extends CommonDocReplaceFormComponent<MediaDocRecord, MediaDocSearchForm, MediaDocSearchResult, MediaDocDataService> {

    constructor(public fb: FormBuilder, public activeModal: NgbActiveModal, protected cd: ChangeDetectorRef,
                searchFormUtils: SearchFormUtils, mdocDataService: MediaDocDataService, toastr: ToastrService) {
        super(fb, activeModal, cd, searchFormUtils, mdocDataService, toastr);
    }

    onCancel(): boolean {
        this.resultObservable.error('canceled');
        this.activeModal.close('Cancel click');
        return false;
    }

    onSubmitAssignKey(): boolean {
        if (!this.checkFormAndSetValidFlag()) {
            return false;
        }

        const me = this;
        this.resultObservable.next({
            action: 'replace',
            ids: me.records.map(value => value.id),
            referenceField: this.getCurrentReferenceField(),
            newId: this.newId,
            newIdSetNull: this.newIdNullFlag});
        this.activeModal.close('Save click');

        return false;
    }

    protected getReferenceNameForRecordType(type: string): string {
        switch (type) {
            case 'AUDIO':
                return 'audio_id_is';
            case 'ALBUM':
                return 'album_id_is';
            case 'GENRE':
                return 'genre_id_is';
            case 'ARTIST':
                return 'artist_id_is';
            default:
                return undefined;
        }

    }

    protected getSearchTypeForRecordType(type: string): string {
        switch (type) {
            case 'ALBUM':
                return 'AUDIO';
            case 'GENRE':
                return 'AUDIO';
            case 'ARTIST':
                return 'AUDIO';
            default:
                return undefined;
        }
    }

    protected generateComparatorName(name: string) {
        name = MediaDocAdapterResponseMapper.generateDoubletteValue(name);
        return name;
    }

}
