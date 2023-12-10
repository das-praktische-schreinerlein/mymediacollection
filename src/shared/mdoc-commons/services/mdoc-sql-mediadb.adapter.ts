import {MediaDocRecord} from '../model/records/mdoc-record';
import {MediaDocSearchForm} from '../model/forms/mdoc-searchform';
import {MediaDocSearchResult} from '../model/container/mdoc-searchresult';
import {GenericSqlAdapter} from '@dps/mycms-commons/dist/search-commons/services/generic-sql.adapter';
import {MediaDocAdapterResponseMapper} from './mdoc-adapter-response.mapper';
import {
    FacetCacheUsageConfigurations,
    LoadDetailDataConfig,
    TableConfig,
    WriteQueryData
} from '@dps/mycms-commons/dist/search-commons/services/sql-query.builder';
import {AdapterQuery} from '@dps/mycms-commons/dist/search-commons/services/mapper.utils';
import {Facet, Facets} from '@dps/mycms-commons/dist/search-commons/model/container/facets';
import {Mapper, Record, utils} from 'js-data';
import {ActionTagForm} from '@dps/mycms-commons/dist/commons/utils/actiontag.utils';
import {MediaDocSqlMediadbKeywordAdapter} from './mdoc-sql-mediadb-keyword.adapter';
import {MediaDocSqlMediadbConfig} from './mdoc-sql-mediadb.config';
import {MediaDocAudioRecord} from '../model/records/mdocaudio-record';
import {
    AssignActionTagForm,
    CommonSqlActionTagAssignAdapter
} from '@dps/mycms-commons/dist/action-commons/actiontags/common-sql-actiontag-assign.adapter';
import {
    AssignJoinActionTagForm,
    CommonSqlActionTagAssignJoinAdapter
} from '@dps/mycms-commons/dist/action-commons/actiontags/common-sql-actiontag-assignjoin.adapter';
import {CommonSqlActionTagBlockAdapter} from '@dps/mycms-commons/dist/action-commons/actiontags/common-sql-actiontag-block.adapter';
import {
    CommonSqlActionTagReplaceAdapter,
    ReplaceActionTagForm
} from '@dps/mycms-commons/dist/action-commons/actiontags/common-sql-actiontag-replace.adapter';
import {
    CommonSqlActionTagKeywordAdapter,
    KeywordActionTagForm
} from '@dps/mycms-commons/dist/action-commons/actiontags/common-sql-actiontag-keyword.adapter';
import {
    CommonSqlActionTagPlaylistAdapter,
    PlaylistActionTagForm
} from '@dps/mycms-commons/dist/action-commons/actiontags/common-sql-actiontag-playlist.adapter';
import {
    CommonSqlActionTagRateAdapter,
    RateActionTagForm
} from '@dps/mycms-commons/dist/action-commons/actiontags/common-sql-actiontag-rate.adapter';
import {CommonSqlKeywordAdapter} from '@dps/mycms-commons/dist/action-commons/actions/common-sql-keyword.adapter';
import {CommonSqlPlaylistAdapter} from '@dps/mycms-commons/dist/action-commons/actions/common-sql-playlist.adapter';
import {CommonSqlRateAdapter} from '@dps/mycms-commons/dist/action-commons/actions/common-sql-rate.adapter';
import {CommonSqlJoinAdapter} from '@dps/mycms-commons/dist/action-commons/actions/common-sql-join.adapter';
import {MediaDocSqlMediadbActionTagAdapter} from './mdoc-sql-mediadb-actiontag.adapter';
import {StringUtils} from '@dps/mycms-commons/dist/commons/utils/string.utils';
import {MediaDocSqlUtils} from './mdoc-sql.utils';
import {MediaDocImageRecord} from '../model/records/mdocimage-record';
import {MediaDocVideoRecord} from '../model/records/mdocvideo-record';
import {MediaDocLinkedArtistRecord} from '../model/records/mdoclinkedartist-record';

export class MediaDocSqlMediadbAdapter extends GenericSqlAdapter<MediaDocRecord, MediaDocSearchForm, MediaDocSearchResult> {
    private readonly actionTagAssignAdapter: CommonSqlActionTagAssignAdapter;
    private readonly actionTagAssignJoinAdapter: CommonSqlActionTagAssignJoinAdapter;
    private readonly actionTagBlockAdapter: CommonSqlActionTagBlockAdapter;
    private readonly actionTagReplaceAdapter: CommonSqlActionTagReplaceAdapter;
    private readonly actionTagKeywordAdapter: CommonSqlActionTagKeywordAdapter;
    private readonly actionTagPlaylistAdapter: CommonSqlActionTagPlaylistAdapter;
    private readonly actionTagRateAdapter: CommonSqlActionTagRateAdapter;
    private readonly keywordsAdapter: MediaDocSqlMediadbKeywordAdapter;
    private readonly commonKeywordAdapter: CommonSqlKeywordAdapter;
    private readonly commonPlaylistAdapter: CommonSqlPlaylistAdapter;
    private readonly commonRateAdapter: CommonSqlRateAdapter;
    private readonly commonJoinAdapter: CommonSqlJoinAdapter;
    private readonly dbModelConfig: MediaDocSqlMediadbConfig = new MediaDocSqlMediadbConfig();
    private mediaActionTagAdapter: MediaDocSqlMediadbActionTagAdapter;

    constructor(config: any, facetCacheUsageConfigurations: FacetCacheUsageConfigurations) {
        super(config, new MediaDocAdapterResponseMapper(config), facetCacheUsageConfigurations);
        this.extendTableConfigs();
        this.commonKeywordAdapter = new CommonSqlKeywordAdapter(config, this.knex, this.sqlQueryBuilder,
            this.dbModelConfig.getKeywordModelConfigFor());
        this.commonPlaylistAdapter = new CommonSqlPlaylistAdapter(config, this.knex, this.sqlQueryBuilder,
            this.dbModelConfig.getPlaylistModelConfigFor());
        this.commonRateAdapter = new CommonSqlRateAdapter(config, this.knex, this.sqlQueryBuilder,
            this.dbModelConfig.getRateModelConfigFor());
        this.commonJoinAdapter = new CommonSqlJoinAdapter(config, this.knex, this.sqlQueryBuilder,
            this.dbModelConfig.getJoinModelConfigFor());
        this.keywordsAdapter = new MediaDocSqlMediadbKeywordAdapter(config, this.knex, this.commonKeywordAdapter);
        this.mediaActionTagAdapter = new MediaDocSqlMediadbActionTagAdapter(config, this.knex, this.sqlQueryBuilder);
        this.actionTagAssignAdapter = new CommonSqlActionTagAssignAdapter(config, this.knex, this.sqlQueryBuilder,
            this.dbModelConfig.getActionTagAssignConfig());
        this.actionTagAssignJoinAdapter = new CommonSqlActionTagAssignJoinAdapter(config, this.knex, this.sqlQueryBuilder,
            this.dbModelConfig.getActionTagAssignJoinConfig());
        this.actionTagBlockAdapter = new CommonSqlActionTagBlockAdapter(config, this.knex, this.sqlQueryBuilder,
            this.dbModelConfig.getActionTagBlockConfig());
        this.actionTagReplaceAdapter = new CommonSqlActionTagReplaceAdapter(config, this.knex, this.sqlQueryBuilder,
            this.dbModelConfig.getActionTagReplaceConfig());
        this.actionTagKeywordAdapter = new CommonSqlActionTagKeywordAdapter(this.commonKeywordAdapter);
        this.actionTagPlaylistAdapter = new CommonSqlActionTagPlaylistAdapter(this.commonPlaylistAdapter);
        this.actionTagRateAdapter = new CommonSqlActionTagRateAdapter(this.commonRateAdapter);
    }

    protected isActiveLoadDetailsMode(tableConfig: TableConfig, loadDetailDataConfig: LoadDetailDataConfig,
                                      loadDetailsMode: string): boolean {
        if (loadDetailDataConfig && loadDetailDataConfig.modes) {
            if (!loadDetailsMode) {
                // mode required but no mode set on options
                return false;
            }
            if (loadDetailDataConfig.modes.indexOf(loadDetailsMode) < 0) {
                // mode not set on options
                return false;
            }
        }

        return true;
    }

    protected extendTableConfigs() {
        this.sqlQueryBuilder.extendTableConfigs(MediaDocSqlMediadbConfig.tableConfigs);
    }

    protected getTableConfig(params: AdapterQuery): TableConfig {
        return this.getTableConfigForTableKey(this.extractTable(params));
    }

    protected getTableConfigForTableKey(table: string): TableConfig {
        return this.dbModelConfig.getTableConfigForTableKey(table);
    }

    protected getDefaultFacets(): Facets {
        const facets = new Facets();
        let facet = new Facet();
        facet.facet = ['audio', 'image', 'video', 'artist', 'genre', 'album'].map(value => {return [value, 0]; });
        facet.selectLimit = 1;
        facets.facets.set('type_ss', facet);
        facet = new Facet();
        facet.facet = ['relevance'].map(value => {return [value, 0]; });
        facets.facets.set('sorts', facet);

        return facets;
    }

    protected queryTransformToAdapterWriteQuery(method: string, mapper: Mapper, props: any, opts: any): WriteQueryData {
        const query = super.queryTransformToAdapterWriteQuery(method, mapper, props, opts);
        let file = null;
        let dir = null;

        if (query.tableConfig.key === 'album') {
            if (props.get('mdocimages') && props.get('mdocimages').length > 0) {
                const image: MediaDocImageRecord = props.get('mdocimages')[0];
                file = image.fileName.replace(/^.*\/(.*?)$/, '$1');
                dir = image.fileName.replace(/^(.*)\/(.*?)$/, '$1').replace(/\\/g, '/');
                query.fields['a_dir'] = dir;
                query.fields['a_coverfile'] = file;
            }
        } else if (query.tableConfig.key === 'audio') {
            if (props.get('mdocaudios') && props.get('mdocaudios').length > 0) {
                const audio: MediaDocAudioRecord = props.get('mdocaudios')[0];
                file = audio.fileName.replace(/^.*\/(.*?)$/, '$1');
                dir = audio.fileName.replace(/^(.*)\/(.*?)$/, '$1').replace(/\\/g, '/');
                query.fields['t_dir'] = dir;
                query.fields['t_file'] = file;
            }

            if (props.get('mdocimages') && props.get('mdocimages').length > 0) {
                const image: MediaDocImageRecord = props.get('mdocimages')[0];
                file = image.fileName.replace(/^.*\/(.*?)$/, '$1');
                dir = image.fileName.replace(/^(.*)\/(.*?)$/, '$1').replace(/\\/g, '/');
                query.fields['t_dir'] = query.fields['t_dir'] || dir;
                query.fields['t_coverfile'] = file;
            }
        } else if (query.tableConfig.key === 'image') {
            if (props.get('mdocimages') && props.get('mdocimages').length > 0) {
                const image: MediaDocImageRecord = props.get('mdocimages')[0];
                file = image.fileName.replace(/^.*\/(.*?)$/, '$1');
                dir = image.fileName.replace(/^(.*)\/(.*?)$/, '$1').replace(/\\/g, '/');
                query.fields['i_dir'] = dir;
                query.fields['i_file'] = file;
            }
        } else if (query.tableConfig.key === 'video') {
            if (props.get('mdocvideos') && props.get('mdocvideos').length > 0) {
                const video: MediaDocVideoRecord = props.get('mdocvideos')[0];
                file = video.fileName.replace(/^.*\/(.*?)$/, '$1');
                dir = video.fileName.replace(/^(.*)\/(.*?)$/, '$1').replace(/\\/g, '/');
                query.fields['v_dir'] = dir;
                query.fields['v_file'] = file;
            }
        }

        return query;
    }

    protected transformToSqlDialect(sql: string): string {
        if (this.config.knexOpts.client !== 'mysql') {
            // dirty workaround because sqlite has no functions as mysql
            sql = MediaDocSqlUtils.transformToSqliteDialect(sql);
        }

        return super.transformToSqlDialect(sql);
    }

    protected saveDetailData(method: string, mapper: Mapper, id: string | number, props: any, opts?: any): Promise<boolean> {
        if (props.type === undefined) {
            return utils.resolve(false);
        }
        const dbId = parseInt(id + '', 10);
        if (!utils.isInteger(dbId)) {
            return utils.reject('saveDetailData ' + props.type + ' id not an integer');
        }

        const tabKey = props.type.toLocaleLowerCase();
        if (tabKey === 'audio') {
            return  new Promise<boolean>((allResolve, allReject) => {
                const promises = [];
                promises.push(this.keywordsAdapter.setAudioKeywords(dbId, props.keywords, opts));

                Promise.all(promises).then(function doneSearch() {
                    return allResolve(true);
                }).catch(function errorSearch(reason) {
                    console.error('setAudioDetails failed:', reason);
                    return allReject(reason);
                });
            });
        } else if (tabKey === 'album') {
            return  new Promise<boolean>((allResolve, allReject) => {
                const promises = [];
                promises.push(this.keywordsAdapter.setAlbumKeywords(dbId, props.keywords, opts));
                if (props.get('mdoclinkedartists')) {
                    const artists: MediaDocLinkedArtistRecord[] = props.get('mdoclinkedartists');
                    promises.push(this.commonJoinAdapter.saveJoins('linkedartists', tabKey, dbId, artists, opts));
                }

                Promise.all(promises).then(function doneSearch() {
                    return allResolve(true);
                }).catch(function errorSearch(reason) {
                    console.error('setAlbumDetails failed:', reason);
                    return allReject(reason);
                });
            });
        } else if (tabKey === 'artist') {
            return  new Promise<boolean>((allResolve, allReject) => {
                const promises = [];
                promises.push(this.keywordsAdapter.setArtistKeywords(dbId, props.keywords, opts));

                Promise.all(promises).then(function doneSearch() {
                    return allResolve(true);
                }).catch(function errorSearch(reason) {
                    console.error('setArtistDetails failed:', reason);
                    return allReject(reason);
                });
            });
        }

        return utils.resolve(true);
    }

    protected _doActionTag<T extends Record>(mapper: Mapper, record: MediaDocRecord, actionTagForm: ActionTagForm,
                                             opts: any): Promise<any> {
        opts = opts || {};
        const id = parseInt(record.id.replace(/.*_/g, ''), 10);
        if (!utils.isInteger(id)) {
            return utils.reject(false);
        }

        const table = (record['type'] + '').toLocaleLowerCase();
        if (table === 'audio' && actionTagForm.type === 'tag' && actionTagForm.key.startsWith('set_playlists_')) {
            return this.mediaActionTagAdapter.executeActionTagPlaylist(table, id, actionTagForm, opts);
        } else if (table === 'audio' && actionTagForm.type === 'tag' && actionTagForm.key.startsWith('unset_playlists_')) {
            actionTagForm.payload.set = false;
            return this.mediaActionTagAdapter.executeActionTagPlaylist(table, id, actionTagForm, opts);
        } else if (table === 'audio' && actionTagForm.type === 'tag' && actionTagForm.key.startsWith('playlists_')) {
            return this.actionTagPlaylistAdapter.executeActionTagPlaylist(table, id, <PlaylistActionTagForm>actionTagForm, opts).then(
                () => {
                    if (actionTagForm.payload.set) {
                        const rates = {
                            'gesamt': actionTagForm.payload['mdocratepers.gesamt'] || 0
                        };
                        return this.commonRateAdapter.setRates(table, id, rates, true, opts);
                    } else {
                        return utils.resolve(true);
                    }
                });
        } else if (table === 'album' && actionTagForm.type === 'tag' && actionTagForm.key.startsWith('albummedia_persRate')) {
            return this.actionTagRateAdapter.executeActionTagRateWithGreatestCheck('albumaudios', id, <RateActionTagForm> actionTagForm, opts);
        } else if (actionTagForm.type === 'tag' && actionTagForm.key.startsWith('persRate_')) {
            return this.actionTagRateAdapter.executeActionTagRate(table, id, actionTagForm, opts);
        } else if (actionTagForm.type === 'tag' && actionTagForm.key.startsWith('blocked')) {
            return this.actionTagBlockAdapter.executeActionTagBlock(table, id, actionTagForm, opts);
        } else if (actionTagForm.type === 'assign' && actionTagForm.key.startsWith('assign')) {
            return this.actionTagAssignAdapter.executeActionTagAssign(table, id, <AssignActionTagForm> actionTagForm, opts);
        } else if (actionTagForm.type === 'assignjoin' && actionTagForm.key.startsWith('assignjoin')) {
            return this.actionTagAssignJoinAdapter.executeActionTagAssignJoin(table, id, <AssignJoinActionTagForm>actionTagForm, opts);
        } else if (actionTagForm.type === 'tag' &&
            (actionTagForm.key.startsWith('set_keywords') || actionTagForm.key.startsWith('unset_keywords'))) {
            const keywords = StringUtils.mergeKeywords(record.keywords, actionTagForm.payload.keywords,
                actionTagForm.key.startsWith('unset'));

            if (table === 'album') {
                return this.keywordsAdapter.setAlbumKeywords(id, keywords, opts);
            } else if (table === 'artist') {
                return this.keywordsAdapter.setArtistKeywords(id, keywords, opts);
            } else if (table === 'audio') {
                return this.keywordsAdapter.setAudioKeywords(id, keywords, opts);
            }
        } else if (actionTagForm.type === 'keyword' && actionTagForm.key.startsWith('keyword')) {
            return this.actionTagKeywordAdapter.executeActionTagKeyword(table, id, <KeywordActionTagForm> actionTagForm, opts);
        } else if (actionTagForm.type === 'assignplaylist') {
            return this.actionTagPlaylistAdapter.executeActionTagPlaylist(table, id, <PlaylistActionTagForm> actionTagForm, opts);
        } else if (table === 'album' && actionTagForm.type === 'replace' && actionTagForm.key.startsWith('replaceAndAddArtistLink')) {
            const replaceForm = <ReplaceActionTagForm> actionTagForm;
            replaceForm.deletes = true;
            if (replaceForm.payload === undefined || replaceForm.payload.newId === undefined || replaceForm.payload.newId === null) {
                return utils.reject(false);
            }
            const newId = parseInt(replaceForm.payload.newId.replace(/.*_/g, ''), 10);
            if (!utils.isInteger(newId)) {
                return utils.reject(false);
            }

            const assignJoinForm = <AssignJoinActionTagForm> {
                deletes: false,
                key: 'assignjoin',
                recordId: newId + '',
                type: 'tag',
                payload: {
                    newId: record.artistId + '',
                    referenceField: 'artist_id_is'
                }
            };

            return this.actionTagAssignJoinAdapter.executeActionTagAssignJoin(table, newId, assignJoinForm, opts).then(
                () => {
                    return this.actionTagReplaceAdapter.executeActionTagReplace(table, id, replaceForm, opts);
                });
        } else if (actionTagForm.type === 'replace' && actionTagForm.key.startsWith('replace')) {
            actionTagForm.deletes = true;
            return this.actionTagReplaceAdapter.executeActionTagReplace(table, id, <ReplaceActionTagForm> actionTagForm, opts);
        }

        return super._doActionTag(mapper, record, actionTagForm, opts);
    }

}

