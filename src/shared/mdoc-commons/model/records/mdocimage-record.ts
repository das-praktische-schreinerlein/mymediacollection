import {
    BaseImageRecord,
    BaseImageRecordFactory,
    BaseImageRecordValidator
} from '@dps/mycms-commons/dist/search-commons/model/records/baseimage-record';
import {BaseEntityRecordRelationsType} from '@dps/mycms-commons/dist/search-commons/model/records/base-entity-record';

export class MediaDocImageRecord extends BaseImageRecord {
    mdoc_id: string;

    getMediaId(): string {
        return this.mdoc_id;
    }
    toString() {
        return 'MediaDocImageRecord Record {\n' +
            '  id: ' + this.id + ',\n' +
            '  fileName: ' + this.fileName + '\n' +
            '  name: ' + this.name + ',\n' +
            '  mdoc_id: ' + this.mdoc_id + '' +
            '}';
    }
}

export class MediaDocImageRecordFactory extends BaseImageRecordFactory {
    public static instance = new MediaDocImageRecordFactory();

    static createSanitized(values: {}): MediaDocImageRecord {
        const sanitizedValues = MediaDocImageRecordFactory.instance.getSanitizedValues(values, {});
        return new MediaDocImageRecord(sanitizedValues);
    }

    static cloneSanitized(doc: MediaDocImageRecord): MediaDocImageRecord {
        const sanitizedValues = MediaDocImageRecordFactory.instance.getSanitizedValuesFromObj(doc);
        return new MediaDocImageRecord(sanitizedValues);
    }
}

export class MediaDocImageRecordValidator extends BaseImageRecordValidator {
    public static instance = new MediaDocImageRecordValidator();
}

export let MediaDocImageRecordRelation: BaseEntityRecordRelationsType = {
    belongsTo: {
        mdoc: {
            // database column
            foreignKey: 'mdoc_id',
            // reference to related object in memory
            localField: 'mdoc',
            mapperKey: 'mdoc'
        }
    }
};
