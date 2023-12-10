import {CommonDocRoutingService} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/services/cdoc-routing.service';
import {CommonRoutingService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/common-routing.service';
import {Injectable} from '@angular/core';

@Injectable()
export class MediaDocRoutingService  extends CommonDocRoutingService {

    constructor(protected commonRoutingService: CommonRoutingService) {
        super(commonRoutingService);
        this.lastSearchUrl = '/mdoc/search/';
        this.lastAdminBaseUrl = '/mdocadmin/';
        this.lastBaseUrl = '/mdoc/';
    }
}
