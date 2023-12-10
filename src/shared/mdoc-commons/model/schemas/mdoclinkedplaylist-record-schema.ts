import {Schema} from 'js-data';
import {BaseEntityRecordSchema} from '@dps/mycms-commons/dist/search-commons/model/schemas/base-entity-record-schema';

export const MediaDocLinkedPlaylistRecordSchema = new Schema({
    $schema: 'http://json-schema.org/draft-04/schema#',
    title: 'MediaDocLinkedPlaylist',
    description: 'Schema for a MediaDocLinkedPlaylist Record.',
    extends: BaseEntityRecordSchema,
    type: 'object',
    properties: {
        type: {type: 'string'},
        name: {type: 'string'},
        refId: {type: 'string', indexed: true},
        position: {type: 'number'},
        details: {type: 'string'},
        mdoc_id: {type: 'string', indexed: true}
    }
});
