import {Schema} from 'js-data';
import {BaseEntityRecordSchema} from '@dps/mycms-commons/dist/search-commons/model/schemas/base-entity-record-schema';

export const MediaDocNavigationObjectRecordSchema = new Schema({
    $schema: 'http://json-schema.org/draft-04/schema#',
    title: 'MediaDocNavigationObject',
    description: 'Schema for a MediaDocNavigationObject Record.',
    extends: BaseEntityRecordSchema,
    type: 'object',
    properties: {
        name: {type: 'string'},
        navid: {type: 'string'},
        navtype: {type: 'string'},
        mdoc_id: {type: 'string', indexed: true}
    }
})

