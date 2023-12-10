import {FacetCacheUsageConfigurations} from '@dps/mycms-commons/dist/search-commons/services/sql-query.builder';
import {FacetCacheConfiguration} from '@dps/mycms-commons/dist/facetcache-commons/model/facetcache.configuration';
import {CacheConfig} from '@dps/mycms-server-commons/dist/server-commons/datacache.module';
import {
    CommonAudioBackendConfigType,
    CommonBackendConfigType,
    CommonImageBackendConfigType,
    CommonKeywordMapperConfigType,
    CommonSqlConnectionConfigType,
    CommonVideoBackendConfigType
} from '@dps/mycms-server-commons/dist/backend-commons/modules/backend.commons';

// tslint:disable-next-line:no-empty-interface
export interface KeywordMapperConfigType extends CommonKeywordMapperConfigType {
}

export interface SqlConnectionConfigType extends CommonSqlConnectionConfigType<FacetCacheUsageConfigurations, FacetCacheConfiguration> {
}

export interface BackendConfigType extends CommonBackendConfigType<KeywordMapperConfigType, CacheConfig>,
    CommonAudioBackendConfigType<KeywordMapperConfigType, CacheConfig>,
    CommonImageBackendConfigType<KeywordMapperConfigType, CacheConfig>,
    CommonVideoBackendConfigType<KeywordMapperConfigType, CacheConfig> {
    mdocDataStoreAdapter: string,
    mdocWritable: boolean,
    MediaDocSqlMediadbAdapter: SqlConnectionConfigType
}
