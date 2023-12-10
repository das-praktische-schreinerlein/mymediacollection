// import untested service for code-coverage
import {MediaDocAdapterResponseMapper} from './mdoc-commons/services/mdoc-adapter-response.mapper';
import {MediaDocDataStore} from './mdoc-commons/services/mdoc-data.store';
import {MediaDocFileUtils} from './mdoc-commons/services/mdoc-file.utils';
import {MediaDocHttpAdapter} from './mdoc-commons/services/mdoc-http.adapter';
import {MediaDocSearchService} from './mdoc-commons/services/mdoc-search.service';
import {MediaDocSqlMediadbAdapter} from './mdoc-commons/services/mdoc-sql-mediadb.adapter';
import {MediaDocSqlMediadbConfig} from './mdoc-commons/services/mdoc-sql-mediadb.config';
import {MediaDocSqlMediadbActionTagAdapter} from './mdoc-commons/services/mdoc-sql-mediadb-actiontag.adapter';
import {MediaDocSqlMediadbKeywordAdapter} from './mdoc-commons/services/mdoc-sql-mediadb-keyword.adapter';

for (const a in [
    MediaDocAdapterResponseMapper,
    MediaDocDataStore,
    MediaDocFileUtils,
    MediaDocHttpAdapter,
    MediaDocSearchService,
    MediaDocSqlMediadbAdapter,
    MediaDocSqlMediadbConfig,
    MediaDocSqlMediadbActionTagAdapter,
    MediaDocSqlMediadbKeywordAdapter
]) {
    console.log('import untested backend-modules for codecoverage');
}
