import {
    BaseAudioRecord,
    BaseAudioRecordFactory,
    BaseAudioRecordValidator
} from '@dps/mycms-commons/dist/search-commons/model/records/baseaudio-record';
import {BaseEntityRecordRelationsType} from '@dps/mycms-commons/dist/search-commons/model/records/base-entity-record';
import './media.fix';

export class MediaDocAudioRecord extends BaseAudioRecord {
    mdoc_id: string;

    getMediaId(): string {
        return this.mdoc_id;
    }
    toString() {
        return 'MediaDocAudioRecord Record {\n' +
            '  id: ' + this.id + ',\n' +
            '  fileName: ' + this.fileName + '\n' +
            '  name: ' + this.name + ',\n' +
            '  mdoc_id: ' + this.mdoc_id + '' +
            '}';
    }
}

export class MediaDocAudioRecordFactory extends BaseAudioRecordFactory {
    public static instance = new MediaDocAudioRecordFactory();

    static createSanitized(values: {}): MediaDocAudioRecord {
        const sanitizedValues = MediaDocAudioRecordFactory.instance.getSanitizedValues(values, {});
        return new MediaDocAudioRecord(sanitizedValues);
    }

    static cloneSanitized(doc: MediaDocAudioRecord): MediaDocAudioRecord {
        const sanitizedValues = MediaDocAudioRecordFactory.instance.getSanitizedValuesFromObj(doc);
        return new MediaDocAudioRecord(sanitizedValues);
    }
}

export class MediaDocAudioRecordValidator extends BaseAudioRecordValidator {
    public static instance = new MediaDocAudioRecordValidator();
}

export let MediaDocAudioRecordRelation: BaseEntityRecordRelationsType = {
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
