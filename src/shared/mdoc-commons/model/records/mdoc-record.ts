import {
    BaseEntityRecord,
    BaseEntityRecordFieldConfig,
    BaseEntityRecordRelationsType
} from '@dps/mycms-commons/dist/search-commons/model/records/base-entity-record';
import {
    DbIdValidationRule,
    GenericValidatorDatatypes,
    NameValidationRule,
    NumberValidationRule
} from '@dps/mycms-commons/dist/search-commons/model/forms/generic-validator.util';
import {isArray} from 'util';
import {
    CommonDocRecord,
    CommonDocRecordFactory,
    CommonDocRecordValidator
} from '@dps/mycms-commons/dist/search-commons/model/records/cdoc-entity-record';
import {MediaDocAudioRecord, MediaDocAudioRecordFactory, MediaDocAudioRecordValidator} from './mdocaudio-record';
import {MediaDocImageRecord, MediaDocImageRecordFactory, MediaDocImageRecordValidator} from './mdocimage-record';
import {MediaDocVideoRecord, MediaDocVideoRecordFactory, MediaDocVideoRecordValidator} from './mdocvideo-record';
import {MediaDocRatePersonalRecord, MediaDocRatePersonalRecordFactory, MediaDocRatePersonalRecordValidator} from './mdocratepers-record';
import {MediaDocMediaMetaRecord, MediaDocMediaMetaRecordFactory, MediaDocMediaMetaRecordValidator} from './mdocmediameta-record';
import {
    MediaDocNavigationObjectRecord,
    MediaDocNavigationObjectRecordFactory,
    MediaDocNavigationObjectRecordValidator
} from './mdocnavigationobject-record';
import {
    MediaDocExtendedObjectPropertyRecord,
    MediaDocExtendedObjectPropertyRecordFactory,
    MediaDocExtendedObjectPropertyRecordValidator
} from './mdocextendedobjectproperty-record';
import {
    MediaDocLinkedArtistRecord,
    MediaDocLinkedArtistRecordFactory,
    MediaDocLinkedArtistRecordValidator
} from './mdoclinkedartist-record';
import {
    BaseMusicMediaDocRecordReferencesType,
    BaseMusicMediaDocRecordType
} from '@dps/mycms-commons/dist/search-commons/model/records/basemusic-record';
import {
    MediaDocLinkedPlaylistRecord,
    MediaDocLinkedPlaylistRecordFactory,
    MediaDocLinkedPlaylistRecordValidator
} from './mdoclinkedplaylist-record';

export interface MediaDocRecordType extends BaseMusicMediaDocRecordType, BaseMusicMediaDocRecordReferencesType {
}

export let MediaDocRecordRelation: BaseEntityRecordRelationsType;
MediaDocRecordRelation = {
    hasOne: {
        mdocmediameta: {
            // database column
            foreignKey: 'mdoc_id',
            // reference to related objects in memory
            localField: 'mdocmediameta',
            mapperKey: 'mdocmediameta',
            factory: MediaDocMediaMetaRecordFactory.instance,
            validator: MediaDocMediaMetaRecordValidator.instance
        },
        mdocratepers: {
            // database column
            foreignKey: 'mdoc_id',
            // reference to related objects in memory
            localField: 'mdocratepers',
            mapperKey: 'mdocratepers',
            factory: MediaDocRatePersonalRecordFactory.instance,
            validator: MediaDocRatePersonalRecordValidator.instance
        }
    },
    hasMany: {
        mdocaudio: {
            // database column
            foreignKey: 'mdoc_id',
            // reference to related objects in memory
            localField: 'mdocaudios',
            mapperKey: 'mdocaudio',
            factory: MediaDocAudioRecordFactory.instance,
            validator: MediaDocAudioRecordValidator.instance
        },
        mdocimage: {
            // database column
            foreignKey: 'mdoc_id',
            // reference to related objects in memory
            localField: 'mdocimages',
            mapperKey: 'mdocimage',
            factory: MediaDocImageRecordFactory.instance,
            validator: MediaDocImageRecordValidator.instance
        },
        mdocvideo: {
            // database column
            foreignKey: 'mdoc_id',
            // reference to related objects in memory
            localField: 'mdocvideos',
            mapperKey: 'mdocvideo',
            factory: MediaDocVideoRecordFactory.instance,
            validator: MediaDocVideoRecordValidator.instance
        },
        mdocnavigationobject: {
            // database column
            foreignKey: 'mdoc_id',
            // reference to related objects in memory
            localField: 'mdocnavigationobjects',
            mapperKey: 'mdocnavigationobject',
            factory: MediaDocNavigationObjectRecordFactory.instance,
            validator: MediaDocNavigationObjectRecordValidator.instance
        },
        mdocextendedobjectproperty: {
            // database column
            foreignKey: 'mdoc_id',
            // reference to related objects in memory
            localField: 'mdocextendedobjectproperties',
            mapperKey: 'mdocextendedobjectproperty',
            factory: MediaDocExtendedObjectPropertyRecordFactory.instance,
            validator: MediaDocExtendedObjectPropertyRecordValidator.instance
        },
        mdoclinkedartist: {
            // database column
            foreignKey: 'mdoc_id',
            // reference to related objects in memory
            localField: 'mdoclinkedartists',
            mapperKey: 'mdoclinkedartist',
            factory: MediaDocLinkedArtistRecordFactory.instance,
            validator: MediaDocLinkedArtistRecordValidator.instance
        },
        mdoclinkedplaylist: {
            // database column
            foreignKey: 'mdoc_id',
            // reference to related objects in memory
            localField: 'mdoclinkedplaylists',
            mapperKey: 'mdoclinkedplaylist',
            factory: MediaDocLinkedPlaylistRecordFactory.instance,
            validator: MediaDocLinkedPlaylistRecordValidator.instance
        }
    }
};

export class MediaDocRecord extends CommonDocRecord implements MediaDocRecordType {
    static mdocRelationNames = []
        .concat(MediaDocRecordRelation.hasOne ? Object.keys(MediaDocRecordRelation.hasOne).map(key => {
            return MediaDocRecordRelation.hasOne[key].localField;
        }) : [])
        .concat(MediaDocRecordRelation.hasMany ? Object.keys(MediaDocRecordRelation.hasMany).map(key => {
            return MediaDocRecordRelation.hasMany[key].localField;
        }) : []);
    static mdocValidationRelationNames = []
        .concat(MediaDocRecordRelation.hasOne ? Object.keys(MediaDocRecordRelation.hasOne).map(key => {
            return MediaDocRecordRelation.hasOne[key].localField;
        }) : []);
    static mdocFields = {
        audioId: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.ID, new DbIdValidationRule(false)),
        artistId: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.ID, new DbIdValidationRule(false)),
        albumId: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.ID, new DbIdValidationRule(false)),
        genreId: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.ID, new DbIdValidationRule(false)),

        album: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.NAME, new NameValidationRule(false)),
        albumArtist: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.NAME, new NameValidationRule(false)),
        albumGenre: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.NAME, new NameValidationRule(false)),
        artist: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.NAME, new NameValidationRule(false)),
        genre: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.NAME, new NameValidationRule(false)),
        trackNo: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.NUMBER, new NumberValidationRule(false, -1, 10000, undefined))
    };

    albumId: number;
    audioId: number;
    artistId: number;
    genreId: number;

    album: string;
    albumArtist: string;
    albumGenre: string;
    artist: string;
    genre: string;
    trackNo: number;

    static cloneToSerializeToJsonObj(baseRecord: MediaDocRecord, anonymizeMedia?: boolean): {}  {
        const record  = {};
        for (const key in baseRecord) {
            record[key] = baseRecord[key];
        }
        for (const relationName of MediaDocRecord.mdocRelationNames) {
            record[relationName] = baseRecord.get(relationName);
        }

        if (anonymizeMedia === true) {
            let relationName = 'mdocaudios';
            if (isArray(record[relationName])) {
                for (const media of record[relationName]) {
                    media.fileName = 'anonymized.MP3';
                }
            }
            relationName = 'mdocimages';
            if (isArray(record[relationName])) {
                for (const media of record[relationName]) {
                    media.fileName = 'anonymized.JPG';
                }
            }
            relationName = 'mdocvideos';
            if (isArray(record[relationName])) {
                for (const media of record[relationName]) {
                    media.fileName = 'anonymized.MP4';
                }
            }
        }

        return record;
    }

    toString() {
        return 'MediaDocRecord Record {\n' +
            '  id: ' + this.id + ',\n' +
            '  name: ' + this.name + ',\n' +
            '  type: ' + this.type + '' +
            '}';
    }

    toSerializableJsonObj(anonymizeMedia?: boolean): {} {
        return MediaDocRecord.cloneToSerializeToJsonObj(this, anonymizeMedia);
    }

    isValid(): boolean {
        return MediaDocRecordValidator.instance.isValid(this);
    }
}

export class MediaDocRecordFactory extends CommonDocRecordFactory {
    public static instance = new MediaDocRecordFactory();

    static createSanitized(values: {}): MediaDocRecord {
        const sanitizedValues = MediaDocRecordFactory.instance.getSanitizedValues(values, {});
        return new MediaDocRecord(sanitizedValues);
    }

    static cloneSanitized(doc: MediaDocRecord): MediaDocRecord {
        const sanitizedValues = MediaDocRecordFactory.instance.getSanitizedValuesFromObj(doc);
        return new MediaDocRecord(sanitizedValues);
    }

    getSanitizedValues(values: {}, result: {}): {} {
        super.getSanitizedValues(values, result);
        this.sanitizeFieldValues(values, MediaDocRecord.mdocFields, result, '');
        return result;
    }

    getSanitizedRelationValues(relation: string, values: {}): {} {
        switch (relation) {
            case 'mdocaudios':
                return  MediaDocAudioRecordFactory.instance.getSanitizedValues(values, {});
            case 'mdocvideos':
                return  MediaDocVideoRecordFactory.instance.getSanitizedValues(values, {});
            case 'mdocimages':
                return  MediaDocImageRecordFactory.instance.getSanitizedValues(values, {});
            case 'mdocratepers':
                return  MediaDocRatePersonalRecordFactory.instance.getSanitizedValues(values, {});
            case 'mdocmediameta':
                return MediaDocMediaMetaRecordFactory.instance.getSanitizedValues(values, {});
            case 'mdocnavigationobjects':
                return MediaDocNavigationObjectRecordFactory.instance.getSanitizedValues(values, {});
            case 'mdocextendedobjectproperties':
                return MediaDocExtendedObjectPropertyRecordFactory.instance.getSanitizedValues(values, {});
            case 'mdoclinkedartists':
                return MediaDocLinkedArtistRecordFactory.instance.getSanitizedValues(values, {});
            case 'mdoclinkedplaylist':
                return MediaDocLinkedArtistRecordFactory.instance.getSanitizedValues(values, {});
            default:
                return super.getSanitizedRelationValues(relation, values);
        }
    };
}

export class MediaDocRecordValidator extends CommonDocRecordValidator {
    public static instance = new MediaDocRecordValidator();

    validateMyFieldRules(values: {}, errors: string[], fieldPrefix?: string, errFieldPrefix?: string): boolean {
        fieldPrefix = fieldPrefix !== undefined ? fieldPrefix : '';
        errFieldPrefix = errFieldPrefix !== undefined ? errFieldPrefix : '';

        const state = super.validateMyFieldRules(values, errors, fieldPrefix, errFieldPrefix);

        return this.validateFieldRules(values, MediaDocRecord.mdocFields, fieldPrefix, errors, errFieldPrefix) && state;
    }

    validateMyValueRelationRules(values: {}, errors: string[], fieldPrefix?: string, errFieldPrefix?: string): boolean {
        return this.validateValueRelationRules(values, MediaDocRecord.mdocValidationRelationNames, errors, fieldPrefix, errFieldPrefix);
    }

    validateMyRelationRules(doc: BaseEntityRecord, errors: string[], fieldPrefix?: string, errFieldPrefix?: string): boolean {
        return this.validateRelationRules(doc, MediaDocRecord.mdocRelationNames, errors, fieldPrefix, errFieldPrefix);
    }

    protected validateRelationDoc(relation: string, doc: BaseEntityRecord, errFieldPrefix?: string): string[] {
        if (relation === 'mdocaudios') {
            return MediaDocAudioRecordValidator.instance.validate(<MediaDocAudioRecord>doc, errFieldPrefix);
        } else if (relation === 'mdocimages') {
            return MediaDocImageRecordValidator.instance.validate(<MediaDocImageRecord>doc, errFieldPrefix);
        } else if (relation === 'mdocvideos') {
            return MediaDocVideoRecordValidator.instance.validate(<MediaDocVideoRecord>doc, errFieldPrefix);
        } else if (relation === 'mdocmediameta') {
            return MediaDocMediaMetaRecordValidator.instance.validate(<MediaDocMediaMetaRecord>doc, errFieldPrefix);
        } else if (relation === 'mdocratepers') {
            return MediaDocRatePersonalRecordValidator.instance.validate(<MediaDocRatePersonalRecord>doc, errFieldPrefix);
        } else if (relation === 'mdocnavigationobjects') {
            return MediaDocNavigationObjectRecordValidator.instance.validate(<MediaDocNavigationObjectRecord>doc, errFieldPrefix);
        } else if (relation === 'mdocextendedobjectproperties') {
            return MediaDocExtendedObjectPropertyRecordValidator.instance.validate(<MediaDocExtendedObjectPropertyRecord>doc, errFieldPrefix);
        } else if (relation === 'mdoclinkedartists') {
            return MediaDocLinkedArtistRecordValidator.instance.validate(<MediaDocLinkedArtistRecord>doc, errFieldPrefix);
        } else if (relation === 'mdoclinkedplaylists') {
            return MediaDocLinkedPlaylistRecordValidator.instance.validate(<MediaDocLinkedPlaylistRecord>doc, errFieldPrefix);
        } else {
            throw new Error('unknown relation:' + relation);
        }
    };

    protected validateValueRelationDoc(relation: string, values: {}, fieldPrefix?: string, errFieldPrefix?: string): string[] {
        if (relation === 'mdocaudios') {
            return MediaDocAudioRecordValidator.instance.validateValues(values, fieldPrefix, errFieldPrefix);
        } else if (relation === 'mdocimages') {
            return MediaDocImageRecordValidator.instance.validateValues(values, fieldPrefix, errFieldPrefix);
        } else if (relation === 'mdocvideos') {
            return MediaDocVideoRecordValidator.instance.validateValues(values, fieldPrefix, errFieldPrefix);
        } else if (relation === 'mdocmediameta') {
            return MediaDocMediaMetaRecordValidator.instance.validateValues(values, fieldPrefix, errFieldPrefix);
        } else if (relation === 'mdocratepers') {
            return MediaDocRatePersonalRecordValidator.instance.validateValues(values, fieldPrefix, errFieldPrefix);
        } else if (relation === 'mdocnavigationobjects') {
            return MediaDocNavigationObjectRecordValidator.instance.validateValues(values, fieldPrefix, errFieldPrefix);
        } else if (relation === 'mdocextendedobjectproperties') {
            return MediaDocExtendedObjectPropertyRecordValidator.instance.validateValues(values, fieldPrefix, errFieldPrefix);
        } else if (relation === 'mdoclinkedartists') {
            return MediaDocLinkedArtistRecordValidator.instance.validateValues(values, fieldPrefix, errFieldPrefix);
        } else if (relation === 'mdoclinkedplaylists') {
            return MediaDocLinkedPlaylistRecordValidator.instance.validateValues(values, fieldPrefix, errFieldPrefix);
        } else {
            throw new Error('unknown relation:' + relation);
        }
    };
}
