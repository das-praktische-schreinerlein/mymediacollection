import {ChangeDetectionStrategy, ChangeDetectorRef, Component} from '@angular/core';
import {GenericAppService} from '@dps/mycms-commons/dist/commons/services/generic-app.service';
import {MediaDocAlbumService} from '../../services/mdoc-album.service';
import {MediaDocContentUtils} from '../../services/mdoc-contentutils.service';
import {
    CommonDocActionTagsComponent,
    CommonDocActionTagsComponentConfig
} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/components/cdoc-actiontags/cdoc-actiontags.component';
import {BeanUtils} from '@dps/mycms-commons/dist/commons/utils/bean.utils';

@Component({
    selector: 'app-mdoc-actiontags',
    templateUrl: './../../../../../../node_modules/@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/components/cdoc-actiontags/cdoc-actiontags.component.html',
    styleUrls: ['./../../../../../../node_modules/@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/components/cdoc-actiontags/cdoc-actiontags.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MediaDocActionTagsComponent extends CommonDocActionTagsComponent {
    constructor(protected appService: GenericAppService, protected contentUtils: MediaDocContentUtils,
                protected mdocAlbumService: MediaDocAlbumService, protected cd: ChangeDetectorRef) {
        super(appService, contentUtils, mdocAlbumService, cd);
    }

    protected getComponentConfig(config: {}): CommonDocActionTagsComponentConfig {
        if (BeanUtils.getValue(config, 'components.mdoc-actions.actionTags')) {
            return {
                tagConfigs: config['components']['mdoc-actions']['actionTags']
            };
        } else {
            console.warn('no valid tagConfigs found');
            return {
                tagConfigs: []
            };
        }
    }
}
