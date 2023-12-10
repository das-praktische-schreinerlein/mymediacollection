import {Injectable} from '@angular/core';
import {MediaDocDataService} from '../../../shared/mdoc-commons/services/mdoc-data.service';
import {MediaDocSearchResult} from '../../../shared/mdoc-commons/model/container/mdoc-searchresult';
import {MediaDocSearchForm} from '../../../shared/mdoc-commons/model/forms/mdoc-searchform';
import {MediaDocRecord} from '../../../shared/mdoc-commons/model/records/mdoc-record';
import {CommonDocDataCacheService} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/services/cdoc-datacache.service';

@Injectable()
export class MediaDocDataCacheService extends CommonDocDataCacheService<MediaDocRecord, MediaDocSearchForm, MediaDocSearchResult,
    MediaDocDataService> {
    constructor(private mdocDataService: MediaDocDataService) {
        super(mdocDataService);
    }
}
