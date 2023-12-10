import {ChangeDetectionStrategy, ChangeDetectorRef, Component} from '@angular/core';
import {LayoutService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/layout.service';
import {CommonDocListItemComponent} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/components/cdoc-list-item/cdoc-list-item.component';
import {MediaDocContentUtils} from '../../services/mdoc-contentutils.service';

@Component({
    selector: 'app-mdoc-list-item',
    templateUrl: './mdoc-list-item.component.html',
    styleUrls: ['./mdoc-list-item.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MediaDocListItemComponent  extends CommonDocListItemComponent {
    constructor(contentUtils: MediaDocContentUtils, cd: ChangeDetectorRef, layoutService: LayoutService) {
        super(contentUtils, cd, layoutService);
        this.listLayoutName = 'default';
    }

}
