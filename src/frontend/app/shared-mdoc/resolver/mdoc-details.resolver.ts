import {Injectable} from '@angular/core';
import {GenericAppService} from '@dps/mycms-commons/dist/commons/services/generic-app.service';
import {MediaDocDataService} from '../../../shared/mdoc-commons/services/mdoc-data.service';
import {MediaDocRecord} from '../../../shared/mdoc-commons/model/records/mdoc-record';
import {CommonDocRecordResolver} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/resolver/cdoc-details.resolver';
import {MediaDocSearchForm} from '../../../shared/mdoc-commons/model/forms/mdoc-searchform';
import {MediaDocSearchResult} from '../../../shared/mdoc-commons/model/container/mdoc-searchresult';

@Injectable()
export class MediaDocRecordResolver extends CommonDocRecordResolver<MediaDocRecord, MediaDocSearchForm, MediaDocSearchResult,
    MediaDocDataService> {
    constructor(appService: GenericAppService, dataService: MediaDocDataService) {
        super(appService, dataService);
    }
}
