import {
    BaseEntityRecordFieldConfig,
    BaseEntityRecordRelationsType,
    BaseEntityRecordValidator
} from '@dps/mycms-commons/dist/search-commons/model/records/base-entity-record';
import {GenericValidatorDatatypes, IdValidationRule} from '@dps/mycms-commons/dist/search-commons/model/forms/generic-validator.util';
import {BaseMediaMetaRecord, BaseMediaMetaRecordFactory} from '@dps/mycms-commons/dist/search-commons/model/records/basemediameta-record';

export class MediaDocMediaMetaRecord extends BaseMediaMetaRecord {
    static mediametaFields = {
        ... BaseMediaMetaRecord.mediametaFields,
        mdoc_id: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.ID, new IdValidationRule(false))
    };

    mdoc_id: string;

    toString() {
        return 'MediaDocMediaMetaRecord Record {\n' +
            '  id: ' + this.id + ',\n' +
            '  fileCreated: ' + this.fileCreated + ',\n' +
            '  fileName: ' + this.fileName + ',\n' +
            '  fileSize: ' + this.fileSize + ',\n' +
            '  dur: ' + this.dur + ',\n' +
            '  mdoc_id: ' + this.mdoc_id + '' +
            '}';
    }
}

export class MediaDocMediaMetaRecordFactory extends BaseMediaMetaRecordFactory {
    public static instance = new MediaDocMediaMetaRecordFactory();

    static createSanitized(values: {}): MediaDocMediaMetaRecord {
        const sanitizedValues = MediaDocMediaMetaRecordFactory.instance.getSanitizedValues(values, {});
        return new MediaDocMediaMetaRecord(sanitizedValues);
    }

    static cloneSanitized(doc: MediaDocMediaMetaRecord): MediaDocMediaMetaRecord {
        const sanitizedValues = MediaDocMediaMetaRecordFactory.instance.getSanitizedValuesFromObj(doc);
        return new MediaDocMediaMetaRecord(sanitizedValues);
    }

    getSanitizedValues(values: {}, result: {}): {} {
        super.getSanitizedValues(values, result);
        this.sanitizeFieldValues(values, MediaDocMediaMetaRecord.mediametaFields, result, '');
        return result;
    }
}

export class MediaDocMediaMetaRecordValidator extends BaseEntityRecordValidator {
    public static instance = new MediaDocMediaMetaRecordValidator();

    validateMyFieldRules(values: {}, errors: string[], fieldPrefix?: string, errFieldPrefix?: string): boolean {
        fieldPrefix = fieldPrefix !== undefined ? fieldPrefix : '';
        errFieldPrefix = errFieldPrefix !== undefined ? errFieldPrefix : '';

        const state = super.validateMyFieldRules(values, errors, fieldPrefix, errFieldPrefix);

        return this.validateFieldRules(values, MediaDocMediaMetaRecord.mediametaFields, fieldPrefix, errors, errFieldPrefix) && state;
    }
}

export let MediaDocMediaMetaRecordRelation: BaseEntityRecordRelationsType = {
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
