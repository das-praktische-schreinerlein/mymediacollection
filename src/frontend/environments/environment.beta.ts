import {AppEnvironment} from './app-environment';
import {DataMode} from '../shared/commons/model/datamode.enum';
import {PrintDialogPdfGenerator} from '@dps/mycms-frontend-commons/dist/angular-commons/services/print-dialog-pdf.generator';

export const environment: AppEnvironment = {
    production: true,
    assetsPathVersionSnippet: '',
    assetsPathVersionSuffix: '',
    pdocWritable: false,
    pdocActionTagWritable: false,
    pdocEmptyDefaultSearchTypes: 'page',
    backendApiBaseUrl: 'http://localhost:4101/api/v1/',
    audioBaseUrl: 'http://localhost:4101/api/static/audiostore/',
    picsBaseUrl: 'http://localhost:4101/api/static/picturestore/',
    videoBaseUrl: 'http://localhost:4101/api/static/videostore/',
    defaultSearchTypes: 'artist',
    emptyDefaultSearchTypes: 'artist',
    useAssetStoreUrls: true,
    useAudioAssetStoreUrls: true,
    useVideoAssetStoreUrls: false,
    mdocWritable: false,
    mdocActionTagWritable: false,
    allowAutoPlay: false,
    mdocMaxItemsPerAlbum: -1,
    m3uAvailable: false,
    cookieLawSeenName: 'cookieLawSeenV20180525',
    trackingProviders: [], // Angulartics2Piwik
    hideInternalDescLinks: false,
    hideInternalImages: false,
    startDataMode: DataMode.BACKEND,
    availableDataModes: [DataMode.BACKEND]
};

// TODO if you want pdf replace PrintDialogPdfGenerator by JsPdfGenerator and move jspdf in package.json from optional to dep
export class EnvironmentPdfGenerator extends PrintDialogPdfGenerator {}
