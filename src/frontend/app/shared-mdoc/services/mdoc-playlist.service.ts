import {Injectable} from '@angular/core';
import {MediaDocRecord} from '../../../shared/mdoc-commons/model/records/mdoc-record';
import {CommonDocPlaylistService} from '@dps/mycms-commons/dist/search-commons/services/cdoc-playlist.service';
import {CommonDocContentUtils} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/services/cdoc-contentutils.service';

@Injectable()
export class MediaDocPlaylistService extends CommonDocPlaylistService<MediaDocRecord> {

    constructor(protected contentUtils: CommonDocContentUtils) {
        super();
    }

    generateM3uEntityPath(pathPrefix: string, record: MediaDocRecord): string {
        return this.contentUtils.getPreferredFullMediaUrl(record);
    }

    public generateM3uEntityInfo(record: MediaDocRecord): string {
        if (!record || !record.name) {
            return undefined;
        }

        return '#EXTINF:-1,' + '[' + record.genre + '] ' + record.artist + '/' + record.album + '/' + record.name;
    }
}
