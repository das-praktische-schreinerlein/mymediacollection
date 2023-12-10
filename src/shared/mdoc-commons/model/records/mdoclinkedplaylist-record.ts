import {
    BaseEntityRecordFactory,
    BaseEntityRecordFieldConfig,
    BaseEntityRecordRelationsType,
    BaseEntityRecordValidator
} from '@dps/mycms-commons/dist/search-commons/model/records/base-entity-record';
import {GenericValidatorDatatypes, IdValidationRule} from '@dps/mycms-commons/dist/search-commons/model/forms/generic-validator.util';
import {
    BaseLinkedPlaylistRecord,
    BaseLinkedPlaylistRecordType
} from '@dps/mycms-commons/dist/search-commons/model/records/baselinkedplaylist-record';

// tslint:disable-next-line:no-empty-interface
export interface  MediaDocLinkedPlaylistRecordType extends BaseLinkedPlaylistRecordType {
}

export class  MediaDocLinkedPlaylistRecord extends BaseLinkedPlaylistRecord implements  MediaDocLinkedPlaylistRecordType {
    static linkedPlaylistFields = {...BaseLinkedPlaylistRecord.baseLinkedPlaylistFields,
        mdoc_id: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.ID, new IdValidationRule(false))
    };

    mdoc_id: string;

    getMediaId(): string {
        return this.mdoc_id;
    }

    toString() {
        return ' MediaDocLinkedPlaylistRecord Record {\n' +
            '  id: ' + this.id + ',\n' +
            '  refId: ' + this.refId + '\n' +
            '  name: ' + this.name + ',\n' +
            '  position: ' + this.position + ',\n' +
            '  mdoc_id: ' + this.mdoc_id + '' +
            '}';
    }
}

export class  MediaDocLinkedPlaylistRecordFactory extends BaseEntityRecordFactory {
    public static instance = new  MediaDocLinkedPlaylistRecordFactory();

    static createSanitized(values: {}):  MediaDocLinkedPlaylistRecord {
        const sanitizedValues =  MediaDocLinkedPlaylistRecordFactory.instance.getSanitizedValues(values, {});
        return new  MediaDocLinkedPlaylistRecord(sanitizedValues);
    }

    static cloneSanitized(doc:  MediaDocLinkedPlaylistRecord):  MediaDocLinkedPlaylistRecord {
        const sanitizedValues =  MediaDocLinkedPlaylistRecordFactory.instance.getSanitizedValuesFromObj(doc);
        return new  MediaDocLinkedPlaylistRecord(sanitizedValues);
    }

    getSanitizedValues(values: {}, result: {}): {} {
        super.getSanitizedValues(values, result);
        this.sanitizeFieldValues(values,  MediaDocLinkedPlaylistRecord.linkedPlaylistFields, result, '');

        return result;
    }
}

export class  MediaDocLinkedPlaylistRecordValidator extends BaseEntityRecordValidator {
    public static instance = new  MediaDocLinkedPlaylistRecordValidator();

    validateMyFieldRules(values: {}, errors: string[], fieldPrefix?: string, errFieldPrefix?: string): boolean {
        fieldPrefix = fieldPrefix !== undefined ? fieldPrefix : '';
        errFieldPrefix = errFieldPrefix !== undefined ? errFieldPrefix : '';

        const state = super.validateMyFieldRules(values, errors, fieldPrefix, errFieldPrefix);
        return this.validateFieldRules(values,  MediaDocLinkedPlaylistRecord.linkedPlaylistFields, fieldPrefix, errors, errFieldPrefix) && state;
    }
}

export let  MediaDocLinkedPlaylistRecordRelation: BaseEntityRecordRelationsType = {
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
