import {
    BaseEntityRecordFactory,
    BaseEntityRecordFieldConfig,
    BaseEntityRecordRelationsType,
    BaseEntityRecordValidator
} from '@dps/mycms-commons/dist/search-commons/model/records/base-entity-record';
import {
    BaseExtendedObjectPropertyRecord,
    BaseExtendedObjectPropertyRecordType
} from '@dps/mycms-commons/dist/search-commons/model/records/baseextendedobjectproperty-record';
import {GenericValidatorDatatypes, IdValidationRule} from '@dps/mycms-commons/dist/search-commons/model/forms/generic-validator.util';

// tslint:disable-next-line:no-empty-interface
export interface MediaDocExtendedObjectPropertyRecordType extends BaseExtendedObjectPropertyRecordType {
}

export class MediaDocExtendedObjectPropertyRecord extends BaseExtendedObjectPropertyRecord
    implements MediaDocExtendedObjectPropertyRecordType {
    static extendedObjectPropertyFields = {
        ... BaseExtendedObjectPropertyRecord.extendedObjectPropertyFields,
        mdoc_id: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.ID, new IdValidationRule(false))
    };

    mdoc_id: string;

    toString() {
        return 'MediaDocExtendedObjectPropertyRecord Record {\n' +
            '  mdoc_id: ' + this.mdoc_id + ',\n' +
            '  id: ' + this.id + ',\n' +
            '  category: ' + this.category + ',\n' +
            '  name: ' + this.name + ',\n' +
            '  value: ' + this.value + ')\n' +
            '}';
    }
}

export class MediaDocExtendedObjectPropertyRecordFactory extends BaseEntityRecordFactory {
    public static instance = new MediaDocExtendedObjectPropertyRecordFactory();

    static createSanitized(values: {}): MediaDocExtendedObjectPropertyRecord {
        const sanitizedValues = MediaDocExtendedObjectPropertyRecordFactory.instance.getSanitizedValues(values, {});
        return new MediaDocExtendedObjectPropertyRecord(sanitizedValues);
    }

    static cloneSanitized(doc: MediaDocExtendedObjectPropertyRecord): MediaDocExtendedObjectPropertyRecord {
        const sanitizedValues = MediaDocExtendedObjectPropertyRecordFactory.instance.getSanitizedValuesFromObj(doc);
        return new MediaDocExtendedObjectPropertyRecord(sanitizedValues);
    }

    getSanitizedValues(values: {}, result: {}): {} {
        super.getSanitizedValues(values, result);
        this.sanitizeFieldValues(values, MediaDocExtendedObjectPropertyRecord.extendedObjectPropertyFields, result, '');
        return result;
    }
}

export class MediaDocExtendedObjectPropertyRecordValidator extends BaseEntityRecordValidator {
    public static instance = new MediaDocExtendedObjectPropertyRecordValidator();

    validateMyFieldRules(values: {}, errors: string[], fieldPrefix?: string, errFieldPrefix?: string): boolean {
        fieldPrefix = fieldPrefix !== undefined ? fieldPrefix : '';
        errFieldPrefix = errFieldPrefix !== undefined ? errFieldPrefix : '';

        const state = super.validateMyFieldRules(values, errors, fieldPrefix, errFieldPrefix);

        return this.validateFieldRules(values, MediaDocExtendedObjectPropertyRecord.extendedObjectPropertyFields, fieldPrefix,
            errors, errFieldPrefix) && state;
    }
}

export let MediaDocExtendedObjectPropertyRecordRelation: BaseEntityRecordRelationsType = {
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
