import {Schema} from 'js-data';
import {BaseEntityRecordSchema} from '@dps/mycms-commons/dist/search-commons/model/schemas/base-entity-record-schema';

export const MediaDocExtendedObjectPropertyRecordSchema = new Schema({
    $schema: 'http://json-schema.org/draft-04/schema#',
    title: 'MediaDocExtendedObjectProperty',
    description: 'Schema for a MediaDocExtendedObjectProperty Record.',
    extends: BaseEntityRecordSchema,
    type: 'object',
    properties: {
        category: {type: 'string'},
        name: {type: 'string'},
        value: {type: 'string'},
        mdoc_id: {type: 'string', indexed: true}
    }
});
