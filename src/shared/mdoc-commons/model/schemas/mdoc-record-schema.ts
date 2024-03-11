import {BaseEntityRecordSchema} from '@dps/mycms-commons/dist/search-commons/model/schemas/base-entity-record-schema';
import {Schema} from 'js-data';

export const MediaDocRecordSchema = new Schema({
    $schema: 'http://json-schema.org/draft-04/schema#',
    title: 'MediaDoc',
    description: 'Schema for a MediaDoc Record.',
    extends: BaseEntityRecordSchema,
    type: 'object',
    properties: {
        albumId: {type: 'number'},
        audioId: {type: 'number'},
        artistId: {type: 'number'},
        genreId: {type: 'number'},
        blocked: {type: 'number'},
        // TODO: add type validation ifor date in later version -> but date-values can be string|Date
        dateshow: {},
        datestart: {},
        dateend: {},

        // TODO: add type validation for date in later version -> but date-values can be string|Date
        createdAt: {},
        updatedAt: {},
        updateVersion: {type: 'number'},

        album: {type: 'string'},
        artist: {type: 'string'},
        genre: {type: 'string'},
        trackNo: {type: 'number'},

        descTxt: {type: 'string'},
        descMd: {type: 'string'},
        descHtml: {type: 'string'},
        keywords: {type: 'string'},
        name: {type: 'string', minLength: 1, maxLength: 255},
        playlists: {type: 'string'},
        subtype: {type: 'string'},
        type: {type: 'string', minLength: 1, maxLength: 255}
    }
});
