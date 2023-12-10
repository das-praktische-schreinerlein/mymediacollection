import {ChangeDetectionStrategy, ChangeDetectorRef, Component} from '@angular/core';
import {GenericAppService} from '@dps/mycms-commons/dist/commons/services/generic-app.service';
import {
    CommonDocKeywordsComponent,
    CommonDocKeywordsComponentConfig
} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/components/cdoc-keywords/cdoc-keywords.component';
import {BeanUtils} from '@dps/mycms-commons/dist/commons/utils/bean.utils';

@Component({
    selector: 'app-mdoc-keywords',
    templateUrl: './../../../../../../node_modules/@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/components/cdoc-keywords/cdoc-keywords.component.html',
    styleUrls: ['./../../../../../../node_modules/@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/components/cdoc-keywords/cdoc-keywords.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MediaDocKeywordsComponent extends CommonDocKeywordsComponent {
    constructor(protected appService: GenericAppService, protected cd: ChangeDetectorRef) {
        super(appService, cd);
    }

    protected getComponentConfig(config: {}): CommonDocKeywordsComponentConfig {
        if (BeanUtils.getValue(config, 'components.mdoc-keywords.structuredKeywords')) {
            return {
                keywordsConfig: BeanUtils.getValue(config, 'components.mdoc-keywords.structuredKeywords'),
                possiblePrefixes: BeanUtils.getValue(config, 'components.mdoc-keywords.possiblePrefixes'),
                blacklist: BeanUtils.getValue(config, 'components.mdoc-keywords.blacklist')
            };
        } else {
            console.warn('no valid keywordsConfig found for components.mdoc-keywords.structuredKeywords');
            return {
                keywordsConfig: [],
                possiblePrefixes: [],
                blacklist: []
            };
        }
    }
}
