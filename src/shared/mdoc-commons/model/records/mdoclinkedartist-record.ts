import {
    BaseEntityRecordFactory,
    BaseEntityRecordFieldConfig,
    BaseEntityRecordRelationsType,
    BaseEntityRecordValidator
} from '@dps/mycms-commons/dist/search-commons/model/records/base-entity-record';
import {BaseJoinRecord, BaseJoinRecordType} from '@dps/mycms-commons/dist/search-commons/model/records/basejoin-record';
import {GenericValidatorDatatypes, IdValidationRule} from '@dps/mycms-commons/dist/search-commons/model/forms/generic-validator.util';

// tslint:disable-next-line:no-empty-interface
export interface MediaDocLinkedArtistRecordType extends BaseJoinRecordType {
}

export class MediaDocLinkedArtistRecord extends BaseJoinRecord implements MediaDocLinkedArtistRecordType {
    static artistFields = {...BaseJoinRecord.joinFields,
        mdoc_id: new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.ID, new IdValidationRule(false))
    };

    mdoc_id: string;

    getMediaId(): string {
        return this.mdoc_id;
    }

    toString() {
        return 'MediaDocLinkedArtistRecord Record {\n' +
            '  id: ' + this.id + ',\n' +
            '  refId: ' + this.refId + '\n' +
            '  name: ' + this.name + ',\n' +
            '  type: ' + this.type + ',\n' +
            '  mdoc_id: ' + this.mdoc_id + '' +
            '}';
    }
}

export class MediaDocLinkedArtistRecordFactory extends BaseEntityRecordFactory {
    public static instance = new MediaDocLinkedArtistRecordFactory();

    static createSanitized(values: {}): MediaDocLinkedArtistRecord {
        const sanitizedValues = MediaDocLinkedArtistRecordFactory.instance.getSanitizedValues(values, {});
        return new MediaDocLinkedArtistRecord(sanitizedValues);
    }

    static cloneSanitized(doc: MediaDocLinkedArtistRecord): MediaDocLinkedArtistRecord {
        const sanitizedValues = MediaDocLinkedArtistRecordFactory.instance.getSanitizedValuesFromObj(doc);
        return new MediaDocLinkedArtistRecord(sanitizedValues);
    }

    getSanitizedValues(values: {}, result: {}): {} {
        super.getSanitizedValues(values, result);
        this.sanitizeFieldValues(values, MediaDocLinkedArtistRecord.artistFields, result, '');

        return result;
    }
}

export class MediaDocLinkedArtistRecordValidator extends BaseEntityRecordValidator {
    public static instance = new MediaDocLinkedArtistRecordValidator();

    validateMyFieldRules(values: {}, errors: string[], fieldPrefix?: string, errFieldPrefix?: string): boolean {
        fieldPrefix = fieldPrefix !== undefined ? fieldPrefix : '';
        errFieldPrefix = errFieldPrefix !== undefined ? errFieldPrefix : '';

        const state = super.validateMyFieldRules(values, errors, fieldPrefix, errFieldPrefix);
        return this.validateFieldRules(values, MediaDocLinkedArtistRecord.artistFields, fieldPrefix, errors, errFieldPrefix) && state;
    }
}

export let MediaDocLinkedArtistRecordRelation: BaseEntityRecordRelationsType = {
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
