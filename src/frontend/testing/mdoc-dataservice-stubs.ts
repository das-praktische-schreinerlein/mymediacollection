import {Injectable} from '@angular/core';
import {MediaDocSearchForm} from '../shared/mdoc-commons/model/forms/mdoc-searchform';
import {MediaDocSearchResult} from '../shared/mdoc-commons/model/container/mdoc-searchresult';
import {Facets} from '@dps/mycms-commons/dist/search-commons/model/container/facets';
import {MediaDocRecord} from '../shared/mdoc-commons/model/records/mdoc-record';

@Injectable()
export class MediaDocDataServiceStub {
    static defaultSearchResult(): MediaDocSearchResult {
        return new MediaDocSearchResult(
            new MediaDocSearchForm({}), 1, [ new MediaDocRecord({id: '1', name: 'Test'})], new Facets());
    }

    static defaultRecord(): MediaDocRecord {
        return new MediaDocRecord({id: '1', name: 'Test'});
    }

    cloneSanitizedSearchForm(values: MediaDocSearchForm): MediaDocSearchForm {
        return new MediaDocSearchForm(values);
    }

    newSearchForm(values: {}): MediaDocSearchForm {
        return new MediaDocSearchForm(values);
    }

    search(searchForm: MediaDocSearchForm): Promise<MediaDocSearchResult> {
        return Promise.resolve(new MediaDocSearchResult(searchForm, 0, [], new Facets()));
    }

    newSearchResult(mdocSearchForm: MediaDocSearchForm, recordCount: number,
                    currentRecords: MediaDocRecord[], facets: Facets): MediaDocSearchResult {
        return new MediaDocSearchResult(mdocSearchForm, recordCount, currentRecords, facets);
    }
}
