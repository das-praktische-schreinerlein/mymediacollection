import express from 'express';
import {MediaDocRecord} from '../shared/mdoc-commons/model/records/mdoc-record';
import {MediaDocServerModule} from './mdoc-server.module';
import {MediaDocDataService} from '../shared/mdoc-commons/services/mdoc-data.service';
import {CommonDocWriterServerModule} from '@dps/mycms-server-commons/dist/backend-commons/modules/cdoc-writer-server.module';
import {MediaDocSearchForm} from '../shared/mdoc-commons/model/forms/mdoc-searchform';
import {MediaDocSearchResult} from '../shared/mdoc-commons/model/container/mdoc-searchresult';
import {MediaDocAdapterResponseMapper} from '../shared/mdoc-commons/services/mdoc-adapter-response.mapper';

export class MediaDocWriterServerModule extends CommonDocWriterServerModule<MediaDocRecord, MediaDocSearchForm, MediaDocSearchResult, MediaDocDataService> {
    public static configureRoutes(app: express.Application, apiPrefix: string, mdocServerModule: MediaDocServerModule): MediaDocWriterServerModule {
        const mdocWriterServerModule = new MediaDocWriterServerModule(mdocServerModule);
        CommonDocWriterServerModule.configureServerRoutes(app, apiPrefix, mdocWriterServerModule);
        return mdocWriterServerModule;
    }

    public constructor(mdocServerModule: MediaDocServerModule) {
        super(mdocServerModule, new MediaDocAdapterResponseMapper({}));
    }
}
