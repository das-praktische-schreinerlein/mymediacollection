import {Schema} from 'js-data';
import {BaseEntityRecordSchema} from '@dps/mycms-commons/dist/search-commons/model/schemas/base-entity-record-schema';

export const MediaDocLinkedArtistRecordSchema = new Schema({
    $schema: 'http://json-schema.org/draft-04/schema#',
    title: 'MediaDocLinkedArtist',
    description: 'Schema for a MediaDocLinkedArtist Record.',
    extends: BaseEntityRecordSchema,
    type: 'object',
    properties: {
        type: {type: 'string'},
        name: {type: 'string'},
        refId: {type: 'string', indexed: true},
        mdoc_id: {type: 'string', indexed: true}
    }
});
