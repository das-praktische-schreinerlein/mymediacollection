import {Injectable} from '@angular/core';
import {MediaDocSearchFormConverter} from '../../shared-mdoc/services/mdoc-searchform-converter.service';
import {MediaDocSearchForm} from '../../../shared/mdoc-commons/model/forms/mdoc-searchform';
import {GenericAppService} from '@dps/mycms-commons/dist/commons/services/generic-app.service';
import {CommonSectionSearchFormResolver} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/resolver/cdoc-section-searchform.resolver';

@Injectable()
export class SectionsSearchFormResolver extends CommonSectionSearchFormResolver<MediaDocSearchForm> {
    constructor(appService: GenericAppService, searchFormConverter: MediaDocSearchFormConverter) {
        super(appService, searchFormConverter);
    }
}
