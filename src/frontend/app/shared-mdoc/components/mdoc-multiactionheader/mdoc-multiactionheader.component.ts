import {ChangeDetectionStrategy, ChangeDetectorRef, Component} from '@angular/core';
import {MediaDocRecord} from '../../../../shared/mdoc-commons/model/records/mdoc-record';
import {MediaDocDataService} from '../../../../shared/mdoc-commons/services/mdoc-data.service';
import {MediaDocSearchForm} from '../../../../shared/mdoc-commons/model/forms/mdoc-searchform';
import {MediaDocSearchResult} from '../../../../shared/mdoc-commons/model/container/mdoc-searchresult';
import {GenericAppService} from '@dps/mycms-commons/dist/commons/services/generic-app.service';
import {MediaDocContentUtils} from '../../services/mdoc-contentutils.service';
import {
    CommonDocMultiActionHeaderComponent,
    CommonDocMultiActionHeaderComponentConfig
} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/components/cdoc-multiactionheader/cdoc-multiactionheader.component';
import {BeanUtils} from '@dps//mycms-commons/dist/commons/utils/bean.utils';

@Component({
    selector: 'app-mdoc-multiactionheader',
    templateUrl: '../../../../../../node_modules/@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/components/cdoc-multiactionheader/cdoc-multiactionheader.component.html',
    styleUrls: ['../../../../../../node_modules/@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/components/cdoc-multiactionheader/cdoc-multiactionheader.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MediaDocMultiActionHeaderComponent extends
    CommonDocMultiActionHeaderComponent<MediaDocRecord, MediaDocSearchForm, MediaDocSearchResult, MediaDocDataService> {
    constructor(protected appService: GenericAppService, protected contentUtils: MediaDocContentUtils, protected cd: ChangeDetectorRef) {
        super(appService, contentUtils, cd);
    }

    protected getComponentConfig(config: {}): CommonDocMultiActionHeaderComponentConfig {
        if (BeanUtils.getValue(config, 'components.mdoc-multiactionheader.actionTags')) {
            return {
                tagConfigs: config['components']['mdoc-multiactionheader']['actionTags']
            };
        } else {
            console.warn('no valid tagConfigs found');
            return {
                tagConfigs: []
            };
        }
    }

}
