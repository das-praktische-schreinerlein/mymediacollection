import {BaseEntityRecordSchema} from '@dps/mycms-commons/dist/search-commons/model/schemas/base-entity-record-schema';
import {Schema} from 'js-data';

export const MediaDocMediaMetaRecordSchema = new Schema({
    $schema: 'http://json-schema.org/draft-04/schema#',
    title: 'MediaDocMediaMeta',
    description: 'Schema for a MediaDocMediaMeta Record.',
    extends: BaseEntityRecordSchema,
    type: 'object',
    properties: {
        dur: {type: 'number'},
        // TODO: add type validation ifor date in later version -> but date-values can be string|Date
        fileCreated: {},
        fileName: {type: 'string'},
        fileSize: {type: 'number'},
        metadata: {type: 'string'},
        recordingDate: {},
        resolution: {type: 'string'},
        mdoc_id: {type: 'string', indexed: true}
    }
});
