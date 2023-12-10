import {MediaDocAdapterResponseMapper} from '../shared/mdoc-commons/services/mdoc-adapter-response.mapper';
import {MediaDocRecord} from '../shared/mdoc-commons/model/records/mdoc-record';
import {MediaDocSearchForm} from '../shared/mdoc-commons/model/forms/mdoc-searchform';
import {MediaDocSearchResult} from '../shared/mdoc-commons/model/container/mdoc-searchresult';
import {MediaDocServerPlaylistService} from './mdoc-serverplaylist.service';
import {MediaDocDataService} from '../shared/mdoc-commons/services/mdoc-data.service';
import {MediaDocMusicFileExportManager} from './mdoc-musicfile-export.service';
import {
    CommonDocDocExportService,
    ExportProcessingResult,
    ExportProcessingResultMediaFileMappingsType,
    ExportProcessingResultRecordFieldMappingsType
} from '@dps/mycms-commons/dist/search-commons/services/cdoc-export.service';
import {MediaExportProcessingOptions} from '@dps/mycms-server-commons/dist/backend-commons/modules/cdoc-mediafile-export.service';

export class MediaDocExportService extends CommonDocDocExportService<MediaDocRecord, MediaDocSearchForm, MediaDocSearchResult,
    MediaDocDataService, MediaDocServerPlaylistService> {
    protected readonly playlistService: MediaDocServerPlaylistService;
    protected readonly dataService: MediaDocDataService;
    protected readonly responseMapper: MediaDocAdapterResponseMapper;
    protected readonly musicFileExportManager: MediaDocMusicFileExportManager;

    constructor(backendConfig, dataService: MediaDocDataService, playlistService: MediaDocServerPlaylistService,
                musicFileExportManager: MediaDocMusicFileExportManager,
                responseMapper: MediaDocAdapterResponseMapper) {
        super(backendConfig, dataService, playlistService, responseMapper);
        this.musicFileExportManager = musicFileExportManager;
    }

    public exportMediaRecordFiles(mdoc: MediaDocRecord, processingOptions: MediaExportProcessingOptions,
                                  exportResults: ExportProcessingResult<MediaDocRecord>[])
        : Promise<ExportProcessingResult<MediaDocRecord>> {
        if (mdoc === undefined) {
            return Promise.reject('mdoc required');
        }

        const me = this;
        const mediaExportProcessingOptions: MediaExportProcessingOptions = {
            ...processingOptions,
            audioResolutions: [{ pathPrefix: undefined }],
            imageResolutions: [{ pathPrefix: undefined }]
        };

        switch (mdoc.type) {
            case 'AUDIO':
                return me.musicFileExportManager.exportMediaRecordFiles(mdoc, mediaExportProcessingOptions)
                    .then(exportResult => {
                        if (exportResult.mediaFileMappings !== undefined &&
                            exportResult.mediaFileMappings.imageFile !== undefined &&
                            exportResult.record.albumId !== undefined) {
                            if (exportResult.externalRecordFieldMappings === undefined) {
                                exportResult.externalRecordFieldMappings = {};
                            }
                            exportResult.externalRecordFieldMappings['ALBUM_' + exportResult.record.albumId] = {
                                i_fav_url_txt: exportResult.mediaFileMappings.imageFile
                            }
                        }
                        exportResults.push(exportResult);

                        return Promise.resolve(exportResult);
                    });
        }

        return Promise.reject('unknown type: ' + mdoc.type + ' for id: ' + mdoc.id);
    }

    protected generatePlaylistEntry(mdoc: MediaDocRecord, file: string): string {
        switch (mdoc.type) {
            case 'AUDIO':
                return this.musicFileExportManager.generatePlaylistEntry(mdoc, mdoc.get('mdocaudios')[0], 'audio', file);
            case 'IMAGE':
                return this.musicFileExportManager.generatePlaylistEntry(mdoc, mdoc.get('mdocimages')[0], 'image', file);
            case 'VIDEO':
                return this.musicFileExportManager.generatePlaylistEntry(mdoc, mdoc.get('mdocvideos')[0], 'video', file);
        }
    }

    protected checkIdToRead(doc: MediaDocRecord, idsRead: {}): any[] {
        for (const type of ['AUDIO', 'ALBUM', 'ARTIST', 'GENRE']) {
            if (idsRead[type] === undefined) {
                idsRead[type] = {};
            }
        }

        const idsToRead = [];
        if (doc.audioId && !idsRead['AUDIO']['AUDIO_' + doc.audioId]) {
            idsToRead.push('AUDIO_' + doc.audioId);
        }
        if (doc.albumId && !idsRead['ALBUM']['ALBUM_' + doc.albumId]) {
            idsToRead.push('ALBUM_' + doc.albumId);
        }
        if (doc.artistId && !idsRead['ARTIST']['ARTIST_' + doc.artistId]) {
            idsToRead.push('ARTIST_' + doc.artistId);
        }
        if (doc.genreId && !idsRead['GENRE']['GENRE_' + doc.genreId]) {
            idsToRead.push('GENRE_' + doc.genreId);
        }

        return idsToRead;
    }

    protected convertAdapterDocValues(mdoc: {},
                                      idMediaFileMappings: ExportProcessingResultMediaFileMappingsType,
                                      idRecordFieldMappings: ExportProcessingResultRecordFieldMappingsType): {} {
        if (mdoc['id'] === undefined) {
            return mdoc;
        }

        if (idMediaFileMappings[mdoc['id']] !== undefined) {
            mdoc['a_fav_url_txt'] = idMediaFileMappings[mdoc['id']].audioFile;
            mdoc['i_fav_url_txt'] = idMediaFileMappings[mdoc['id']].imageFile;
            mdoc['v_fav_url_txt'] = idMediaFileMappings[mdoc['id']].videoFile;
        }
        if (idRecordFieldMappings[mdoc['id']] !== undefined) {
            mdoc = { ...mdoc, ...idRecordFieldMappings[mdoc['id']]};
        }

        return mdoc;
    }
}
