import {MediaDocSearchResult} from '../shared/mdoc-commons/model/container/mdoc-searchresult';
import {MediaDocSearchForm, MediaDocSearchFormValidator} from '../shared/mdoc-commons/model/forms/mdoc-searchform';
import {MediaDocDataService} from '../shared/mdoc-commons/services/mdoc-data.service';
import express from 'express';
import {MediaDocRecord} from '../shared/mdoc-commons/model/records/mdoc-record';
import {CommonDocSearchForm} from '@dps/mycms-commons/dist/search-commons/model/forms/cdoc-searchform';
import {CommonDocPlaylistServerModule} from '@dps/mycms-server-commons/dist/backend-commons/modules/cdoc-playlist-server.module';
import {CommonDocPlaylistExporter} from '@dps/mycms-commons/dist/search-commons/services/cdoc-playlist-exporter';
import {MediaDocServerPlaylistService, MediaDocServerPlaylistServiceConfig} from './mdoc-serverplaylist.service';
import {BackendConfigType} from './backend.commons';

export class MediaDocPlaylistServerModule extends CommonDocPlaylistServerModule<MediaDocRecord, MediaDocSearchForm, MediaDocSearchResult,
    MediaDocDataService> {
    public static configureRoutes(app: express.Application, apiPrefix: string, dataService: MediaDocDataService,
                                  backendConfig: BackendConfigType): MediaDocPlaylistServerModule {
        const playlistConfig: MediaDocServerPlaylistServiceConfig = {
            audioBaseUrl: backendConfig.playlistExportAudioBaseUrl,
            imageBaseUrl: backendConfig.playlistExportImageBaseUrl,
            videoBaseUrl: backendConfig.playlistExportVideoBaseUrl,
            useAudioAssetStoreUrls: backendConfig.playlistExportUseAudioAssetStoreUrls,
            useImageAssetStoreUrls: backendConfig.playlistExportUseImageAssetStoreUrls,
            useVideoAssetStoreUrls: backendConfig.playlistExportUseVideoAssetStoreUrls
        };
        const playlistService = new MediaDocServerPlaylistService(playlistConfig);
        const playlistExporter = new CommonDocPlaylistExporter<MediaDocRecord, MediaDocSearchForm, MediaDocSearchResult,
            MediaDocDataService>(dataService, playlistService);
        const mdocPlaylistServerModule = new MediaDocPlaylistServerModule(dataService, playlistExporter);
        CommonDocPlaylistServerModule.configurePlaylistServerRoutes(app, apiPrefix, mdocPlaylistServerModule, backendConfig);
        return mdocPlaylistServerModule;
    }

    public constructor(protected dataService: MediaDocDataService, protected playlistExporter: CommonDocPlaylistExporter<MediaDocRecord,
        MediaDocSearchForm, MediaDocSearchResult, MediaDocDataService>) {
        super(dataService, playlistExporter);
    }

    getApiId(): string {
        return 'mdoc';
    }

    isSearchFormValid(searchForm: CommonDocSearchForm): boolean {
        return MediaDocSearchFormValidator.isValid(<MediaDocSearchForm>searchForm);
    }

}
