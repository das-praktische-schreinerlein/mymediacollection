import {Injectable} from '@angular/core';
import {Lightbox} from 'ngx-lightbox';
import {CommonDocLightBoxService} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/services/cdoc-lightbox.service';
import {MediaDocSearchResult} from '../../../shared/mdoc-commons/model/container/mdoc-searchresult';
import {MediaDocSearchForm} from '../../../shared/mdoc-commons/model/forms/mdoc-searchform';
import {MediaDocRecord} from '../../../shared/mdoc-commons/model/records/mdoc-record';
import {MediaDocContentUtils} from './mdoc-contentutils.service';

@Injectable()
export class MediaDocLightBoxService extends CommonDocLightBoxService<MediaDocRecord, MediaDocSearchForm, MediaDocSearchResult> {
    constructor(protected contentUtils: MediaDocContentUtils, protected lightbox: Lightbox) {
        super(contentUtils, lightbox);
    }
}
