import {Inject, Injectable, LOCALE_ID} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {AppState, GenericAppService} from '@dps/mycms-commons/dist/commons/services/generic-app.service';
import {PDocDataService} from '@dps/mycms-commons/dist/pdoc-commons/services/pdoc-data.service';
import {BaseEntityRecord} from '@dps/mycms-commons/dist/search-commons/model/records/base-entity-record';
import {MinimalHttpBackendClient} from '@dps/mycms-commons/dist/commons/services/minimal-http-backend-client';
import {CommonRoutingService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/common-routing.service';
import {PlatformService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/platform.service';
import {FallbackHttpClient} from './fallback-http-client';
import * as Promise_serial from 'promise-serial';
import {DataMode} from '../../shared/commons/model/datamode.enum';
import {ToastrService} from 'ngx-toastr';
import {PDocDataStore} from '@dps/mycms-commons/dist/pdoc-commons/services/pdoc-data.store';
import {StaticPagesDataService} from '@dps/mycms-commons/dist/pdoc-commons/services/staticpages-data.service';
import {StaticPagesDataStore} from '@dps/mycms-commons/dist/pdoc-commons/services/staticpages-data.store';
import {PDocHttpAdapter} from '@dps/mycms-commons/dist/pdoc-commons/services/pdoc-http.adapter';
import {MediaDocDataStore} from '../../shared/mdoc-commons/services/mdoc-data.store';
import {MediaDocDataService} from '../../shared/mdoc-commons/services/mdoc-data.service';
import {MediaDocHttpAdapter} from '../../shared/mdoc-commons/services/mdoc-http.adapter';
import {MediaDocAdapterResponseMapper} from '../../shared/mdoc-commons/services/mdoc-adapter-response.mapper';
import {MediaDocRecordRelation} from '../../shared/mdoc-commons/model/records/mdoc-record';
import {ExtendedItemsJsConfig, ItemsJsDataImporter} from '@dps/mycms-commons/dist/search-commons/services/itemsjs.dataimporter';
import {MediaDocItemsJsAdapter} from '../../../shared/mdoc-commons/services/mdoc-itemsjs.adapter';

@Injectable()
export class AppService extends GenericAppService {
    private onlineAppConfig = {
        adminBackendApiBaseUrl: environment.adminBackendApiBaseUrl,
        backendApiBaseUrl: environment.backendApiBaseUrl,
        audioBaseUrl: environment.audioBaseUrl,
        picsBaseUrl: environment.picsBaseUrl,
        videoBaseUrl: environment.videoBaseUrl,
        useAssetStoreUrls: environment.useAssetStoreUrls,
        useAudioAssetStoreUrls: environment.useAudioAssetStoreUrls,
        useVideoAssetStoreUrls: environment.useVideoAssetStoreUrls,
        skipMediaCheck: environment.skipMediaCheck && true,
        staticPDocsFile: undefined,
        staticMDocsFiles: undefined,
        permissions: {
            adminWritable: environment.adminWritable,
            pdocWritable: environment.pdocWritable,
            pdocActionTagWritable: environment.pdocActionTagWritable,
            mdocWritable: environment.mdocWritable,
            mdocActionTagWritable: environment.mdocActionTagWritable,
            m3uAvailable: environment.m3uAvailable,
            allowAutoPlay: environment.allowAutoPlay
        },
        mdocMaxItemsPerAlbum: environment.mdocMaxItemsPerAlbum,
        components: {},
        services: {},
        currentDataMode: environment.startDataMode ? environment.startDataMode : DataMode.BACKEND,
        startDataMode: environment.startDataMode ? environment.startDataMode : DataMode.BACKEND,
        availableDataModes: environment.availableDataModes ? environment.availableDataModes : [DataMode.BACKEND]
    };
    private staticAppConfig = {
        adminBackendApiBaseUrl: environment.adminBackendApiBaseUrl,
        backendApiBaseUrl: environment.backendApiBaseUrl,
        audioBaseUrl: environment.audioBaseUrl,
        picsBaseUrl: environment.picsBaseUrl,
        videoBaseUrl: environment.videoBaseUrl,
        staticPDocsFile: environment.staticPDocsFile,
        staticMDocsFiles: environment.staticMDocsFiles,
        useAssetStoreUrls: environment.useAssetStoreUrls,
        useAudioAssetStoreUrls: environment.useAudioAssetStoreUrls,
        useVideoAssetStoreUrls: environment.useVideoAssetStoreUrls,
        skipMediaCheck: environment.skipMediaCheck && true,
        permissions: {
            adminWritable: environment.adminWritable,
            pdocWritable: environment.pdocWritable,
            pdocActionTagWritable: environment.pdocActionTagWritable,
            mdocWritable: environment.mdocWritable,
            mdocActionTagWritable: environment.mdocActionTagWritable,
            allowAutoPlay: environment.allowAutoPlay,
            m3uAvailable: environment.m3uAvailable
        },
        mdocMaxItemsPerAlbum: environment.mdocMaxItemsPerAlbum,
        components: {},
        services: {},
        currentDataMode: environment.startDataMode ? environment.startDataMode : DataMode.STATIC,
        startDataMode: environment.startDataMode ? environment.startDataMode : DataMode.STATIC,
        availableDataModes: environment.availableDataModes ? environment.availableDataModes : [DataMode.STATIC]
    };
    private appConfig = {
        adminBackendApiBaseUrl: environment.adminBackendApiBaseUrl,
        backendApiBaseUrl: environment.backendApiBaseUrl,
        audioBaseUrl: environment.audioBaseUrl,
        picsBaseUrl: environment.picsBaseUrl,
        videoBaseUrl: environment.videoBaseUrl,
        useAssetStoreUrls: environment.useAssetStoreUrls,
        useAudioAssetStoreUrls: environment.useAudioAssetStoreUrls,
        useVideoAssetStoreUrls: environment.useVideoAssetStoreUrls,
        skipMediaCheck: environment.skipMediaCheck && true,
        staticPDocsFile: undefined,
        staticMDocsFiles: undefined,
        permissions: {
            adminWritable: environment.adminWritable,
            pdocWritable: environment.pdocWritable,
            pdocActionTagWritable: environment.pdocActionTagWritable,
            mdocWritable: environment.mdocWritable,
            mdocActionTagWritable: environment.mdocActionTagWritable,
            allowAutoPlay: environment.allowAutoPlay,
            m3uAvailable: environment.m3uAvailable
        },
        mdocMaxItemsPerAlbum: environment.mdocMaxItemsPerAlbum,
        components: {},
        services: {},
        currentDataMode: environment.startDataMode ? environment.startDataMode : DataMode.BACKEND,
        startDataMode: environment.startDataMode ? environment.startDataMode : DataMode.BACKEND,
        availableDataModes: environment.availableDataModes ? environment.availableDataModes : [DataMode.BACKEND]
    };

    constructor(private mdocDataService: MediaDocDataService, private mdocDataStore: MediaDocDataStore,
                private pdocDataService: PDocDataService, private pdocDataStore: PDocDataStore,
                private pagesDataService: StaticPagesDataService, private pagesDataStore: StaticPagesDataStore,
                @Inject(LOCALE_ID) private locale: string,
                private http: HttpClient, private commonRoutingService: CommonRoutingService,
                private backendHttpClient: MinimalHttpBackendClient, private platformService: PlatformService,
                private fallBackHttpClient: FallbackHttpClient, protected toastService: ToastrService) {
        super();
    }

    initApp(): Promise<boolean> {
        const me = this;
        return this.initAppConfig().then(function onConfigLoaded() {
            if (DataMode.STATIC === me.appConfig.currentDataMode) {
                return me.initStaticData();
            } else {
                return me.initBackendData();
            }
        }).then(function onBackendLoaded() {
            console.log('app ready');
            me.setAppState(AppState.Ready);
            return Promise.resolve(true);
        }).catch(function onError(reason: any) {
            console.error('loading app failed:', reason);
            me.setAppState(AppState.Failed);
            return Promise.reject(reason);
        });
    }

    getAppConfig(): {}  {
        return this.appConfig;
    }

    doSwitchToOfflineVersion(): void {
        const me = this;
        me.appConfig.currentDataMode = DataMode.STATIC;
        me.initApp().then(() => {
            console.log('DONE - switched to offline-version');
            return me.commonRoutingService.navigateByUrl('/?' + (new Date()).getTime());
        }).catch(reason => {
            console.error('switching to offlineversion failed:', reason);
            me.toastService.error('Es gibt leider Probleme beim Wechsel zur OfflineVersion - am besten noch einmal probieren :-(', 'Oje!');
        });
    }

    doSwitchToOnlineVersion(): void {
        const me = this;
        me.appConfig.currentDataMode = DataMode.BACKEND;
        me.initApp().then(() => {
            console.log('DONE - switched to online-version');
            return me.commonRoutingService.navigateByUrl('/?' + (new Date()).getTime());
        }).catch(reason => {
            console.error('switching to onlineversion failed:', reason);
            me.toastService.error('Es gibt leider Probleme beim Wechsel zur OnlineVersion - am besten noch einmal probieren :-(', 'Oje!');
        });
    }

    initAppConfig(): Promise<any> {
        const me = this;
        if (DataMode.STATIC === me.appConfig.currentDataMode) {
            console.log('starting static app');
            me.appConfig = {...me.staticAppConfig};
            return me.fallBackHttpClient.loadJsonPData('assets/staticdata/static.mymmconfig.js', 'importStaticConfigJsonP', 'config')
                .then(function onDocLoaded(res: any) {
                    const config: {} = res;
                    console.log('initially loaded dynamic config from assets', config);
                    me.appConfig.components = config['components'];
                    me.appConfig.services = config['services'];
                    me.appConfig.audioBaseUrl = config['audioBaseUrl'] ? config['audioBaseUrl'] : me.appConfig.audioBaseUrl;
                    me.appConfig.picsBaseUrl = config['picsBaseUrl'] ? config['picsBaseUrl'] : me.appConfig.picsBaseUrl;
                    me.appConfig.videoBaseUrl = config['videoBaseUrl'] ? config['videoBaseUrl'] : me.appConfig.videoBaseUrl;
                    me.appConfig.staticPDocsFile = config['staticPDocsFile'] ? config['staticPDocsFile'] : me.appConfig.staticPDocsFile;
                    me.appConfig.staticMDocsFiles = config['staticMDocsFiles'] ? config['staticMDocsFiles'] : me.appConfig.staticMDocsFiles;
                    me.appConfig.skipMediaCheck = config['skipMediaCheck'] && true;
                    me.appConfig.useAssetStoreUrls = false;
                    me.appConfig.useAudioAssetStoreUrls = false;
                    me.appConfig.useVideoAssetStoreUrls = false;
                    me.appConfig.currentDataMode = DataMode.STATIC;

                    return Promise.resolve(true);
                });
        }

        console.log('starting online app');
        me.appConfig = {...me.onlineAppConfig};
        return new Promise<boolean>((resolve, reject) => {
            const url = me.platformService.getAssetsUrl(
                `./assets/config` + environment.assetsPathVersionSnippet + `.json` + environment.assetsPathVersionSuffix);
            // console.log('load config:', url);
            me.http.get(url).toPromise()
                .then(function onConfigLoaded(res: any) {
                    const config: {} = res;
                    // console.log('initially loaded config from assets', config);
                    me.appConfig.components = config['components'];
                    me.appConfig.services = config['services'];
                    me.appConfig.currentDataMode = DataMode.BACKEND;
                    return resolve(true);
                }).catch(function onError(reason: any) {
                    console.error('loading appdata failed:', reason);
                    return reject(false);
            });
        });
    }

    initBackendData(): Promise<boolean> {
        const me = this;
        const options = {
            basePath: this.appConfig.backendApiBaseUrl + this.locale + '/',
            http: function (httpConfig) {
                return me.backendHttpClient.makeHttpRequest(httpConfig);
            }
        };
        const pdocAdapter = new PDocHttpAdapter(options);

        this.pdocDataStore.setAdapter('http', undefined, '', {});
        this.pagesDataStore.setAdapter('http', undefined, '', {});

        this.pagesDataService.clearLocalStore();
        this.pdocDataService.clearLocalStore();


        const mdocAdapter = new MediaDocHttpAdapter(options);
        this.mdocDataStore.setAdapter('http', undefined, '', {});
        this.mdocDataService.clearLocalStore();
        this.mdocDataStore.setAdapter('http', mdocAdapter, '', {});

        return new Promise<boolean>((resolve, reject) => {
            me.backendHttpClient.makeHttpRequest({ method: 'get', url: options.basePath + 'pages/', withCredentials: true })
                .then(function onDocsLoaded(res: any) {
                    const docs: any[] = (res['data'] || res.json());
                    for (const doc of docs) {
                        me.remapPDoc(doc);
                    }

                    me.pagesDataService.setWritable(true);
                    return me.pagesDataService.addMany(docs);
                }).then(function onDocsAdded(records: BaseEntityRecord[]) {
                    // console.log('initially loaded pdocs from server', records);
                    me.pagesDataService.setWritable(false);
                    me.pdocDataService.setWritable(me.appConfig.permissions.pdocWritable);

                    me.pdocDataStore.setAdapter('http', pdocAdapter, '', {});

                    me.mdocDataService.setWritable(me.appConfig.permissions.mdocWritable);
                    return resolve(true);
                }).catch(function onError(reason: any) {
                    console.error('loading appdata failed:', reason);
                    me.pagesDataService.setWritable(false);

                    return reject(false);
                });
            });
    }

    initStaticData(): Promise<any> {
        const me = this;
        this.pagesDataStore.setAdapter('http', undefined, '', {});
        this.pagesDataService.clearLocalStore();
        this.pagesDataService.setWritable(false);

        this.mdocDataStore.setAdapter('http', undefined, '', {});
        this.pdocDataService.clearLocalStore();
        this.mdocDataService.clearLocalStore();

        me.appConfig.permissions.mdocWritable = false;
        me.appConfig.permissions.mdocActionTagWritable = false;
        me.appConfig.permissions.adminWritable = false;

        const options = { skipMediaCheck: me.appConfig.skipMediaCheck};
        const itemsJsConfig: ExtendedItemsJsConfig = MediaDocItemsJsAdapter.itemsJsConfig;
        itemsJsConfig.skipMediaCheck = me.appConfig.skipMediaCheck || false;
        ItemsJsDataImporter.prepareConfiguration(itemsJsConfig);
        const importer: ItemsJsDataImporter = new ItemsJsDataImporter(itemsJsConfig);

        return  me.fallBackHttpClient.loadJsonPData(me.appConfig.staticPDocsFile, 'importStaticDataPDocsJsonP', 'pdocs')
            .then(function onPDocLoaded(data: any) {
                if (data['pdocs']) {
                    return Promise.resolve(data['pdocs']);
                }

                return Promise.reject('No static pdocs found');
            }).then(function onPDocParsed(docs: any[]) {
                me.pagesDataService.setWritable(true);
                for (const doc of docs) {
                    me.remapPDoc(doc);
                }

                return me.pagesDataService.addMany(docs);
            }).then(function onPDocsAdded(pdocs: BaseEntityRecord[]) {
                console.log('initially loaded pdocs from assets', pdocs);

                me.pagesDataService.setWritable(false);
                const promises = [];
                for (const staticMdocsFile of me.appConfig.staticMDocsFiles) {
                    promises.push(function () {
                        return me.fallBackHttpClient.loadJsonPData(staticMdocsFile, 'importStaticDataMDocsJsonP', 'mdocs');
                    });
                }

                return Promise_serial(promises, {parallelize: 1}).then(arrayOfResults => {
                    const mdocs = [];
                    for (let i = 0; i < arrayOfResults.length; i++) {
                        const data = arrayOfResults[i];
                        if (data['mdocs']) {
                            const exportRecords = data['mdocs'].map(doc => {
                                return importer.extendAdapterDocument(doc);
                            });

                            mdocs.push(...exportRecords);
                            continue;
                        }

                        if (data['currentRecords']) {
                            const responseMapper = new MediaDocAdapterResponseMapper(options);
                            const searchRecords = data['currentRecords'].map(doc => {
                                const record = importer.createRecordFromJson(responseMapper,
                                    me.mdocDataStore.getMapper('mdoc'), doc, MediaDocRecordRelation);
                                const adapterValues = responseMapper.mapToAdapterDocument({}, record);

                                return importer.extendAdapterDocument(adapterValues);
                            });

                            mdocs.push(...searchRecords);
                            continue;
                        }

                        return Promise.reject('No static mdocs found');
                    }

                    return Promise.resolve(mdocs);
                }).catch(reason => {
                    return Promise.reject(reason);
                });
            }).then(function onDocParsed(mdocs: any[]) {
                console.log('initially loaded mdocs from assets', mdocs ? mdocs.length : 0);
                const records = importer.mapToItemJsDocuments(mdocs);
                const mdocAdapter = new MediaDocItemsJsAdapter(options, records, itemsJsConfig);

                me.mdocDataStore.setAdapter('http', mdocAdapter, '', {});
                me.mdocDataService.setWritable(false);

                return Promise.resolve(true);
            }).catch(function onError(reason: any) {
                console.error('loading appdata failed:', reason);

                me.pagesDataService.setWritable(false);
                me.pdocDataService.setWritable(false);
                me.mdocDataService.setWritable(false);

                return Promise.reject(false);
            });
    }

    remapPDoc(doc: {}): void {
        if (doc['key']) {
            doc['id'] = doc['key'];
        }
    }

}
