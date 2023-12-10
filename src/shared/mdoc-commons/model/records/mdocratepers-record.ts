import {
    BaseEntityRecord,
    BaseEntityRecordFactory,
    BaseEntityRecordFieldConfig,
    BaseEntityRecordRelationsType,
    BaseEntityRecordType,
    BaseEntityRecordValidator
} from '@dps/mycms-commons/dist/search-commons/model/records/base-entity-record';
import {GenericValidatorDatatypes, NumberValidationRule} from '@dps/mycms-commons/dist/search-commons/model/forms/generic-validator.util';

export interface MediaDocRatePersonalRecordType extends BaseEntityRecordType {
    gesamt: number;
}

export class MediaDocRatePersonalRecord extends BaseEntityRecord implements MediaDocRatePersonalRecordType {
    static ratepersonalFields = {
        gesamt: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.NUMBER,
            new NumberValidationRule(false, -1, 15, undefined)),
    };

    gesamt: number;
    mdoc_id: string;

    toString() {
        return 'MediaDocRatePersonalRecord Record {\n' +
            '  id: ' + this.id + ',\n' +
            '  gesamt: ' + this.gesamt + ',\n' +
            '  mdoc_id: ' + this.mdoc_id + '' +
            '}';
    }
}

export class MediaDocRatePersonalRecordFactory extends BaseEntityRecordFactory {
    public static instance = new MediaDocRatePersonalRecordFactory();

    static createSanitized(values: {}): MediaDocRatePersonalRecord {
        const sanitizedValues = MediaDocRatePersonalRecordFactory.instance.getSanitizedValues(values, {});
        return new MediaDocRatePersonalRecord(sanitizedValues);
    }

    static cloneSanitized(doc: MediaDocRatePersonalRecord): MediaDocRatePersonalRecord {
        const sanitizedValues = MediaDocRatePersonalRecordFactory.instance.getSanitizedValuesFromObj(doc);
        return new MediaDocRatePersonalRecord(sanitizedValues);
    }

    getSanitizedValues(values: {}, result: {}): {} {
        super.getSanitizedValues(values, result);
        this.sanitizeFieldValues(values, MediaDocRatePersonalRecord.ratepersonalFields, result, '');
        return result;
    }
}

export class MediaDocRatePersonalRecordValidator extends BaseEntityRecordValidator {
    public static instance = new MediaDocRatePersonalRecordValidator();

    validateMyFieldRules(values: {}, errors: string[], fieldPrefix?: string, errFieldPrefix?: string): boolean {
        fieldPrefix = fieldPrefix !== undefined ? fieldPrefix : '';
        errFieldPrefix = errFieldPrefix !== undefined ? errFieldPrefix : '';

        const state = super.validateMyFieldRules(values, errors, fieldPrefix, errFieldPrefix);

        return this.validateFieldRules(values, MediaDocRatePersonalRecord.ratepersonalFields, fieldPrefix, errors, errFieldPrefix) && state;
    }
}


export let MediaDocRatePersonalRecordRelation: BaseEntityRecordRelationsType = {
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
