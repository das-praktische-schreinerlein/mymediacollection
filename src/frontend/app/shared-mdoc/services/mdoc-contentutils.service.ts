import {Injectable} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {MediaDocRecord} from '../../../shared/mdoc-commons/model/records/mdoc-record';
import {GenericAppService} from '@dps/mycms-commons/dist/commons/services/generic-app.service';
import {CommonDocRoutingService} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/services/cdoc-routing.service';
import {
    CommonDocContentUtils,
    CommonDocContentUtilsConfig,
    CommonItemData, StructuredKeyword
} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/services/cdoc-contentutils.service';
import {BaseImageRecord} from '@dps/mycms-commons/dist/search-commons/model/records/baseimage-record';

export interface MediaDocItemData extends CommonItemData {
    coverUrl?: string
}

@Injectable()
export class MediaDocContentUtils extends CommonDocContentUtils {

    constructor(sanitizer: DomSanitizer, cdocRoutingService: CommonDocRoutingService, appService: GenericAppService) {
        super(sanitizer, cdocRoutingService, appService);
    }

    getStyleClassForRecord(record: MediaDocRecord, layout: string): string[] {
        const value = record['mdocratepers'] || {gesamt: 0};
        const rate = Math.round(((value['gesamt'] || 0) / 3) + 0.5);
        return ['list-item-persrate-' + rate, 'list-item-' + layout + '-persrate-' + rate];
    }

    getMediaDocSubItemFiltersForType(record: MediaDocRecord, type: string, theme: string, minPerPage?: number): any {
        const filters = {
            type: type
        };

        // filter theme only for locations
        if (record.type === 'LOCATION' && theme !== undefined) {
            filters['theme'] = theme;
        }
        filters['sort'] = 'ratePers';

        if (record.type === 'GENRE') {
            filters['moreFilter'] = 'genre_id_i:' + record.genreId;
            filters['sort'] = 'name';
            filters['perPage'] = 10;
            if (type === 'AUDIO') {
                filters['sort'] = 'order';
                filters['perPage'] = 99;
            }
        } else if (record.type === 'ARTIST') {
            if ((type === 'GENRE') && record.genreId) {
                filters['moreFilter'] = 'genre_id_i:' + record.genreId;
                filters['sort'] = 'name';
            } else {
                filters['moreFilter'] = 'artist_id_i:' + record.artistId;
                filters['sort'] = 'name';
                filters['perPage'] = 99;
                if (type === 'AUDIO') {
                    filters['sort'] = 'order';
                }
            }
        } else if (record.type === 'ALBUM') {
            if ((type === 'GENRE') && record.genreId) {
                filters['moreFilter'] = 'genre_id_i:' + record.genreId;
                filters['sort'] = 'name';
            } else if ((type === 'ARTIST') && record.artistId) {
                filters['moreFilter'] = 'album_id_is:' + record.albumId;
                filters['sort'] = 'name';
                filters['perPage'] = 99;
            } else {
                filters['moreFilter'] = 'album_id_i:' + record.albumId;
                filters['sort'] = 'name';
                filters['perPage'] = 99;
                if (type === 'AUDIO') {
                    filters['sort'] = 'order';
                }
            }
        } else if (record.type === 'AUDIO') {
            if ((type === 'GENRE') && record.genreId) {
                filters['moreFilter'] = 'genre_id_i:' + record.genreId;
                filters['sort'] = 'order';
            } else if ((type === 'ALBUM' || type === 'TOPALBUM') && record.albumId) {
                filters['moreFilter'] = 'album_id_i:' + record.albumId;
                filters['sort'] = 'order';
            } else if ((type === 'ARTIST' || type === 'TOPARTIST') && record.artistId) {
                filters['moreFilter'] = 'artist_id_i:' + record.artistId;
                filters['sort'] = 'order';
            } else {
                filters['moreFilter'] = 'audio_id_i:' + record.audioId;
            }
        } else if (record.type === 'PLAYLIST') {
            filters['moreFilter'] = 'playlists_txt:' + record.name;
            filters['sort'] = 'playlistPos';
            filters['perPage'] = 12;
        }

        if (type === 'TOPAUDIO') {
            if (!filters['moreFilter']) {
                filters['moreFilter'] = '';
            }
            filters['moreFilter'] += '_,_personalRateOverall:6,7,8,9,10,11,12,13,14,15';
            filters['type'] = 'AUDIO';
            filters['sort'] = 'ratePers';
            filters['perPage'] = 4;
        } if (type === 'AUDIO_FAVORITES') {
            if (!filters['moreFilter']) {
                filters['moreFilter'] = '';
            }
            filters['moreFilter'] += '_,_personalRateOverall:1,2,3,4,5,6,7,8,9,10,11,12,13,14,15';
            filters['type'] = 'AUDIO';
            filters['sort'] = 'ratePers';
            filters['perPage'] = 12;
        } else if (type === 'TOPARTIST') {
            if (!filters['moreFilter']) {
                filters['moreFilter'] = '';
            }
            filters['moreFilter'] += '_,_personalRateOverall:8,9,10,11,12,13,14,15';
            filters['type'] = 'ARTIST';
            filters['sort'] = 'ratePers';
            filters['perPage'] = 4;
        } else if (type === 'TOPALBUM') {
            if (!filters['moreFilter']) {
                filters['moreFilter'] = '';
            }
            filters['moreFilter'] += '_,_personalRateOverall:8,9,10,11,12,13,14,15';
            filters['type'] = 'ALBUM';
            filters['sort'] = 'ratePers';
            filters['perPage'] = 4;
        }

        if (minPerPage && minPerPage > 0 && minPerPage > filters['perPage']) {
            filters['perPage'] = minPerPage;
        }

        return filters;
    }

    updateItemData(itemData: MediaDocItemData, record: MediaDocRecord, layout: string): boolean {
        super.updateItemData(itemData, record, layout);
        if (record === undefined) {
            return false;
        }

        itemData.styleClassFor = this.getStyleClassForRecord(<MediaDocRecord>itemData.currentRecord, layout);

        if (itemData.currentRecord.type === 'ALBUM') {
            if (itemData.currentRecord['mdocimages'] !== undefined && itemData.currentRecord['mdocimages'].length > 0) {
                itemData.image = itemData.currentRecord['mdocimages'][0];
                itemData.coverUrl = this.getAudioCoverUrl(itemData.image);
            } else {
                itemData.coverUrl = 'assets/images/no_cover.jpg';
            }
        } else {
            if (itemData.currentRecord['mdocaudios'] !== undefined && itemData.currentRecord['mdocaudios'].length > 0) {
                itemData.audio = itemData.currentRecord['mdocaudios'][0];
                itemData.thumbnailUrl = this.getAudioThumbnailUrl(itemData.audio);
                itemData.previewUrl = this.getAudioPreviewUrl(itemData.audio);
                itemData.fullUrl = this.getFullAudioUrl(itemData.audio);
                if (itemData.currentRecord['mdocimages'] !== undefined && itemData.currentRecord['mdocimages'].length > 0) {
                    itemData.image = itemData.currentRecord['mdocimages'][0];
                    itemData.coverUrl = this.getAudioCoverUrl(itemData.image);
                } else {
                    itemData.coverUrl = 'assets/images/no_cover.jpg';
                }
            } else if (itemData.currentRecord['mdocimages'] !== undefined && itemData.currentRecord['mdocimages'].length > 0) {
                itemData.image = itemData.currentRecord['mdocimages'][0];
                itemData.thumbnailUrl = this.getThumbnailUrl(itemData.image);
                itemData.previewUrl = this.getPreviewUrl(itemData.image);
                itemData.fullUrl = this.getFullUrl(itemData.image);
            } else if (itemData.currentRecord['mdocvideos'] !== undefined && itemData.currentRecord['mdocvideos'].length > 0) {
                itemData.video = itemData.currentRecord['mdocvideos'][0];
                itemData.thumbnailUrl = this.getVideoThumbnailUrl(itemData.video);
                itemData.previewUrl = this.getVideoPreviewUrl(itemData.video);
                itemData.fullUrl = this.getFullVideoUrl(itemData.video);
            }
        }
    }

    getAudioCoverUrl(image: BaseImageRecord): string {
        if (image === undefined) {
            return 'not found';
        }

        let url: string;
        if (this.appService.getAppConfig()['useAudioAssetStoreUrls'] === true) {
            url = this.appService.getAppConfig()['audioBaseUrl'] + 'cover' + '/' + image[this.cdocRecordRefIdField];
        } else {
            url = this.appService.getAppConfig()['audioBaseUrl'] + image.fileName;
        }

        return url;
    }

    // TODO - fix in commons
    getStructuredKeywords(config: StructuredKeyword[], keywords: string[], blacklist: string[], possiblePrefixes: string[]):
        StructuredKeyword[] {
        const keywordKats: StructuredKeyword[] = [];
        if (keywords === undefined || keywords.length < 1) {
            return keywordKats;
        }

        let allowedKeywords = keywords;
        for (const keyword of blacklist) {
            if (keywords.indexOf(keyword) > -1) {
                allowedKeywords = allowedKeywords.filter(obj => obj !== keyword);
            }
        }

        for (const keywordKat of config) {
            const keywordFound = [];
            for (const keyword of keywordKat.keywords) {
                for (const prefix of (possiblePrefixes || [])) {
                    const searchPrefix = prefix + keyword;
                    if (allowedKeywords.indexOf(searchPrefix) > -1) {
                        keywordFound.push(keyword);
                        break;
                    }
                }
            }
            if (keywordFound.length > 0) {
                keywordKats.push({name: keywordKat.name, keywords: keywordFound});
            }
        }

        return keywordKats;
    }

    protected getServiceConfig(): CommonDocContentUtilsConfig {
        return {
            cdocRecordRefIdField: 'mdoc_id',
            cdocAudiosKey: 'mdocaudios',
            cdocImagesKey: 'mdocimages',
            cdocVideosKey: 'mdocvideos'
        };
    }

}
