import {ConfigureServerModule} from '@dps/mycms-server-commons/dist/server-commons/configure-server.module';
import {FirewallConfig} from '@dps/mycms-server-commons/dist/server-commons/firewall.commons';
import {DnsBLModule} from '@dps/mycms-server-commons/dist/server-commons/dnsbl.module';
import {FirewallModule} from '@dps/mycms-server-commons/dist/server-commons/firewall.module';
import {PDocDataService} from '@dps/mycms-commons/dist/pdoc-commons/services/pdoc-data.service';
import {DataCacheModule} from '@dps/mycms-server-commons/dist/server-commons/datacache.module';
import {VideoServerModule} from './modules/video-server.module';
import {AudioServerModule} from './modules/audio-server.module';
import {MediaDocServerModule} from './modules/mdoc-server.module';
import {MediaDocDataServiceModule} from './modules/mdoc-dataservice.module';
import {MediaDocDataService} from './shared/mdoc-commons/services/mdoc-data.service';
import {MediaDocWriterServerModule} from './modules/mdoc-writer-server.module';
import {MediaDocPlaylistServerModule} from './modules/mdoc-playlist-server.module';
import {AssetsServerModule} from './modules/assets-server.module';
import {CommonServerConfigType} from '@dps/mycms-server-commons/dist/server-commons/server.commons';
import {BackendConfigType} from './modules/backend.commons';
import {PDocWriterServerModule} from '@dps/mycms-server-commons/dist/pdoc-backend-commons/modules/pdoc-writer-server.module';
import {PagesServerModule} from '@dps/mycms-server-commons/dist/pdoc-backend-commons/modules/pages-server.module';
import {PagesDataserviceModule} from '@dps/mycms-server-commons/dist/pdoc-backend-commons/modules/pages-dataservice.module';
import {StaticPagesDataService} from '@dps/mycms-commons/dist/pdoc-commons/services/staticpages-data.service';
import {PDocDataServiceModule} from '@dps/mycms-server-commons/dist/pdoc-backend-commons/modules/pdoc-dataservice.module';
import {PDocServerModule} from '@dps/mycms-server-commons/dist/pdoc-backend-commons/modules/pdoc-server.module';
import {MarkdownService} from '@dps/mycms-commons/dist/markdown-commons/markdown.service';
import {DefaultOptions} from '@dps/mycms-commons/dist/markdown-commons/options';
import {MarkdownDefaultExtensions} from '@dps/mycms-commons/dist/markdown-commons/extensions/markdown.extensions';

export interface ServerConfig extends CommonServerConfigType<BackendConfigType, FirewallConfig> {
}

export class ServerModuleLoader {
    public static loadModules(app, serverConfig: ServerConfig) {
        const cache: DataCacheModule = new DataCacheModule(serverConfig.backendConfig.cacheConfig);

        ServerModuleLoader.configureDefaultServer(app, serverConfig, cache);
        ServerModuleLoader.loadModulePages(app, serverConfig, cache);
        ServerModuleLoader.loadAdditionalModules(app, serverConfig, cache);
    }

    public static configureDefaultServer(app, serverConfig: ServerConfig, cache: DataCacheModule) {
        ConfigureServerModule.configureServer(app, serverConfig.backendConfig);

        if (!ServerModuleLoader.isServerWritable(serverConfig)) {
            ConfigureServerModule.configureServerAddHysteric(app, serverConfig.backendConfig);
        }

        FirewallModule.configureFirewall(app, serverConfig.firewallConfig, serverConfig.filePathErrorDocs);
        DnsBLModule.configureDnsBL(app, serverConfig.firewallConfig, serverConfig.filePathErrorDocs);

        ConfigureServerModule.configureDefaultErrorHandler(app);
    }

    public static loadAdditionalModules(app, serverConfig: ServerConfig, cache: DataCacheModule) {
        ServerModuleLoader.loadModuleMDoc(app, serverConfig, cache);
        ServerModuleLoader.loadModulePDoc(app, serverConfig, cache);
    }

    public static loadModulePages(app, serverConfig: ServerConfig, cache: DataCacheModule) {
        const markdownService = new MarkdownService(DefaultOptions.getDefault(), MarkdownDefaultExtensions);
        const pagesDataServiceDE: StaticPagesDataService = PagesDataserviceModule.getDataService('pdocSolrDE',
            serverConfig.backendConfig, 'de', markdownService);
        const pagesDataServiceEN: StaticPagesDataService = PagesDataserviceModule.getDataService('pdocSolrEN',
            serverConfig.backendConfig, 'en', markdownService);

        PagesServerModule.configureRoutes(app, serverConfig.apiDataPrefix, pagesDataServiceDE, 'de', serverConfig.backendConfig.profile);
        PagesServerModule.configureRoutes(app, serverConfig.apiDataPrefix, pagesDataServiceEN, 'en', serverConfig.backendConfig.profile);
    }

    public static loadModulePDoc(app, serverConfig: ServerConfig, cache: DataCacheModule) {
        if (serverConfig.backendConfig.startPDocApi) {
            const pdocDataService: PDocDataService = PDocDataServiceModule.getDataService('pdocSolr',
                serverConfig.backendConfig);
            const pdocServerModule = PDocServerModule.configureRoutes(app, serverConfig.apiDataPrefix,
                pdocDataService, cache, serverConfig.backendConfig);

            const pdocWritable = serverConfig.backendConfig.pdocWritable === true
                || <any>serverConfig.backendConfig.pdocWritable === 'true';
            if (pdocWritable) {
                PDocWriterServerModule.configureRoutes(app, serverConfig.apiDataPrefix, pdocServerModule);
            }
        }
    }

    public static isServerWritable(serverConfig: ServerConfig) {
        const pdocWritable = serverConfig.backendConfig.pdocWritable === true
            || <any>serverConfig.backendConfig.pdocWritable === 'true';
        const mdocWritable = serverConfig.backendConfig.mdocWritable === true
            || <any>serverConfig.backendConfig.mdocWritable === 'true';

        return pdocWritable || mdocWritable;
    }

    public static loadModuleMDoc(app, serverConfig: ServerConfig, cache: DataCacheModule) {
        const mdocWritable = serverConfig.backendConfig.mdocWritable === true || <any>serverConfig.backendConfig.mdocWritable === 'true';
        const apiAudioServerEnabled = serverConfig.backendConfig.apiAudioServerEnabled === true
            || <any>serverConfig.backendConfig.apiAudioServerEnabled === 'true';
        const apiImageServerEnabled = serverConfig.backendConfig.apiImageServerEnabled === true
            || <any>serverConfig.backendConfig.apiImageServerEnabled === 'true';
        const apiVideoServerEnabled = serverConfig.backendConfig.apiVideoServerEnabled === true
            || <any>serverConfig.backendConfig.apiVideoServerEnabled === 'true';

        // configure dataservices
        const mdocDataService: MediaDocDataService = MediaDocDataServiceModule.getDataService('mdocSolr',
            serverConfig.backendConfig);

        // add routes
        const mdocServerModule = MediaDocServerModule.configureRoutes(app, serverConfig.apiDataPrefix,
            mdocDataService, cache, serverConfig.backendConfig);
        if (mdocWritable) {
            MediaDocWriterServerModule.configureRoutes(app, serverConfig.apiDataPrefix, mdocServerModule);
        }

        if (apiAudioServerEnabled) {
            AudioServerModule.configureStaticAudioRoutes(app, serverConfig.apiPublicPrefix, serverConfig.backendConfig);
            AudioServerModule.configureStoredAudioRoutes(app, serverConfig.apiPublicPrefix, serverConfig.backendConfig,
                serverConfig.firewallConfig.routerErrorsConfigs['digifotos'].file, serverConfig.filePathErrorDocs);
        }

        if (apiImageServerEnabled) {
            AssetsServerModule.configureStaticPictureRoutes(app, serverConfig.apiPublicPrefix, serverConfig.backendConfig);
            AssetsServerModule.configureStoredPictureRoutes(app, serverConfig.apiPublicPrefix, serverConfig.backendConfig,
                serverConfig.firewallConfig.routerErrorsConfigs['digifotos'].file, serverConfig.filePathErrorDocs);
        }

        if (apiVideoServerEnabled) {
            VideoServerModule.configureStaticVideoRoutes(app, serverConfig.apiPublicPrefix, serverConfig.backendConfig);
            VideoServerModule.configureStoredVideoRoutes(app, serverConfig.apiPublicPrefix, serverConfig.backendConfig,
                serverConfig.firewallConfig.routerErrorsConfigs['digifotos'].file, serverConfig.filePathErrorDocs);
        }

        MediaDocPlaylistServerModule.configureRoutes(app, serverConfig.apiDataPrefix, mdocDataService, serverConfig.backendConfig);
    }

}
