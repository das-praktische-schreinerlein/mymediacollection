import {Injectable} from '@angular/core';
import {GenericAppService} from '@dps/mycms-commons/dist/commons/services/generic-app.service';
import {MediaDocRecord} from '../../../shared/mdoc-commons/model/records/mdoc-record';
import {MediaDocDataService} from '../../../shared/mdoc-commons/services/mdoc-data.service';
import {CommonDocRecordCreateResolver} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/resolver/cdoc-create.resolver';
import {MediaDocSearchForm} from '../../../shared/mdoc-commons/model/forms/mdoc-searchform';
import {MediaDocSearchResult} from '../../../shared/mdoc-commons/model/container/mdoc-searchresult';

@Injectable()
export class MediaDocRecordCreateResolver extends CommonDocRecordCreateResolver<MediaDocRecord, MediaDocSearchForm,
    MediaDocSearchResult, MediaDocDataService> {
    constructor(appService: GenericAppService, dataService: MediaDocDataService) {
        super(appService, dataService);
    }

    protected configureDefaultFieldToSet(type: string, fields: string[]): void {
        switch (type.toLocaleLowerCase()) {
            case 'audio':
                break;
        }
    }

    protected copyDefaultFields(type: string, mdoc: MediaDocRecord, values: {}): void {
    }

    protected setDefaultFields(type: string, values: {}): void {
    }
}
