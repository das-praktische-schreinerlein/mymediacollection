import {ChangeDetectionStrategy, ChangeDetectorRef, Component} from '@angular/core';
import {LayoutService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/layout.service';
import {MediaDocContentUtils} from '../../services/mdoc-contentutils.service';
import {MediaDocListItemComponent} from '../mdoc-list-item/mdoc-list-item.component';

@Component({
    selector: 'app-mdoc-list-item-flat',
    templateUrl: './mdoc-list-item-flat.component.html',
    styleUrls: ['./mdoc-list-item-flat.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MediaDocListItemFlatComponent  extends MediaDocListItemComponent {
    constructor(contentUtils: MediaDocContentUtils, cd: ChangeDetectorRef, layoutService: LayoutService) {
        super(contentUtils, cd, layoutService);
        this.listLayoutName = 'flat';
    }
}
