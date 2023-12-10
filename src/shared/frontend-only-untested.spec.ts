// import untested service for code-coverage
import {MediaDocAdapterResponseMapper} from './mdoc-commons/services/mdoc-adapter-response.mapper';
import {MediaDocDataStore} from './mdoc-commons/services/mdoc-data.store';
import {MediaDocHttpAdapter} from './mdoc-commons/services/mdoc-http.adapter';
import {MediaDocFileUtils} from './mdoc-commons/services/mdoc-file.utils';
import {MediaDocRoutingService} from './mdoc-commons/services/mdoc-routing.service';
import {MediaDocSearchService} from './mdoc-commons/services/mdoc-search.service';

for (const a in [
    MediaDocAdapterResponseMapper,
    MediaDocDataStore,
    MediaDocFileUtils,
    MediaDocHttpAdapter,
    MediaDocRoutingService,
    MediaDocSearchService,
]) {
    console.log('import untested frontend-modules for codecoverage');
}
