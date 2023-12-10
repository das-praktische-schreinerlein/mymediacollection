import {MediaDocRecord} from '../shared/mdoc-commons/model/records/mdoc-record';
import {MediaDocServerPlaylistService} from './mdoc-serverplaylist.service';
import {BaseAudioRecord} from '@dps/mycms-commons/dist/search-commons/model/records/baseaudio-record';
import {BaseImageRecord} from '@dps/mycms-commons/dist/search-commons/model/records/baseimage-record';
import {CommonDocMusicFileExportManager} from '@dps/mycms-server-commons/dist/backend-commons/modules/cdoc-musicfile-export.service';
import {BaseVideoRecord} from '@dps/mycms-commons/dist/search-commons/model/records/basevideo-record';

export class MediaDocMusicFileExportManager extends CommonDocMusicFileExportManager<MediaDocRecord> {
    constructor(baseDir: string, playlistService: MediaDocServerPlaylistService) {
        super(baseDir, playlistService);
    }

    protected getDetailAudioRecords(mdoc: MediaDocRecord): BaseAudioRecord[] {
        return mdoc.get('mdocaudios');
    }

    protected getDetailImageRecords(mdoc: MediaDocRecord): BaseImageRecord[] {
        return mdoc.get('mdocimages');
    }

    protected getDetailVideoRecords(mdoc: MediaDocRecord): BaseVideoRecord[] {
        return mdoc.get('mdocvideos');
    }
}
