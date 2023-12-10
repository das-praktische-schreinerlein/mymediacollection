import {MediaDocRecord} from '../model/records/mdoc-record';
import {MediaDocSearchForm} from '../model/forms/mdoc-searchform';
import {MediaDocSearchResult} from '../model/container/mdoc-searchresult';
import {GenericSearchHttpAdapter} from '@dps/mycms-commons/dist/search-commons/services/generic-search-http.adapter';
import {Mapper} from 'js-data';
import {MediaDocAdapterResponseMapper} from './mdoc-adapter-response.mapper';

export class MediaDocHttpAdapter extends GenericSearchHttpAdapter<MediaDocRecord, MediaDocSearchForm, MediaDocSearchResult> {
    private responseMapper: MediaDocAdapterResponseMapper;

    constructor(config: any) {
        super(config);
        this.responseMapper = new MediaDocAdapterResponseMapper(config);
    }

    create(mapper: Mapper, record: any, opts?: any): Promise<MediaDocRecord> {
        opts = opts || {};
        opts.endpoint = this.getHttpEndpoint('create');
        if (opts.realSource) {
            record = opts.realSource;
        }

        const props = this.mapRecordToAdapterValues(mapper, record);

        return super.create(mapper, props, opts);
    }

    update(mapper: Mapper, id: string | number, record: any, opts?: any): Promise<MediaDocRecord> {
        opts = opts || {};
        opts.endpoint = this.getHttpEndpoint('update');
        if (opts.realSource) {
            record = opts.realSource;
        }
        const props = this.mapRecordToAdapterValues(mapper, record);

        return super.update(mapper, id, props, opts);
    }

    getHttpEndpoint(method: string, format?: string): string {
        const findMethods = ['find', 'findAll'];
        const updateMethods = ['create', 'destroy', 'update'];
        if (findMethods.indexOf(method.toLocaleLowerCase()) >= 0) {
            return 'mdoc';
        }
        if (updateMethods.indexOf(method.toLocaleLowerCase()) >= 0) {
            return 'mdocwrite';
        }
        if (method.toLocaleLowerCase() === 'doactiontag') {
            return 'mdocaction';
        }
        if (method.toLocaleLowerCase() === 'export') {
            return 'mdocexport/' + format;
        }

        return 'mdocsearch';
    }

    private mapRecordToAdapterValues(mapper: Mapper, values: any): {} {
        let record = values;
        if (!(record instanceof MediaDocRecord)) {
            record = this.responseMapper.mapValuesToRecord(mapper, values);
        }

        return this.responseMapper.mapToAdapterDocument({}, record);
    }
}

