import {MediaDocRecord, MediaDocRecordRelation} from '../model/records/mdoc-record';
import {MediaDocDataStore} from './mdoc-data.store';
import {MediaDocSearchService} from './mdoc-search.service';
import {MediaDocRecordSchema} from '../model/schemas/mdoc-record-schema';
import {MediaDocAdapterResponseMapper} from './mdoc-adapter-response.mapper';
import {ActionTagForm} from '@dps/mycms-commons/dist/commons/utils/actiontag.utils';
import {MediaDocSearchForm} from '../model/forms/mdoc-searchform';
import {MediaDocSearchResult} from '../model/container/mdoc-searchresult';
import {CommonDocDataService} from '@dps/mycms-commons/dist/search-commons/services/cdoc-data.service';
import {MediaDocAudioRecord, MediaDocAudioRecordRelation} from '../model/records/mdocaudio-record';
import {MediaDocAudioRecordSchema} from '../model/schemas/mdocaudio-record-schema';
import {MediaDocRatePersonalRecord, MediaDocRatePersonalRecordRelation} from '../model/records/mdocratepers-record';
import {MediaDocRatePersonalRecordSchema} from '../model/schemas/mdocreatepers-record-schema';
import {BaseAudioRecord} from '@dps/mycms-commons/dist/search-commons/model/records/baseaudio-record';
import {MediaDocMediaMetaRecord, MediaDocMediaMetaRecordRelation} from '../model/records/mdocmediameta-record';
import {MediaDocNavigationObjectRecord, MediaDocNavigationObjectRecordRelation} from '../model/records/mdocnavigationobject-record';
import {MediaDocMediaMetaRecordSchema} from '../model/schemas/mdocmediameta-record-schema';
import {MediaDocNavigationObjectRecordSchema} from '../model/schemas/mdocnavigationobject-record-schema';
import {
    MediaDocExtendedObjectPropertyRecord,
    MediaDocExtendedObjectPropertyRecordRelation
} from '../model/records/mdocextendedobjectproperty-record';
import {MediaDocExtendedObjectPropertyRecordSchema} from '../model/schemas/mdocextendedobjectproperty-record-schema';
import {MediaDocImageRecord, MediaDocImageRecordRelation} from '../model/records/mdocimage-record';
import {MediaDocImageRecordSchema} from '../model/schemas/mdocimage-record-schema';
import {MediaDocVideoRecord, MediaDocVideoRecordRelation} from '../model/records/mdocvideo-record';
import {MediaDocVideoRecordSchema} from '../model/schemas/mdocvideo-record-schema';
import {BaseImageRecord} from '@dps/mycms-commons/dist/search-commons/model/records/baseimage-record';
import {BaseVideoRecord} from '@dps/mycms-commons/dist/search-commons/model/records/basevideo-record';
import {MediaDocLinkedArtistRecord, MediaDocLinkedArtistRecordRelation} from '../model/records/mdoclinkedartist-record';
import {MediaDocLinkedArtistRecordSchema} from '../model/schemas/mdoclinkedartist-record-schema';
import {MediaDocLinkedPlaylistRecord, MediaDocLinkedPlaylistRecordRelation} from '../model/records/mdoclinkedplaylist-record';
import {MediaDocLinkedPlaylistRecordSchema} from '../model/schemas/mdoclinkedplaylist-record-schema';

export class MediaDocDataService extends CommonDocDataService<MediaDocRecord, MediaDocSearchForm, MediaDocSearchResult> {
    public defaultLocIdParent = 1;

    constructor(dataStore: MediaDocDataStore) {
        super(dataStore, new MediaDocSearchService(dataStore), new MediaDocAdapterResponseMapper({}));
    }

    public createRecord(props, opts): MediaDocRecord {
        return <MediaDocRecord>this.dataStore.createRecord(this.getBaseMapperName(), props, opts);
    }

    protected addAdditionalActionTagForms(origMdocRecord: MediaDocRecord, newMdocRecord: MediaDocRecord,
                                          actionTagForms: ActionTagForm[]) {
    }

    protected defineDatastoreMapper(): void {
        this.dataStore.defineMapper('mdoc', MediaDocRecord, MediaDocRecordSchema, MediaDocRecordRelation);
        this.dataStore.defineMapper('mdocaudio', MediaDocAudioRecord, MediaDocAudioRecordSchema, MediaDocAudioRecordRelation);
        this.dataStore.defineMapper('mdocimage', MediaDocImageRecord, MediaDocImageRecordSchema, MediaDocImageRecordRelation);
        this.dataStore.defineMapper('mdocvideo', MediaDocVideoRecord, MediaDocVideoRecordSchema, MediaDocVideoRecordRelation);
        this.dataStore.defineMapper('mdocmediameta', MediaDocMediaMetaRecord, MediaDocMediaMetaRecordSchema,
            MediaDocMediaMetaRecordRelation);
        this.dataStore.defineMapper('mdocratepers', MediaDocRatePersonalRecord, MediaDocRatePersonalRecordSchema,
            MediaDocRatePersonalRecordRelation);
        this.dataStore.defineMapper('mdoclinkedartist', MediaDocLinkedArtistRecord,
            MediaDocLinkedArtistRecordSchema, MediaDocLinkedArtistRecordRelation);
        this.dataStore.defineMapper('mdoclinkedplaylist', MediaDocLinkedPlaylistRecord,
            MediaDocLinkedPlaylistRecordSchema, MediaDocLinkedPlaylistRecordRelation);
        this.dataStore.defineMapper('mdocnavigationobject', MediaDocNavigationObjectRecord,
            MediaDocNavigationObjectRecordSchema, MediaDocNavigationObjectRecordRelation);
        this.dataStore.defineMapper('mdocextendedobjectproperty', MediaDocExtendedObjectPropertyRecord,
            MediaDocExtendedObjectPropertyRecordSchema, MediaDocExtendedObjectPropertyRecordRelation);
    }

    protected defineIdMappingAlliases(): {} {
        return {
        };
    }

    protected defineIdMappings(): string[] {
        return ['albumId', 'audioId', 'artistId', 'genreId'];
    }

    protected defineTypeMappings(): {} {
        return {
            album: 'albumId',
            artist: 'artistId',
            audio: 'audioId',
            genre: 'genreId',
        };
    }

    protected onImportRecordNewRecordProcessDefaults(record: MediaDocRecord): void {
        record.subtype = record.subtype ? record.subtype.replace(/[-a-zA-Z_]+/g, '') : '';
    }

    protected generateImportRecordQuery(record: MediaDocRecord): {} {
        if (record.type.toLowerCase() === 'audio' && record['mdocaudios'] && record['mdocaudios'].length > 0) {
            return {
                where: {
                    a_fav_url_hex: {
                        'in': [this.stringToHex((<BaseAudioRecord>record['mdocaudios'][0]).fileName)]
                    },
                    type_ss: {
                        'in': [record.type.toLowerCase()]
                    }
                }
            };
        }
        if (record.type.toLowerCase() === 'image' && record['mdocimages'] && record['mdocimages'].length > 0) {
            return {
                where: {
                    i_fav_url_hex: {
                        'in': [this.stringToHex((<BaseImageRecord>record['mdocimages'][0]).fileName)]
                    },
                    type_ss: {
                        'in': [record.type.toLowerCase()]
                    }
                }
            };
        }
        if (record.type.toLowerCase() === 'video' && record['mdocvideos'] && record['mdocvideos'].length > 0) {
            return {
                where: {
                    v_fav_url_hex: {
                        'in': [this.stringToHex((<BaseVideoRecord>record['mdocvideos'][0]).fileName)]
                    },
                    type_ss: {
                        'in': [record.type.toLowerCase()]
                    }
                }
            };
        }
        if (record.type.toLowerCase() === 'album') {
            return {
                where: {
                    name_lower_hex: {
                        'in': [this.stringToHex((record.artist + ' ' + record.name).toLowerCase())]
                    },
                    type_ss: {
                        'in': [record.type.toLowerCase()]
                    }
                }
            };
        }

        return {
            where: {
                name_lower_hex: {
                    'in': [this.stringToHex(record.name.toLowerCase())]
                },
                type_ss: {
                    'in': [record.type.toLowerCase()]
                }
            }
        };
    }

    protected generateImportRecordName(record: MediaDocRecord): {} {
        if (record['mdocaudios'] && record['mdocaudios'].length > 0) {
            return record.type + ' ' + record.name +  ' ' + (<BaseAudioRecord>record['mdocaudios'][0]).fileName;
        }
        if (record['mdocimages'] && record['mdocimages'].length > 0) {
            return record.type + ' ' + record.name +  ' ' + (<BaseImageRecord>record['mdocimages'][0]).fileName;
        }
        if (record['mdocvideos'] && record['mdocvideos'].length > 0) {
            return record.type + ' ' + record.name +  ' ' + (<BaseVideoRecord>record['mdocvideos'][0]).fileName;
        }

        return record.type + ' ' + record.name +  '';
    }

    public stringToHex(arg: string): string {
        return Buffer.from(arg.toLowerCase(), 'utf8').toString('hex').toLowerCase();
    }

    // TODO move to commons
    importRecord(record: MediaDocRecord, recordIdMapping: {}, recordRecoverIdMapping: {}, opts?: any): Promise<MediaDocRecord> {
        if (record.get('mdoclinkedartists')) {
            const artists: MediaDocLinkedArtistRecord[] = record.get('mdoclinkedartists');
            for (const artist of artists) {
                const idFieldName = 'artistId';
                if (recordIdMapping[idFieldName] && recordIdMapping[idFieldName][artist.refId]) {
                    console.log('orig mdoclinkedartist.refId for: ' + record.id + ' map ref ' + idFieldName + ' ' + artist.refId
                        + '->' + recordIdMapping[idFieldName][artist.refId]);
                    artist.refId = recordIdMapping[idFieldName][artist.refId] + '';
                }
            }
        }

        return super.importRecord(record, recordIdMapping, recordRecoverIdMapping, opts);
    }

}
