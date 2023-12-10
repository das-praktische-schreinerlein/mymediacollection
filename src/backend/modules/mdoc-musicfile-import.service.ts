import {Mapper} from 'js-data';
import {BaseImageRecord} from '@dps/mycms-commons/dist/search-commons/model/records/baseimage-record';
import {MediaManagerModule} from '@dps/mycms-server-commons/dist/media-commons/modules/media-manager.module';
import {BaseAudioRecord} from '@dps/mycms-commons/dist/search-commons/model/records/baseaudio-record';
import {MediaDocRecord} from '../shared/mdoc-commons/model/records/mdoc-record';
import {MediaDocImageRecordFactory} from '../shared/mdoc-commons/model/records/mdocimage-record';
import {MediaDocDataService} from '../shared/mdoc-commons/services/mdoc-data.service';
import {MediaDocLinkedArtistRecordFactory} from '../shared/mdoc-commons/model/records/mdoclinkedartist-record';
import {
    CommonDocMusicFileImportManager,
    MediaImportContainerType,
    MediaImportFileCheckType
} from '@dps/mycms-server-commons/dist/backend-commons/modules/cdoc-musicfile-import.service';
import fs from 'fs';
import {Adapter} from 'js-data-adapter';
import {MediaDocMediaMetaRecordFactory} from '../shared/mdoc-commons/model/records/mdocmediameta-record';
import {BaseMediaMetaRecordType} from '@dps/mycms-commons/dist/search-commons/model/records/basemediameta-record';

// tslint:disable:no-console
export class MediaDocMusicFileImportManager extends CommonDocMusicFileImportManager<MediaDocRecord> {
    protected readonly dataService: MediaDocDataService;

    constructor(baseDir: string, dataService: MediaDocDataService, protected mediaManager: MediaManagerModule,
                protected skipCheckForExistingFilesInDataBase: boolean) {
        super(baseDir, mediaManager);
        this.dataService = dataService;
    }

    public checkMusicFile(path: string, records: MediaDocRecord[], container: MediaImportContainerType, fileStats: fs.Stats):
        Promise<MediaImportFileCheckType> {
        if (this.skipCheckForExistingFilesInDataBase) {
            return Promise.resolve({ readyToImport: true, hint: 'skipped database-check'});
        }

        const mapper: Mapper = this.dataService.getMapper(this.dataService.getBaseMapperName());
        const adapter: Adapter = this.dataService.getAdapterForMapper(this.dataService.getBaseMapperName());
        const query = {
            where: {
                a_fav_url_hex: {
                    'in': [this.dataService.stringToHex(path)]
                },
                type_ss: {
                    'in': ['audio']
                }
            }
        };

        return adapter.findAll(mapper, query, undefined)
            .then(value => {
                if (value.length > 0) {
                    return Promise.resolve({ readyToImport: false, hint: 'file already exits in database'});
                }

                return Promise.resolve({ readyToImport: true, hint: 'file not exits in database'});
            });
    }

    protected appendCoverImageToRecord(mdoc: MediaDocRecord, coverFile: string) {
        const mapper = this.dataService.getMapper('mdocimage');
        const values = {
            fileName: coverFile,
            name: mdoc.name,
            id: 10000000 + mdoc.id,
            mdoc_id: mdoc.id
        };
        const mdocImage = mapper.createRecord(MediaDocImageRecordFactory.instance.getSanitizedValues(values, {}));
        mdoc.set('mdocimages', [mdocImage]);
    }

    protected getAudiosFromRecord(mdoc: MediaDocRecord): BaseAudioRecord[] {
        return mdoc.get('mdocaudios');
    }

    protected getImagesFromRecord(mdoc: MediaDocRecord): BaseImageRecord[] {
        return mdoc.get('mdocimages');
    }

    protected appendLinkedArtistToAlbumRecord(mapper: Mapper, mdoc: MediaDocRecord, artistId: number, artistName: string) {
        if (!mdoc.get('mdoclinkedartists')) {
            mdoc.set('mdoclinkedartists', []);
        }

        mdoc.get('mdoclinkedartists').push(
            mapper['datastore']._mappers['mdoclinkedartist'].createRecord(
                MediaDocLinkedArtistRecordFactory.instance.getSanitizedValues({
                    id: 20000 + artistId,
                    type: 'addartist',
                    name: artistName,
                    refId: artistId + '',
                    mdoc_id: mdoc.id
                }, {})));
    }

    protected createMediaMetaRecord(values: {}): BaseMediaMetaRecordType {
        return MediaDocMediaMetaRecordFactory.createSanitized(values);
    }
}
