import {IAudioMetadata} from 'music-metadata';
import * as knex from 'knex';
import {Mapper} from 'js-data';
import {
    CommonDocMediaManagerModule,
    DBFileInfoType,
    FileInfoType,
    FileSystemDBSyncType
} from '@dps/mycms-server-commons/dist/backend-commons/modules/cdoc-media-manager.module';
import {SqlQueryBuilder} from '@dps/mycms-commons/dist/search-commons/services/sql-query.builder';
import {BaseAudioRecord, BaseAudioRecordType} from '@dps/mycms-commons/dist/search-commons/model/records/baseaudio-record';
import {MediaManagerModule} from '@dps/mycms-server-commons/dist/media-commons/modules/media-manager.module';
import {MediaDocServerPlaylistService} from './mdoc-serverplaylist.service';
import {MediaDocMusicFileImportManager} from './mdoc-musicfile-import.service';
import {BackendConfigType, SqlConnectionConfigType} from './backend.commons';
import {MediaDocAdapterResponseMapper} from '../shared/mdoc-commons/services/mdoc-adapter-response.mapper';
import {MediaDocSearchForm} from '../shared/mdoc-commons/model/forms/mdoc-searchform';
import {MediaDocSearchResult} from '../shared/mdoc-commons/model/container/mdoc-searchresult';
import {MediaDocRecord} from '../shared/mdoc-commons/model/records/mdoc-record';
import {MediaDocExportService} from './mdoc-export.service';
import {MediaDocDataService} from '../shared/mdoc-commons/services/mdoc-data.service';
import {MusicMediaDataContainerType} from '@dps/mycms-server-commons/dist/backend-commons/modules/cdoc-musicfile-import.service';
import {ProcessingOptions} from '@dps/mycms-commons/dist/search-commons/services/cdoc-search.service';
import {
    MediaDocMediaMetaRecord,
    MediaDocMediaMetaRecordFactory,
    MediaDocMediaMetaRecordValidator
} from '../shared/mdoc-commons/model/records/mdocmediameta-record';
import {MediaDocImageRecord} from '../shared/mdoc-commons/model/records/mdocimage-record';
import {MediaDocAudioRecord} from '../shared/mdoc-commons/model/records/mdocaudio-record';
import {RawSqlQueryData, SqlUtils} from '@dps/mycms-commons/dist/search-commons/services/sql-utils';
import fs from 'fs';

// tslint:disable:no-console
export class MediaDocMediaManagerModule extends CommonDocMediaManagerModule<MediaDocRecord, MediaDocSearchForm,
    MediaDocSearchResult, MediaDocDataService, MediaDocServerPlaylistService, MediaDocExportService> {
    protected readonly knex;
    protected readonly sqlQueryBuilder: SqlQueryBuilder;
    protected readonly playlistService: MediaDocServerPlaylistService;
    protected readonly musicFileImportManager: MediaDocMusicFileImportManager;
    protected readonly responseMapper: MediaDocAdapterResponseMapper;

    constructor(backendConfig, dataService: MediaDocDataService, protected mediaManager: MediaManagerModule,
                playlistService: MediaDocServerPlaylistService,
                exportManager: MediaDocExportService,
                musicFileImportManager: MediaDocMusicFileImportManager) {
        super(backendConfig, dataService, mediaManager, exportManager);
        this.sqlQueryBuilder = new SqlQueryBuilder();
        this.knex = this.createKnex(backendConfig);
        this.playlistService = playlistService;
        this.musicFileImportManager = musicFileImportManager;
        this.responseMapper = new MediaDocAdapterResponseMapper(this.backendConfig);
    }

    // TODO override musicFileImportManager.createRecordsForMusicMediaData -> and remap to mediameta
    public generateMediaDocRecordsFromMediaDir(baseDir: string, mappings: {}): Promise<MediaDocRecord[]> {
        const mapper: Mapper = this.dataService.getMapper('mdoc');

        return this.musicFileImportManager.generateMusicDocRecordsFromMediaDir(mapper, this.responseMapper, baseDir, mappings, true);
    }

    public syncMediaDataToFiles(searchForm: MediaDocSearchForm, processingOptions: ProcessingOptions): Promise<{}> {
        const me = this;
        const callback = function(mdoc: MediaDocRecord): Promise<{}>[] {
            return [me.syncMediaDataToFile(mdoc)];
        };

        return this.dataService.batchProcessSearchResult(searchForm, callback, {
            loadDetailsMode: undefined,
            loadTrack: false,
            showFacets: false,
            showForm: false
        }, processingOptions);
    }

    public syncExistingMediaDataFromFiles(searchForm: MediaDocSearchForm, processingOptions: ProcessingOptions): Promise<{}> {
        const me = this;
        const callback = function(mdoc: MediaDocRecord): Promise<{}>[] {
            return [me.syncExistingMediaDataFromFile(mdoc)];
        };

        return this.dataService.batchProcessSearchResult(searchForm, callback, {
            loadDetailsMode: undefined,
            loadTrack: false,
            showFacets: false,
            showForm: false
        }, processingOptions);
    }

    public syncMediaDataToFile(mdoc: MediaDocRecord): Promise<{}> {
        const me = this;
        const mdocAudios = mdoc.get('mdocaudios');
        if (mdocAudios === undefined || mdocAudios.length !== 1) {
            return Promise.reject('no audiofile')
        }

        const mdocAudio: BaseAudioRecord = mdocAudios[0];
        const mediaDataContainer: MusicMediaDataContainerType = {
            albumArtistName: undefined,
            albumGenreName: undefined,
            albumName: undefined,
            artistName: undefined,
            genreName: undefined,
            releaseYear: undefined,
            titleName: undefined,
            trackNr: undefined
        };

        return this.readMetadataFromAudioRecord(mdocAudio).then((metaData) => {
            me.musicFileImportManager.mapMediaDocToMediaDataRecordToMediaDataContainer({}, mdoc, mediaDataContainer)

            return me.musicFileImportManager.mapMediaDataContainerToAudioMetaData({}, mediaDataContainer, <IAudioMetadata>metaData)
        }).then(metaData => {
            // TODO: save metadata to file
            return Promise.resolve(mdoc);
        }).catch(err => {
            console.error('error while syncing record: ' + mdoc.id, err);
            return Promise.reject(err);
        });
    }

    // TODO move to commons
    public syncExistingMediaDataFromFile(mdoc: MediaDocRecord): Promise<{}> {
        const me = this;
        return this.readMetadataForCommonDocRecord(mdoc).then(value => {
            return me.updateMetaDataOfCommonDocRecord(mdoc, <IAudioMetadata>value);
        });
    }

    // TODO move to commons
    public readMetadataForCommonDocRecord(mdoc: MediaDocRecord): Promise<IAudioMetadata> {
        const mdocAudios = mdoc.get('mdocaudios');
        if (mdocAudios !== undefined  && mdocAudios.length > 0) {
            return this.readMetadataFromAudioRecord(mdocAudios[0]);
        }

        console.warn('no audio found for ' + mdoc.id);
        return Promise.resolve(<IAudioMetadata>{});
    }

    // TODO move to commons
    public readMetadataFromAudioRecord(mdocAudio: BaseAudioRecordType): Promise<IAudioMetadata> {
        return this.mediaManager.readMusicTagsForMusicFile((<BackendConfigType>this.backendConfig).apiRouteAudiosStaticDir + '/'
            + mdocAudio.fileName);
    }

    // TODO gemneralize as seen on ImageDoc and move to commons
    public updateMetaDataOfCommonDocRecord(mdoc: MediaDocRecord, metadata: IAudioMetadata): Promise<{}> {
        let mdocImages = mdoc.get('mdocimages');
        let origCover: MediaDocImageRecord = undefined;
        if ((mdocImages !== undefined && mdocImages.length > 0)) {
            origCover = mdocImages[0];
        }

        return this.musicFileImportManager.extractAndSetCoverFile(mdoc, metadata).then(updateFlag => {
            if (updateFlag) {
                mdocImages = mdoc.get('mdocimages');
                let newCover: MediaDocImageRecord = undefined;
                if ((mdocImages !== undefined && mdocImages.length > 0)) {
                    newCover = mdocImages[0];
                }

                console.debug('updateMetaDataOfCommonDocRecord: coverFile changed for id old/new', mdoc.id,
                    '\n   OLD:\n', origCover,
                    '\n   NEW:\n', newCover);
            }

            updateFlag = this.mapMetaDataToMediaDoc(mdoc, metadata) || updateFlag;

            return Promise.resolve(updateFlag);
        }).then(updateFlag => {
            if (updateFlag) {
                const mediaMeta: MediaDocMediaMetaRecord = mdoc.get('mdocmediameta');
                if (!mediaMeta || !mediaMeta.isValid()) {
                    const errors = MediaDocMediaMetaRecordValidator.instance.validate(mediaMeta);
                    return Promise.reject('cant update mdoc because of validation-errors for id:' + mdoc.id + ' errors:' + errors);
                }

                let updateMediaMetaSqlQuery: RawSqlQueryData = undefined;
                switch (mdoc.type.toLowerCase()) {
                    case 'audio':
                        updateMediaMetaSqlQuery = {
                            sql:
                                'UPDATE TITLES SET' +
                                '  t_datefile = ?,' +
                                '  t_date = ?,' +
                                '  t_duration = ?,' +
                                '  t_filesize = ?,' +
                                '  t_metadata = ?' +
                                '  WHERE t_id in (?)',
                            parameters: [
                                mediaMeta.fileCreated || null,
                                mediaMeta.recordingDate || null,
                                mediaMeta.dur || null,
                                mediaMeta.fileSize || null,
                                mediaMeta.metadata || null,
                                mdoc.id.replace('AUDIO_', '')
                            ]
                        };
                        break;
                    default:
                        console.warn('unknown type for mdoc.id', mdoc.type, mdoc.id);
                        return Promise.reject('unknown type:"' + mdoc.type + '" for mdoc.id:' + mdoc.id);
                }

                console.log('update metadata for mdoc id:', mdoc.id);
                return SqlUtils.executeRawSqlQueryData(this.knex, updateMediaMetaSqlQuery).then(result => {
                    console.debug('updated metadata of mdoc id:', mdoc.id, updateMediaMetaSqlQuery, result);
                    return Promise.resolve(result);
                }).catch(error => {
                    console.error('error while updating metadata of mdoc id:', mdoc.id, updateMediaMetaSqlQuery);
                    return Promise.reject(error);
                });
            } else {
                Promise.resolve(false);
            }
        });
    }

    public findCommonDocRecordsForFileInfo(baseDir: string, fileInfo: FileInfoType,
                                           additionalMappings: { [p: string]: FileSystemDBSyncType }): Promise<DBFileInfoType[]> {
        // TODO
        console.warn('not implemented');
        return Promise.reject('not implemented');
    }

    public scaleCommonDocRecordMediaWidth(mdoc: MediaDocRecord, width: number): Promise<{}> {
        console.warn('not implemented');
        return Promise.reject('not implemented');
    }

    public updateDateOfCommonDocRecord(mdoc: MediaDocRecord, date: Date): Promise<{}> {
        console.warn('not implemented');
        return Promise.reject('not implemented');
    }

    protected createKnex(backendConfig: BackendConfigType): any {
        // configure adapter
        const sqlConfig: SqlConnectionConfigType = backendConfig.MediaDocSqlMediadbAdapter;
        if (sqlConfig === undefined) {
            throw new Error('config for MediaDocSqlMediadbAdapter not exists');
        }
        const options = {
            knexOpts: {
                client: sqlConfig.client,
                connection: sqlConfig.connection
            }
        };

        return knex(options.knexOpts);
    }

    protected mapMetaDataToMediaDoc(mdoc: MediaDocRecord, audioMetaData: IAudioMetadata): boolean {
        const mdocAudios = mdoc.get('mdocaudios');
        if (mdocAudios === undefined || mdocAudios.length <= 0) {
            console.warn('no audio found for ' + mdoc.id);
            return false;
        }

        const audio: MediaDocAudioRecord = mdocAudios[0];
        let mediaMeta = mdoc.get('mdocmediameta');
        if (!mediaMeta) {
            mediaMeta = this.dataService.getMapper(this.dataService.getBaseMapperName())
                ['datastore']
                ._mappers['mdocmediameta']
                .createRecord(MediaDocMediaMetaRecordFactory.instance.getSanitizedValues(
                    {mdoc_id: mdoc.id, fileName: audio.fileName}, {}));
            mdoc.set('mdocmediameta', mediaMeta);
        }

        audioMetaData = this.musicFileImportManager.prepareAudioMetadata(audioMetaData);

        const fileName = (<BackendConfigType>this.backendConfig).apiRouteAudiosStaticDir + '/' + audio.fileName
        const fileStats = fs.statSync(fileName);

        return this.musicFileImportManager.mapAudioDataToMediaMetaDoc(mdoc.id, mediaMeta, audioMetaData, fileStats);
    }

}
