import {
    GenericValidatorDatatypes,
    RegExValidationReplaceRule
} from '@dps/mycms-commons/dist/search-commons/model/forms/generic-validator.util';
import {BaseMediaRecord} from '@dps/mycms-commons/dist/search-commons/model/records/basemedia-record';
import {BaseEntityRecordFieldConfig} from '@dps/mycms-commons/dist/search-commons/model/records/base-entity-record';
import * as XRegExp from 'xregexp/lib';

export class SimpleInsecureWinPathValidationRule extends RegExValidationReplaceRule {
    constructor(required: boolean) {
        super(required,
            XRegExp('^[^\$\"\*]*$', 'gi'),
            XRegExp('[\$\"\*]*', 'gi'), '', 4096);
    }
}

function initialize() {
    BaseMediaRecord.baseMediaFields.fileName =
        new BaseEntityRecordFieldConfig(GenericValidatorDatatypes.FILENAME, new SimpleInsecureWinPathValidationRule(true))
}

initialize();



