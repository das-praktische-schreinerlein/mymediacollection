import {DataMode} from '../shared/commons/model/datamode.enum';
import {CommonEnvironment} from '@dps/mycms-frontend-commons/dist/frontend-section-commons/common-environment';

export interface AppEnvironment extends CommonEnvironment {
    pdocWritable?: boolean;
    pdocActionTagWritable?: boolean;
    pdocEmptyDefaultSearchTypes?: string,
    hideCopyrightFooter?: boolean,
    hideInternalDescLinks?: boolean;
    hideInternalImages?: boolean,
    assetsPathVersionSnippet: string;
    assetsPathVersionSuffix: string;
    audioBaseUrl: string;
    picsBaseUrl: string;
    videoBaseUrl: string;
    useVideoAssetStoreUrls: boolean;
    useAudioAssetStoreUrls: boolean;
    skipMediaCheck?: boolean,
    mdocWritable: boolean;
    mdocActionTagWritable: boolean;
    mdocMaxItemsPerAlbum: number;
    m3uAvailable: boolean;
    currentDataMode?: DataMode;
    startDataMode?: DataMode;
    availableDataModes?: DataMode[];
    staticPDocsFile?: string;
    staticMDocsFiles?: string[];
}
