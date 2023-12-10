import {ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, Output} from '@angular/core';
import {MediaDocRecord} from '../../../../shared/mdoc-commons/model/records/mdoc-record';
import {MediaDocSearchResult} from '../../../../shared/mdoc-commons/model/container/mdoc-searchresult';
import {MediaDocSearchFormConverter} from '../../services/mdoc-searchform-converter.service';
import {Layout} from '@dps/mycms-frontend-commons/dist/angular-commons/services/layout.service';
import {MediaDocSearchForm} from '../../../../shared/mdoc-commons/model/forms/mdoc-searchform';
import {CommonDocListComponent} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/components/cdoc-list/cdoc-list.component';

@Component({
    selector: 'app-mdoc-list',
    templateUrl: './mdoc-list.component.html',
    styleUrls: ['./../../../../../../node_modules/@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/components/cdoc-list/cdoc-list.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MediaDocListComponent extends CommonDocListComponent<MediaDocRecord, MediaDocSearchForm, MediaDocSearchResult> {
    public Layout = Layout;

    constructor(private searchFormConverter: MediaDocSearchFormConverter, protected cd: ChangeDetectorRef) {
        super(cd);
    }

    getBackToSearchUrl(searchResult: MediaDocSearchResult): string {
        return (searchResult.searchForm ?
            this.searchFormConverter.searchFormToUrl(this.baseSearchUrl, searchResult.searchForm) : undefined);
    }

    protected updateData(): void {
        super.updateData();
        this.cd.markForCheck();
    }
}
