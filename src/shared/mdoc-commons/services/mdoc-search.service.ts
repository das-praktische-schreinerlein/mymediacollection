import {MediaDocRecord} from '../model/records/mdoc-record';
import {MediaDocSearchResult} from '../model/container/mdoc-searchresult';
import {MediaDocDataStore} from './mdoc-data.store';
import {CommonDocSearchService} from '@dps/mycms-commons/dist/search-commons/services/cdoc-search.service';
import {Facets} from '@dps/mycms-commons/dist/search-commons/model/container/facets';
import {MediaDocSearchForm, MediaDocSearchFormFactory} from '../model/forms/mdoc-searchform';

export class MediaDocSearchService extends CommonDocSearchService<MediaDocRecord, MediaDocSearchForm, MediaDocSearchResult> {
    constructor(dataStore: MediaDocDataStore) {
        super(dataStore, 'mdoc');
    }

    createDefaultSearchForm(): MediaDocSearchForm {
        return new MediaDocSearchForm({ pageNum: 1, perPage: 10});
    }

    public getBaseMapperName(): string {
        return 'mdoc';
    }

    public isRecordInstanceOf(record: any): boolean {
        return record instanceof MediaDocRecord;
    }

    public createRecord(props, opts): MediaDocRecord {
        return <MediaDocRecord>this.dataStore.createRecord(this.getBaseMapperName(), props, opts);
    }

    public newRecord(values: {}): MediaDocRecord {
        return new MediaDocRecord(values);
    }

    public newSearchForm(values: {}): MediaDocSearchForm {
        return new MediaDocSearchForm(values);
    }

    public newSearchResult(mdocSearchForm: MediaDocSearchForm, recordCount: number,
                           currentRecords: MediaDocRecord[], facets: Facets): MediaDocSearchResult {
        return new MediaDocSearchResult(mdocSearchForm, recordCount, currentRecords, facets);
    }

    public cloneSanitizedSearchForm(src: MediaDocSearchForm): MediaDocSearchForm {
        return MediaDocSearchFormFactory.cloneSanitized(src);
    }

    public createSanitizedSearchForm(values: {}): MediaDocSearchForm {
        return MediaDocSearchFormFactory.createSanitized(values);
    }

    sortRecords(records: MediaDocRecord[], sortType: string): void {
        if (sortType === 'file') {
            records.sort((a, b) => {
                const nameA = a['mdocaudios'] && a['mdocaudios'].length > 0 ? a['mdocaudios'][0]['fileName'] : '';
                const nameB = b['mdocaudios'] && b['mdocaudios'].length > 0 ? b['mdocaudios'][0]['fileName'] : '';

                return nameA.localeCompare(nameB, undefined, {numeric: true, sensitivity: 'base'});
            });
        } else if (sortType === 'order') {
            records.sort((a, b) => {
                const nameA = a.artist + '/' + a.album + '/' + a.trackNo + '/' + a.name;
                const nameB = b.artist + '/' + b.album + '/' + b.trackNo + '/' + b.name;

                return nameA.localeCompare(nameB, undefined, {numeric: true, sensitivity: 'base'});
            });
        } else {
            super.sortRecords(records, sortType);
        }
    }

    getAvailableSorts(): string[] {
        return ['relevance', 'name', 'file', 'order'];
    }
}
