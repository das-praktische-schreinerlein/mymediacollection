import {MediaDocRecord} from '../shared/mdoc-commons/model/records/mdoc-record';
import {CommonDocPlaylistService} from '@dps/mycms-commons/dist/search-commons/services/cdoc-playlist.service';
import {BaseAudioRecord} from '@dps/mycms-commons/dist/search-commons/model/records/baseaudio-record';
import {BaseVideoRecord} from '@dps/mycms-commons/dist/search-commons/model/records/basevideo-record';
import {BaseImageRecord} from '@dps/mycms-commons/dist/search-commons/model/records/baseimage-record';

export interface MediaDocServerPlaylistServiceConfig {
    useAudioAssetStoreUrls: boolean;
    useImageAssetStoreUrls: boolean;
    useVideoAssetStoreUrls: boolean;
    audioBaseUrl: string;
    imageBaseUrl: string;
    videoBaseUrl: string;
}

export class MediaDocServerPlaylistService extends CommonDocPlaylistService<MediaDocRecord> {

    constructor(protected config: MediaDocServerPlaylistServiceConfig) {
        super();
    }

    generateM3uEntityPath(pathPrefix: string, record: MediaDocRecord): string {
        if (record['mdocvideos'] && record['mdocvideos'].length > 0) {
            return this.getVideoUrl(record['mdocvideos'][0], 'x600', '');
        } else if (record['mdocaudios'] && record['mdocaudios'].length > 0) {
            return this.getAudioUrl(record['mdocaudios'][0], 'full', '');
        } else if (record['mdocimages'] && record['mdocimages'].length > 0) {
            return this.getImageUrl(record['mdocimages'][0], 'x600', '');
        }
    }

    getAudioUrl(audio: BaseAudioRecord, resolution: string, suffix?: string): string {
        if (audio === undefined) {
            return undefined;
        }

        if (this.config.useAudioAssetStoreUrls === true) {
            return this.config.audioBaseUrl + resolution + '/' + audio['mdoc_id'];
        } else {
            return this.config.audioBaseUrl + audio.fileName + (suffix ? suffix : '');
        }
    }

    getImageUrl(image: BaseImageRecord, resolution: string, suffix?: string): string {
        if (image === undefined) {
            return undefined;
        }

        if (this.config.useImageAssetStoreUrls === true) {
            return this.config.imageBaseUrl + resolution + '/' + image['mdoc_id'];
        } else {
            return this.config.imageBaseUrl + 'pics_' + resolution + '/' + image.fileName + (suffix ? suffix : '');
        }
    }

    getVideoUrl(video: BaseVideoRecord, resolution: string, suffix?: string): string {
        if (video === undefined) {
            return undefined;
        }

        if (this.config.useVideoAssetStoreUrls === true) {
            return this.config.videoBaseUrl + resolution + '/' + video['mdoc_id'];
        } else {
            return this.config.videoBaseUrl + 'video_' + resolution + '/' + video.fileName + (suffix ? suffix : '');
        }
    }

    public generateM3uEntityInfo(record: MediaDocRecord): string {
        if (!record || !record.name) {
            return undefined;
        }

        if (record['mdocaudios'] && record['mdocaudios'].length > 0) {
            return '#EXTINF:-1,' + '[' + record.genre + '] ' + record.artist + '/' + record.album + '/' + record.name;
        }

        return '#EXTINF:-1,' + record.name;
    }
}
