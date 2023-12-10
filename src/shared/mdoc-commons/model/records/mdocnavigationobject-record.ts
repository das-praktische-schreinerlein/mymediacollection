import {
    BaseEntityRecordFactory,
    BaseEntityRecordFieldConfig,
    BaseEntityRecordRelationsType,
    BaseEntityRecordValidator
} from '@dps/mycms-commons/dist/search-commons/model/records/base-entity-record';
import {BaseNavigationObjectRecord} from '@dps/mycms-commons/dist/search-commons/model/records/basenavigationobject-record';
import {GenericValidatorDatatypes, IdValidationRule} from '@dps/mycms-commons/dist/search-commons/model/forms/generic-validator.util';

export class MediaDocNavigationObjectRecord extends BaseNavigationObjectRecord {
    static navigationObjectFields = {
        ...BaseNavigationObjectRecord.navigationObjectFields,
        mdoc_id: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.ID, new IdValidationRule(false))
    };

    mdoc_id: string;

    toString() {
        return 'MediaDocNavigationObjectRecord Record {\n' +
            '  mdoc_id: ' + this.mdoc_id + ',\n' +
            '  id: ' + this.id + ',\n' +
            '  name: ' + this.name + ',\n' +
            '  navid: ' + this.navid + ',\n' +
            '  navtype: ' + this.navtype + ')\n' +
            '}';
    }
}

export class MediaDocNavigationObjectRecordFactory extends BaseEntityRecordFactory {
    public static instance = new MediaDocNavigationObjectRecordFactory();

    static createSanitized(values: {}): MediaDocNavigationObjectRecord {
        const sanitizedValues = MediaDocNavigationObjectRecordFactory.instance.getSanitizedValues(values, {});
        return new MediaDocNavigationObjectRecord(sanitizedValues);
    }

    static cloneSanitized(doc: MediaDocNavigationObjectRecord): MediaDocNavigationObjectRecord {
        const sanitizedValues = MediaDocNavigationObjectRecordFactory.instance.getSanitizedValuesFromObj(doc);
        return new MediaDocNavigationObjectRecord(sanitizedValues);
    }

    getSanitizedValues(values: {}, result: {}): {} {
        super.getSanitizedValues(values, result);
        this.sanitizeFieldValues(values, MediaDocNavigationObjectRecord.navigationObjectFields, result, '');
        return result;
    }
}

export class MediaDocNavigationObjectRecordValidator extends BaseEntityRecordValidator {
    public static instance = new MediaDocNavigationObjectRecordValidator();

    validateMyFieldRules(values: {}, errors: string[], fieldPrefix?: string, errFieldPrefix?: string): boolean {
        fieldPrefix = fieldPrefix !== undefined ? fieldPrefix : '';
        errFieldPrefix = errFieldPrefix !== undefined ? errFieldPrefix : '';

        const state = super.validateMyFieldRules(values, errors, fieldPrefix, errFieldPrefix);

        return this.validateFieldRules(values, MediaDocNavigationObjectRecord.navigationObjectFields, fieldPrefix,
            errors, errFieldPrefix) && state;
    }
}

export let MediaDocNavigationObjectRecordRelation: BaseEntityRecordRelationsType = {
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
