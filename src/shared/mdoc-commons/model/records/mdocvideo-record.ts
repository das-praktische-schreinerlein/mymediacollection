import {
    BaseVideoRecord,
    BaseVideoRecordFactory,
    BaseVideoRecordValidator
} from '@dps/mycms-commons/dist/search-commons/model/records/basevideo-record';
import {BaseEntityRecordRelationsType} from '@dps/mycms-commons/dist/search-commons/model/records/base-entity-record';

export class MediaDocVideoRecord extends BaseVideoRecord {
    mdoc_id: string;

    getMediaId(): string {
        return this.mdoc_id;
    }

    toString() {
        return 'MediaDocVideoRecord Record {\n' +
            '  id: ' + this.id + ',\n' +
            '  fileName: ' + this.fileName + '\n' +
            '  name: ' + this.name + ',\n' +
            '  mdoc_id: ' + this.mdoc_id + '' +
            '}';
    }
}

export class MediaDocVideoRecordFactory extends BaseVideoRecordFactory {
    public static instance = new MediaDocVideoRecordFactory();

    static createSanitized(values: {}): MediaDocVideoRecord {
        const sanitizedValues = MediaDocVideoRecordFactory.instance.getSanitizedValues(values, {});
        return new MediaDocVideoRecord(sanitizedValues);
    }

    static cloneSanitized(doc: MediaDocVideoRecord): MediaDocVideoRecord {
        const sanitizedValues = MediaDocVideoRecordFactory.instance.getSanitizedValuesFromObj(doc);
        return new MediaDocVideoRecord(sanitizedValues);
    }

}

export class MediaDocVideoRecordValidator extends BaseVideoRecordValidator {
    public static instance = new MediaDocVideoRecordValidator();
}

export let MediaDocVideoRecordRelation: BaseEntityRecordRelationsType = {
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
