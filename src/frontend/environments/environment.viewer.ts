import {AppEnvironment} from './app-environment';
import {DataMode} from '../shared/commons/model/datamode.enum';

export const environment: AppEnvironment = {
    hideCopyrightFooter: true,
    production: false, // TODO set this to false for development
    assetsPathVersionSnippet: '',
    assetsPathVersionSuffix: '',
    backendApiBaseUrl: undefined,
    audioBaseUrl: './audiostore/',
    picsBaseUrl: './picturestore/',
    videoBaseUrl: './videos/',
    defaultSearchTypes: 'artist',
    emptyDefaultSearchTypes: 'artist',
    useAssetStoreUrls: false,
    useAudioAssetStoreUrls: false,
    useVideoAssetStoreUrls: false,
    skipMediaCheck: true,
    mdocWritable: false,
    mdocActionTagWritable: false,
    pdocWritable: false,
    pdocActionTagWritable: false,
    pdocEmptyDefaultSearchTypes: 'page',
    allowAutoPlay: true,
    mdocMaxItemsPerAlbum: 20000,
    m3uAvailable: true,
    cookieLawSeenName: 'cookieLawSeenV20180525',
    trackingProviders: [], // Angulartics2Piwik
    staticPDocsFile: 'assets/staticdata/static.mymmpdocs.js',
    staticMDocsFiles: ['assets/staticdata/static.mymmmdocs.js'],
    hideInternalDescLinks: true,
    hideInternalImages: true,
    adminBackendApiBaseUrl: undefined,
    adminWritable: false,
    startDataMode: DataMode.STATIC,
    availableDataModes: [DataMode.STATIC]
};

// unset logger
if (environment.production) {
    console.trace = function() {};
    console.debug = function() {};
    console.log = function() {};
    console.warn = function() {};
    console.error = function() {};
}

