import {BaseEntityRecordSchema} from '@dps/mycms-commons/dist/search-commons/model/schemas/base-entity-record-schema';
import {Schema} from 'js-data';

export const MediaDocRatePersonalRecordSchema = new Schema({
    $schema: 'http://json-schema.org/draft-04/schema#',
    title: 'MediaDocRatePersonal',
    description: 'Schema for a MediaDocRatePersonal  Record.',
    extends: BaseEntityRecordSchema,
    type: 'object',
    properties: {
        gesamt: {type: 'number'},
        mdoc_id: {type: 'string', indexed: true}
    }
});
