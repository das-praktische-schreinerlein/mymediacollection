import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input} from '@angular/core';
import {MediaDocRoutingService} from '../../../../shared/mdoc-commons/services/mdoc-routing.service';
import {CommonDocSimpleSearchNavigationComponent} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/components/cdoc-simple-search-navigation/cdoc-simple-search-navigation.component';

@Component({
    selector: 'app-mdoc-simple-search-navigation',
    templateUrl: './../../../../../../node_modules/@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/components/cdoc-simple-search-navigation/cdoc-simple-search-navigation.component.html',
    styleUrls: ['./../../../../../../node_modules/@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/components/cdoc-simple-search-navigation/cdoc-simple-search-navigation.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MediaDocSimpleSearchNavigationComponent extends CommonDocSimpleSearchNavigationComponent {

    @Input()
    public baseSearchUrl? = 'mdoc/';

    constructor(cdocRoutingService: MediaDocRoutingService, cd: ChangeDetectorRef) {
        super(cdocRoutingService, cd);
    }
}
