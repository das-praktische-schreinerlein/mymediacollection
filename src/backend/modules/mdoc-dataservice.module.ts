import {MediaDocDataStore, MediaDocTeamFilterConfig} from '../shared/mdoc-commons/services/mdoc-data.store';
import {SearchParameterUtils} from '@dps/mycms-commons/dist/search-commons/services/searchparameter.utils';
import {MediaDocDataService} from '../shared/mdoc-commons/services/mdoc-data.service';
import * as fs from 'fs';
import {MediaDocSqlMediadbAdapter} from '../shared/mdoc-commons/services/mdoc-sql-mediadb.adapter';
import {FacetCacheUsageConfigurations} from '@dps/mycms-commons/dist/search-commons/services/sql-query.builder';
import {BackendConfigType} from './backend.commons';

export class MediaDocDataServiceModule {
    private static dataServices = new Map<string, MediaDocDataService>();

    public static getDataService(profile: string, backendConfig: BackendConfigType): MediaDocDataService {
        if (!this.dataServices.has(profile)) {
            switch (backendConfig.mdocDataStoreAdapter) {
                case 'MediaDocSqlMediadbAdapter':
                    this.dataServices.set(profile, MediaDocDataServiceModule.createDataServiceMediadbSql(backendConfig));
                    break;
                default:
                    throw new Error('configured mdocDataStoreAdapter not exist:' + backendConfig.mdocDataStoreAdapter);
            }
        }

        return this.dataServices.get(profile);
    }

    private static createDataServiceMediadbSql(backendConfig: BackendConfigType): MediaDocDataService {
        // configure store
        const filterConfig: MediaDocTeamFilterConfig = new MediaDocTeamFilterConfig();
        const themeFilters: any[] = JSON.parse(fs.readFileSync(backendConfig.filePathThemeFilterJson, { encoding: 'utf8' }));
        for (const themeName in themeFilters) {
            filterConfig.set(themeName, themeFilters[themeName]);
        }
        const dataStore: MediaDocDataStore = new MediaDocDataStore(new SearchParameterUtils(), filterConfig);
        const dataService: MediaDocDataService = new MediaDocDataService(dataStore);

        // configure adapter
        const sqlConfig = backendConfig.MediaDocSqlMediadbAdapter;
        if (sqlConfig === undefined) {
            throw new Error('config for MediaDocSqlMediadbAdapter not exists');
        }
        const options = {
            knexOpts: {
                client: sqlConfig.client,
                connection: sqlConfig.connection
            },
            mapperConfig: backendConfig.mapperConfig
        };
        const adapter = new MediaDocSqlMediadbAdapter(options,
            <FacetCacheUsageConfigurations>backendConfig.MediaDocSqlMediadbAdapter.facetCacheUsage);
        dataStore.setAdapter('http', adapter, '', {});

        return dataService;
    }
}
