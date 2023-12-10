import {MediaDocSearchResult} from '../shared/mdoc-commons/model/container/mdoc-searchresult';
import {MediaDocSearchForm, MediaDocSearchFormValidator} from '../shared/mdoc-commons/model/forms/mdoc-searchform';
import {MediaDocDataService} from '../shared/mdoc-commons/services/mdoc-data.service';
import express from 'express';
import {MediaDocRecord} from '../shared/mdoc-commons/model/records/mdoc-record';
import {DataCacheModule} from '@dps/mycms-server-commons/dist/server-commons/datacache.module';
import {CommonDocServerModule} from '@dps/mycms-server-commons/dist/backend-commons/modules/cdoc-server.module';
import {CommonDocSearchForm} from '@dps/mycms-commons/dist/search-commons/model/forms/cdoc-searchform';
import {BackendConfigType} from './backend.commons';

export class MediaDocServerModule extends CommonDocServerModule<MediaDocRecord, MediaDocSearchForm, MediaDocSearchResult, MediaDocDataService> {
    public static configureRoutes(app: express.Application, apiPrefix: string, dataService: MediaDocDataService,
                                  cache: DataCacheModule, backendConfig: BackendConfigType): MediaDocServerModule {
        const mdocServerModule = new MediaDocServerModule(dataService, cache);
        CommonDocServerModule.configureServerRoutes(app, apiPrefix, mdocServerModule, cache, backendConfig);
        return mdocServerModule;
    }

    public constructor(protected dataService: MediaDocDataService, protected cache: DataCacheModule) {
        super(dataService, cache);
    }

    getApiId(): string {
        return 'mdoc';
    }

    getApiResolveParameterName(): string {
        return 'resolveMdocByMdocId';
    }

    isSearchFormValid(searchForm: CommonDocSearchForm): boolean {
        return MediaDocSearchFormValidator.isValid(<MediaDocSearchForm>searchForm);
    }

}
