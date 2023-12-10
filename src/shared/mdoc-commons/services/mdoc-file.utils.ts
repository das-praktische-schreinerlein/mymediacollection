import {IdValidationRule} from '@dps/mycms-commons/dist/search-commons/model/forms/generic-validator.util';
import {isArray} from 'util';
import {DateUtils} from '@dps/mycms-commons/dist/commons/utils/date.utils';

export class MediaDocFileUtils {
    public static parseRecordSourceFromJson(json: string): any[] {
        let data = JSON.parse(json);
        const records = [];
        const idValidator = new IdValidationRule(true);
        const mapping = {
            // facets
            rate_pers_gesamt_is: 'rate_pers_gesamt_i',
            album_id_is: 'album_id_i',
            artist_id_is: 'artist_id_i',
            audio_id_is: 'audio_id_i',
            genre_id_is: 'genre_id_i'
        };

        if (data.mdocs) {
            data = data.mdocs;
        }
        if (!isArray(data)) {
            throw new Error('no valid data to import: no array of mdocs');
        }
        data.forEach(record => {
            for (const fieldName in mapping) {
                record[fieldName] = record[mapping[fieldName]];
            }
            record['id'] = idValidator.sanitize(record['id'] + '');
            record['subtype_s'] = record['subtype_s'] ? record['subtype_s'].replace(/[-a-zA-Z_]+/g, '') : '';

            // clean keywords
            record['keywords_txt'] = (record['keywords_txt'] !== undefined ?
                record['keywords_txt'].replace(/^,/g, '').replace(/,$/g, '').replace(/,,/g, ',') : '');

            // calc facets

            for (const dateField of ['dateshow_dt']) {
                if (record[dateField] !== undefined && record[dateField] !== '') {
                    record[dateField] = DateUtils.parseDateStringWithLocaltime(record[dateField]);
                }
            }

            records.push(record);
        });

        return records;
    }

    public static normalizeCygwinPath(path: string): string {
        if (!path) {
            return path;
        }

        path = path.replace(/^\/cygdrive\/([a-z])\//g, '$1:/');

        return path;
    }
}
