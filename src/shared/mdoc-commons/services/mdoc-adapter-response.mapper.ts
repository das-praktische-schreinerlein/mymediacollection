import {Mapper, Record} from 'js-data';
import {MediaDocRecord, MediaDocRecordFactory, MediaDocRecordRelation} from '../model/records/mdoc-record';
import {MapperUtils} from '@dps/mycms-commons/dist/search-commons/services/mapper.utils';
import {GenericAdapterResponseMapper} from '@dps/mycms-commons/dist/search-commons/services/generic-adapter-response.mapper';
import {BeanUtils} from '@dps/mycms-commons/dist/commons/utils/bean.utils';
import {MediaDocAudioRecord, MediaDocAudioRecordFactory} from '../model/records/mdocaudio-record';
import {ObjectUtils} from '@dps/mycms-commons/dist/commons/utils/object.utils';
import {MediaDocMediaMetaRecordFactory} from '../model/records/mdocmediameta-record';
import {MediaDocImageRecord} from '../model/records/mdocimage-record';
import {MediaDocVideoRecord} from '../model/records/mdocvideo-record';
import {MediaDocLinkedArtistRecord} from '../model/records/mdoclinkedartist-record';
import {MediaDocLinkedPlaylistRecord} from '../model/records/mdoclinkedplaylist-record';

export class MediaDocAdapterResponseMapper implements GenericAdapterResponseMapper {
    private readonly _objectSeparator = ';;';
    private readonly _fieldSeparator = ':::';
    private readonly _valueSeparator = '=';

    protected mapperUtils = new MapperUtils(this._objectSeparator, this._fieldSeparator, this._valueSeparator);
    protected config: {} = {};

    public static generateDoubletteValue(value: string): string {
        return MapperUtils.generateDoubletteValue(value);
    }

    constructor(config: any) {
        this.config = config;
    }

    mapToAdapterDocument(mapping: {}, props: MediaDocRecord): any {
        const values = {};
        values['id'] = props.id;
        values['album_id_i'] = props.albumId;
        values['artist_id_i'] = props.artistId;
        values['audio_id_i'] = props.audioId;
        values['genre_id_i'] = props.genreId;

        values['album_s'] = props.album;
        values['album_artist_s'] = props.albumArtist;
        values['album_genre_s'] = props.albumGenre;
        values['artist_s'] = props.artist;
        values['genre_s'] = props.genre;
        values['trackno_i'] = props.trackNo;

        values['blocked_i'] = props.blocked;
        values['dateshow_dt'] = props.dateshow;
        values['desc_txt'] = props.descTxt;
        values['desc_md_txt'] = props.descMd;
        values['desc_html_txt'] = props.descHtml;
        values['keywords_txt'] =
            (props.keywords ? props.keywords.split(', ').join(',') : '');
        values['name_s'] = props.name;
        values['playlists_txt'] =
            (props.playlists ? props.playlists.split(', ').join(',,') : '');
        values['type_s'] = props.type;
        values['subtype_s'] = props.subtype;

        values['html_txt'] = [
            values['desc_txt'],
            values['name_s'],
            values['keywords_txt'],
            values['type_s']].join(' ');

        values['key_s'] = props.type !== 'ARTIST'
            ? MediaDocAdapterResponseMapper.generateDoubletteValue(values['name_s'])
            : MediaDocAdapterResponseMapper.generateDoubletteValue(values['name_s'].toLocaleLowerCase()
                .replace(/^the /, '')
                .replace(/^die /, ''));

        values['mediameta_duration_i'] = BeanUtils.getValue(props, 'mdocmediameta.dur');
        values['mediameta_filecreated_dt'] = BeanUtils.getValue(props, 'mdocmediameta.fileCreated');
        values['mediameta_filename_s'] = BeanUtils.getValue(props, 'mdocmediameta.fileName');
        values['mediameta_filesize_i'] = BeanUtils.getValue(props, 'mdocmediameta.fileSize');
        values['mediameta_metadata_txt'] = BeanUtils.getValue(props, 'mdocmediameta.metadata');
        values['mediameta_recordingdate_dt'] = BeanUtils.getValue(props, 'mdocmediameta.recordingDate');

        values['rate_pers_gesamt_i'] = BeanUtils.getValue(props, 'mdocratepers.gesamt');

        if (props.get('mdocaudios') && props.get('mdocaudios').length > 0) {
            const audio: MediaDocAudioRecord = props.get('mdocaudios')[0];
            values['a_fav_url_txt'] = audio.fileName;
        }
        if (props.get('mdocimages') && props.get('mdocimages').length > 0) {
            const image: MediaDocImageRecord = props.get('mdocimages')[0];
            values['i_fav_url_txt'] = image.fileName;
        }
        if (props.get('mdocvideos') && props.get('mdocvideos').length > 0) {
            const video: MediaDocVideoRecord = props.get('mdocvideos')[0];
            values['v_fav_url_txt'] = video.fileName;
        }
        if (props.get('mdoclinkedartists') && props.get('mdoclinkedartists').length > 0) {
            this.mapDetailDataToAdapterDocument({}, 'linkedartists', props, values);
        }
        if (props.get('mdoclinkedplaylists') && props.get('mdoclinkedplaylists').length > 0) {
            this.mapDetailDataToAdapterDocument({}, 'linkedplaylists', props, values);
        }

        // changelog
        values['createdat_dt'] = props.createdAt;
        values['updatedat_dt'] = props.updatedAt;
        values['updateversion_i'] = props.updateVersion;

        return values;
    }

    mapDetailDataToAdapterDocument(mapping: {}, profile: string, props: any, result: {}): void {
        switch (profile) {
            case 'linkedartists':
                if (props.get('mdoclinkedartists') && props.get('mdoclinkedartists').length > 0) {
                    const artists: MediaDocLinkedArtistRecord[] = props.get('mdoclinkedartists');
                    const artistsSrc: string [] = [];
                    for (let idx = 0; idx < artists.length; idx++) {
                        artistsSrc.push('type=addartist' + this._fieldSeparator +
                            'name=' + artists[idx].name + this._fieldSeparator +
                            'refId=' + artists[idx].refId);
                    }

                    result['linkedartists_txt'] = artistsSrc.join(this._objectSeparator);
                }
                break;
            case 'linkedplaylists':
                if (props.get('mdoclinkedplaylists') && props.get('mdoclinkedplaylists').length > 0) {
                    const playlists: MediaDocLinkedPlaylistRecord[] = props.get('mdoclinkedplaylists');
                    const playlistsSrc: string [] = [];
                    for (let idx = 0; idx < playlists.length; idx++) {
                        playlistsSrc.push('type=playlist' + this._fieldSeparator +
                            'name=' + playlists[idx].name + this._fieldSeparator +
                            'refId=' + playlists[idx].refId + this._fieldSeparator +
                            'position=' + playlists[idx].position + this._fieldSeparator +
                            'details=' + playlists[idx].details);
                    }

                    result['linkedplaylists_txt'] = playlistsSrc.join(this._objectSeparator);
                }
                break;
        }
    }

    mapValuesToRecord(mapper: Mapper, values: {}): MediaDocRecord {
        const record = MediaDocRecordFactory.createSanitized(values);
        this.mapperUtils.mapValuesToSubRecords(mapper, values, record, MediaDocRecordRelation);

        return record;
    }

    mapResponseDocument(mapper: Mapper, doc: any, mapping: {}): Record {
        const ratePersMapper = mapper['datastore']._mappers['mdocratepers'];
        const mediaMetaMapper = mapper['datastore']._mappers['mdocmediameta'];

        const values = {};
        values['id'] = this.mapperUtils.getMappedAdapterValue(mapping, doc, 'id', undefined);
        values['albumId'] = this.mapperUtils.getMappedAdapterNumberValue(mapping, doc, 'album_id_i', undefined);
        values['artistId'] = this.mapperUtils.getMappedAdapterNumberValue(mapping, doc, 'artist_id_i', undefined);
        values['audioId'] = this.mapperUtils.getMappedAdapterNumberValue(mapping, doc, 'audio_id_i', undefined);
        values['genreId'] = this.mapperUtils.getMappedAdapterNumberValue(mapping, doc, 'genre_id_i', undefined);

        values['album'] = this.mapperUtils.getMappedAdapterValue(mapping, doc, 'album_s', '');
        values['albumArtist'] = this.mapperUtils.getMappedAdapterValue(mapping, doc, 'album_artist_s', '');
        values['albumGenre'] = this.mapperUtils.getMappedAdapterValue(mapping, doc, 'album_genre_s', '');
        values['artist'] = this.mapperUtils.getMappedAdapterValue(mapping, doc, 'artist_s', '');
        values['genre'] = this.mapperUtils.getMappedAdapterValue(mapping, doc, 'genre_s', '');
        values['trackNo'] = this.mapperUtils.getMappedAdapterNumberValue(mapping, doc, 'trackno_i', undefined);

        values['blocked'] = this.mapperUtils.getMappedAdapterNumberValue(mapping, doc, 'blocked_i', undefined);
        values['dateshow'] = this.mapperUtils.getMappedAdapterDateTimeValue(mapping, doc, 'dateshow_dt', undefined);
        values['descTxt'] = this.mapperUtils.getMappedAdapterValue(mapping, doc, 'desc_txt', undefined);
        values['descHtml'] = this.mapperUtils.getMappedAdapterValue(mapping, doc, 'desc_html_txt', undefined);
        values['descMd'] = this.mapperUtils.getMappedAdapterValue(mapping, doc, 'desc_md_txt', undefined);

        const origKeywordsArr = this.mapperUtils.getMappedAdapterValue(mapping, doc, 'keywords_txt', '').split(',');
        const newKeywordsArr = [];
        const allowedKeywordPatterns = BeanUtils.getValue(this.config, 'mapperConfig.allowedKeywordPatterns');
        for (let keyword of origKeywordsArr) {
            keyword = keyword.trim();
            if (keyword === '') {
                continue;
            }

            if (allowedKeywordPatterns && allowedKeywordPatterns.length > 0) {
                for (const pattern of allowedKeywordPatterns) {
                    if (keyword.match(new RegExp(pattern))) {
                        newKeywordsArr.push(keyword);
                        break;
                    }
                }
            } else {
                newKeywordsArr.push(keyword);
            }
        }
        const replaceKeywordPatterns = BeanUtils.getValue(this.config, 'mapperConfig.replaceKeywordPatterns');
        if (replaceKeywordPatterns && replaceKeywordPatterns.length > 0) {
            for (let i = 0; i < newKeywordsArr.length; i++) {
                let keyword = newKeywordsArr[i];
                for (const pattern of replaceKeywordPatterns) {
                    keyword = keyword.replace(new RegExp(pattern[0]), pattern[1]);
                }
                newKeywordsArr[i] = keyword;
            }
        }
        values['keywords'] = newKeywordsArr.join(', ');

        values['name'] = this.mapperUtils.getMappedAdapterValue(mapping, doc, 'name_s', undefined);
        values['playlists'] = this.mapperUtils.getMappedAdapterValue(mapping, doc, 'playlists_txt', '')
            .split(',,').join(', ');
        values['subtype'] = this.mapperUtils.getMappedAdapterValue(mapping, doc, 'subtype_s', undefined);
        values['type'] = this.mapperUtils.getMappedAdapterValue(mapping, doc, 'type_s', undefined);

        // changelog
        values['createdAt'] = this.mapperUtils.getMappedAdapterDateTimeValue(mapping, doc, 'createdat_dt', undefined);
        values['updatedAt'] = this.mapperUtils.getMappedAdapterDateTimeValue(mapping, doc, 'updatedat_dt', undefined);
        values['updateVersion'] = this.mapperUtils.getMappedAdapterNumberValue(mapping, doc, 'updateversion_i', undefined);

        // console.log('mapResponseDocument values:', values);
        const record: MediaDocRecord = <MediaDocRecord>mapper.createRecord(
            MediaDocRecordFactory.instance.getSanitizedValues(values, {}));

        this.mapDetailResponseDocuments(mapper, 'audio', record,
            ObjectUtils.mapValueToObjects(
                doc[this.mapperUtils.mapToAdapterFieldName(mapping, 'a_fav_url_txt')],
                'a_fav_url_txt'));
        this.mapDetailResponseDocuments(mapper, 'image', record,
            ObjectUtils.mapValueToObjects(
                doc[this.mapperUtils.mapToAdapterFieldName(mapping, 'i_fav_url_txt')],
                'i_fav_url_txt'));
        this.mapDetailResponseDocuments(mapper, 'video', record,
            ObjectUtils.mapValueToObjects(
                doc[this.mapperUtils.mapToAdapterFieldName(mapping, 'v_fav_url_txt')],
                'v_fav_url_txt'));
        this.mapDetailResponseDocuments(mapper, 'navigation_objects', record,
            ObjectUtils.mapValueToObjects(
                doc[this.mapperUtils.mapToAdapterFieldName(mapping, 'navigation_objects_txt')],
                'navigation_objects_txt'));
        this.mapDetailResponseDocuments(mapper, 'extended_object_properties', record,
            ObjectUtils.mapValueToObjects(
                doc[this.mapperUtils.mapToAdapterFieldName(mapping, 'extended_object_properties_txt')],
                'extended_object_properties_txt'));
        this.mapDetailResponseDocuments(mapper, 'linkedartists', record,
            ObjectUtils.mapValueToObjects(
                doc[this.mapperUtils.mapToAdapterFieldName(mapping, 'linkedartists_txt')],
                'linkedartists_txt'));
        this.mapDetailResponseDocuments(mapper, 'linkedplaylists', record,
            ObjectUtils.mapValueToObjects(
                doc[this.mapperUtils.mapToAdapterFieldName(mapping, 'linkedplaylists_txt')],
                'linkedplaylists_txt'));
        // console.log('mapResponseDocument record full:', record);


        const mediaMetaValues = {};
        mediaMetaValues['dur'] = this.mapperUtils.getMappedAdapterNumberValue(mapping, doc, 'mediameta_duration_i', undefined);
        mediaMetaValues['fileSize'] = this.mapperUtils.getMappedAdapterNumberValue(mapping, doc, 'mediameta_filesize_i', undefined);
        mediaMetaValues['fileCreated'] = this.mapperUtils.getMappedAdapterDateTimeValue(mapping, doc, 'mediameta_filecreated_dt', undefined);
        mediaMetaValues['fileName'] = this.mapperUtils.getMappedAdapterValue(mapping, doc, 'mediameta_filename_s', undefined);
        mediaMetaValues['metadata'] = this.mapperUtils.getMappedAdapterValue(mapping, doc, 'mediameta_metadata_txt', undefined);
        mediaMetaValues['recordingDate'] = this.mapperUtils.getMappedAdapterDateTimeValue(mapping, doc, 'mediameta_recordingdate_dt', undefined);
        let mediaMetaSet = false;
        for (const field in mediaMetaValues) {
            if (mediaMetaValues[field] !== undefined && mediaMetaValues[field] !== 0) {
                mediaMetaSet = true;
                break;
            }
        }

        if (mediaMetaSet) {
            record.set('mdocmediameta', mediaMetaMapper.createRecord(
                MediaDocMediaMetaRecordFactory.instance.getSanitizedValues(mediaMetaValues, {})));
        } else {
            record.set('mdocmediameta', undefined);
        }

        const ratePersValues = {};
        ratePersValues['gesamt'] = this.mapperUtils.getMappedAdapterNumberValue(mapping, doc, 'rate_pers_gesamt_i', undefined);
        let ratePersSet = false;
        for (const field in ratePersValues) {
            if (ratePersValues[field] !== undefined && ratePersValues[field] !== 0) {
                ratePersSet = true;
                break;
            }
        }

        if (ratePersSet) {
            record.set('mdocratepers', ratePersMapper.createRecord(
                MediaDocRecordFactory.instance.getSanitizedRelationValues('mdocratepers', ratePersValues)));
        } else {
            record.set('mdocratepers', undefined);
        }

        // console.log('mapResponseDocument record full:', record);

        return record;
    }

    mapDetailResponseDocuments(mapper: Mapper, profile: string, src: Record, docs: any[]): void {
        const record: MediaDocRecord = <MediaDocRecord>src;
        switch (profile) {
            case 'audio':
                const audioDocs = [];
                docs.forEach(doc => {
                    const audioDoc = {};
                    audioDoc['name'] = record.name;
                    audioDoc['fileName'] = doc['a_fav_url_txt'];
                    if (audioDoc['fileName']) {
                        audioDocs.push(audioDoc);
                    }
                });
                record.set('mdocaudios',
                    this.mapperUtils.mapDetailDocsToDetailRecords(mapper['datastore']._mappers['mdocaudio'],
                        MediaDocAudioRecordFactory.instance, record, audioDocs));
                break;
            case 'image':
                const imageDocs = [];
                docs.forEach(doc => {
                    const imageDoc = {};
                    imageDoc['name'] = record.name;
                    imageDoc['fileName'] = doc['i_fav_url_txt'];
                    if (imageDoc['fileName']) {
                        imageDocs.push(imageDoc);
                    }
                });
                record.set('mdocimages',
                    this.mapperUtils.mapDetailDocsToDetailRecords(mapper['datastore']._mappers['mdocimage'],
                        MediaDocAudioRecordFactory.instance, record, imageDocs));
                break;
            case 'video':
                const videoDocs = [];
                docs.forEach(doc => {
                    const videoDoc = {};
                    videoDoc['name'] = record.name;
                    videoDoc['fileName'] = doc['v_fav_url_txt'];
                    videoDocs.push(videoDoc);
                    if (videoDoc['fileName']) {
                        videoDocs.push(videoDoc);
                    }
                });
                record.set('mdocvideos',
                    this.mapperUtils.mapDetailDocsToDetailRecords(mapper['datastore']._mappers['mdocvideo'],
                        MediaDocAudioRecordFactory.instance, record, videoDocs));
                break;
            case 'audio_playlists':
                record.playlists = ObjectUtils.mergePropertyValues(docs, 'a_playlists', ', ');
                break;
            case 'playlists':
                record.playlists = ObjectUtils.mergePropertyValues(docs, 'playlists', ', ');
                break;
            case 'keywords':
                record.keywords = ObjectUtils.mergePropertyValues(docs, 'keywords', ', ');
                break;
            case 'navigation_objects':
                this.mapperUtils.explodeAndMapDetailResponseDocuments(mapper, MediaDocRecordRelation.hasMany['mdocnavigationobject'],
                    ['navigation_objects', 'navigation_objects_txt'], record, docs);
                break;
            case 'extended_object_properties':
                this.mapperUtils.explodeAndMapDetailResponseDocuments(mapper, MediaDocRecordRelation.hasMany['mdocextendedobjectproperty'],
                    ['extended_object_properties', 'extended_object_properties_txt'], record, docs);
                break;
            case 'linkedartists':
                this.mapperUtils.explodeAndMapDetailResponseDocuments(mapper, MediaDocRecordRelation.hasMany['mdoclinkedartist'],
                    ['linkedartists', 'linkedartists_txt'], record, docs);
                break;
            case 'linkedplaylists':
                this.mapperUtils.explodeAndMapDetailResponseDocuments(mapper, MediaDocRecordRelation.hasMany['mdoclinkedplaylist'],
                    ['linkedplaylists', 'linkedplaylists_txt'], record, docs);
                break;
        }
    }

}

