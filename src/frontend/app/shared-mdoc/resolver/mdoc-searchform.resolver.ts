import {Injectable} from '@angular/core';
import {MediaDocSearchFormConverter} from '../services/mdoc-searchform-converter.service';
import {MediaDocSearchForm} from '../../../shared/mdoc-commons/model/forms/mdoc-searchform';
import {GenericAppService} from '@dps/mycms-commons/dist/commons/services/generic-app.service';
import {CommonDocSearchFormResolver} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/resolver/cdoc-searchform.resolver';

@Injectable()
export class MediaDocSearchFormResolver extends CommonDocSearchFormResolver<MediaDocSearchForm> {
    constructor(appService: GenericAppService, searchFormConverter: MediaDocSearchFormConverter) {
        super(appService, searchFormConverter);
    }
}
