import {BaseEntityRecordSchema} from '@dps/mycms-commons/dist/search-commons/model/schemas/base-entity-record-schema';
import {Schema} from 'js-data';

export const MediaDocAudioRecordSchema = new Schema({
    $schema: 'http://json-schema.org/draft-04/schema#',
    title: 'MediaDocAudio',
    description: 'Schema for a MediaDocAudio Record.',
    extends: BaseEntityRecordSchema,
    type: 'object',
    properties: {
        descTxt: {type: 'string'},
        descMd: {type: 'string'},
        descHtml: {type: 'string'},
        fileName: {type: 'string'},
        name: {type: 'string'},
        mdoc_id: {type: 'string', indexed: true}
    }
});
