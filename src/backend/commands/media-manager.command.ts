import * as fs from 'fs';
import * as os from 'os';
import {CommonAdminCommand} from '@dps/mycms-server-commons/dist/backend-commons/commands/common-admin.command';
import {MediaManagerModule} from '@dps/mycms-server-commons/dist/media-commons/modules/media-manager.module';
import {CommonMediaManagerCommand} from '@dps/mycms-server-commons/dist/backend-commons/commands/common-media-manager.command';
import {MediaDocMediaManagerModule} from '../modules/mdoc-media-manager.module';
import {MediaDocDataServiceModule} from '../modules/mdoc-dataservice.module';
import {MediaDocAdapterResponseMapper} from '../shared/mdoc-commons/services/mdoc-adapter-response.mapper';
import {MediaDocRecordValidator} from '../shared/mdoc-commons/model/records/mdoc-record';
import {MediaDocSearchForm} from '../shared/mdoc-commons/model/forms/mdoc-searchform';
import {MediaDocServerPlaylistService} from '../modules/mdoc-serverplaylist.service';
import {MediaDocMusicFileImportManager} from '../modules/mdoc-musicfile-import.service';
import {MediaDocMusicFileExportManager} from '../modules/mdoc-musicfile-export.service';
import {MediaDocExportService} from '../modules/mdoc-export.service';
import {ProcessingOptions} from '@dps/mycms-commons/dist/search-commons/services/cdoc-search.service';
import {MediaExportProcessingOptions} from '@dps/mycms-server-commons/dist/backend-commons/modules/cdoc-mediafile-export.service';
import {MediaDocFileUtils} from '../shared/mdoc-commons/services/mdoc-file.utils';
import {
    KeywordValidationRule,
    NumberValidationRule,
    SimpleConfigFilePathValidationRule,
    SimpleFilePathListValidationRule,
    SimpleFilePathValidationRule,
    ValidationRule,
    WhiteListValidationRule
} from '@dps/mycms-commons/dist/search-commons/model/forms/generic-validator.util';
import {DateUtils} from '@dps/mycms-commons/dist/commons/utils/date.utils';
import {FileUtils} from '@dps/mycms-commons/dist/commons/utils/file.utils';
import {BackendConfigType} from '../modules/backend.commons';
import {ViewerManagerModule} from '@dps/mycms-server-commons/dist/media-commons/modules/viewer-manager.module';
import {PDocFileUtils} from '@dps/mycms-commons/dist/pdoc-commons/services/pdoc-file.utils';
import path from 'path';

export class MediaManagerCommand extends CommonAdminCommand {
    protected createValidationRules(): {[key: string]: ValidationRule} {
        return {
            action: new KeywordValidationRule(true),
            backend: new SimpleConfigFilePathValidationRule(true),
            importDir: new SimpleFilePathValidationRule(false),
            srcFile: new SimpleFilePathValidationRule(false),
            srcFiles: new SimpleFilePathListValidationRule(false),
            pdocFile: new SimpleFilePathValidationRule(false),
            exportDir: new SimpleFilePathValidationRule(false),
            exportName: new SimpleFilePathValidationRule(false),
            ignoreErrors: new NumberValidationRule(false, 1, 999999999, 10),
            inlineProfile: new KeywordValidationRule(false),
            outputDir: new SimpleFilePathValidationRule(false),
            outputFile: new SimpleFilePathValidationRule(false),
            parallel: new NumberValidationRule(false, 1, 999, 10),
            pageNum: new NumberValidationRule(false, 1, 999999999, 1),
            playlists: new KeywordValidationRule(false),
            personalRateOverall: new KeywordValidationRule(false),
            directoryProfile: new KeywordValidationRule(false),
            fileNameProfile: new KeywordValidationRule(false),
            resolutionProfile: new KeywordValidationRule(false),
            rateMinFilter: new NumberValidationRule(false, 0, 15, undefined),
            showNonBlockedOnly: new WhiteListValidationRule(false, [
                'showall',
                'nonblocked_meonly',
                'nonblocked_innerfamily',
                'nonblocked_family',
                'nonblocked_friends',
                'nonblocked_nonpublic',
                'blocked_meonly',
                'blocked_innerfamily',
                'blocked_family',
                'blocked_friends',
                'blocked_nonpublic',
                'nonblocked_public',
                'nonblocked'], undefined),
            additionalMappingsFile: new SimpleConfigFilePathValidationRule(false),
            rotate: new NumberValidationRule(false, 1, 360, 0),
            force: new WhiteListValidationRule(false, [true, false, 'true', 'false'], false),
            genre: new KeywordValidationRule(false),
            artist: new KeywordValidationRule(false),
            album: new KeywordValidationRule(false),
            createViewer: new WhiteListValidationRule(false, [true, false, 'html', 'htmlWithoutImage'], false),
            skipCheckForExistingFilesInDataBase: new KeywordValidationRule(false),
            importMappingFile: new SimpleFilePathValidationRule(false),
            renameFileIfExists: new WhiteListValidationRule(false, [true, false, 'true', 'false'], false)
        };
    }

    protected definePossibleActions(): string[] {
        return ['readMp3MetaData', 'exportAudioFiles',
            'generateHtmlViewerFileForExport', 'inlineDataOnViewerFile',
            'generateMediaDocsFromMediaDir',
            'findCorrespondingTourDocRecordsForMedia', 'insertSimilarMatchings', 'setPDocsInViewerFile'
        ];
    }

    protected processCommandArgs(argv: {}): Promise<any> {
        const me = this;

        // importDir and outputDir are used in CommonMediaManagerCommand too
        argv['importDir'] = MediaDocFileUtils.normalizeCygwinPath(argv['importDir']);
        argv['srcFile'] = MediaDocFileUtils.normalizeCygwinPath(argv['srcFile']);
        argv['outputDir'] = MediaDocFileUtils.normalizeCygwinPath(argv['outputDir']);
        argv['outputFile'] = MediaDocFileUtils.normalizeCygwinPath(argv['outputFile']);
        argv['pdocFile'] = PDocFileUtils.normalizeCygwinPath(argv['pdocFile']);

        const filePathConfigJson = argv['backend'];
        if (filePathConfigJson === undefined) {
            return Promise.reject('ERROR - parameters required backendConfig: "--backend"');
        }

        const action = argv['action'];
        const importDir = argv['importDir'];
        const outputFile = argv['outputFile'];
        const backendConfig: BackendConfigType = JSON.parse(fs.readFileSync(filePathConfigJson, {encoding: 'utf8'}));
        const force = argv['force'] === true || argv['force'] === 'true';

        // @ts-ignore
        const writable = backendConfig.mdocWritable === true || backendConfig.mdocWritable === 'true';
        const mdocDataService = MediaDocDataServiceModule.getDataService('mdocSolrReadOnly', backendConfig);
        if (writable) {
            mdocDataService.setWritable(true);
        }

        let promise: Promise<any>;
        let searchForm: MediaDocSearchForm;
        const processingOptions: ProcessingOptions = {
            ignoreErrors: Number.parseInt(argv['ignoreErrors'], 10) || 0,
            parallel: Number.parseInt(argv['parallel'], 10)
        };
        const pageNum = Number.parseInt(argv['pageNum'], 10);
        const genre = argv['genre'];
        const artist = argv['artist'];
        const album = argv['album'];
        const playlists = argv['playlists'];
        const personalRateOverall = argv['personalRateOverall'];
        const skipCheckForExistingFilesInDataBase = argv['skipCheckForExistingFilesInDataBase'] === true
            || argv['skipCheckForExistingFilesInDataBase'] === 'true';
        const renameFileIfExists = !!argv['renameFileIfExists'];

        const srcFile = argv['srcFile'];
        const srcFiles: string[] = argv['srcFiles']
            ? argv['srcFiles'].split(',')
            : [];
        const pdocFile = argv['pdocFile'];
        const createHtml = argv['createHtml'];
        const exportDir = argv['exportDir'];
        const exportName = argv['exportName'];
        const inlineProfile = argv['inlineProfile'];

        // TODO skipMediaCheck... as option

        const mediaManagerModule = new MediaManagerModule(backendConfig.imageMagicAppPath, os.tmpdir());
        const playListService = new MediaDocServerPlaylistService({
            audioBaseUrl: backendConfig.playlistExportAudioBaseUrl,
            imageBaseUrl: backendConfig.playlistExportImageBaseUrl,
            videoBaseUrl: backendConfig.playlistExportVideoBaseUrl,
            useAudioAssetStoreUrls: false,
            useImageAssetStoreUrls: false,
            useVideoAssetStoreUrls: false
        });
        const musicFileExportManager = new MediaDocMusicFileExportManager(backendConfig.apiRouteAudiosStaticDir, playListService);
        const musicFileImportManager = new MediaDocMusicFileImportManager(backendConfig.apiRouteAudiosStaticDir, mdocDataService,
            mediaManagerModule, skipCheckForExistingFilesInDataBase);
        const mediaDocExportManager = new MediaDocExportService(backendConfig, mdocDataService, playListService, musicFileExportManager,
            new MediaDocAdapterResponseMapper(backendConfig));
        const mdocManagerModule = new MediaDocMediaManagerModule(backendConfig, mdocDataService, mediaManagerModule, playListService,
            mediaDocExportManager, musicFileImportManager);
        const commonMediadManagerCommand = new CommonMediaManagerCommand(backendConfig);
        const viewerManagerModule = new ViewerManagerModule();

        switch (action) {
            case 'readMp3MetaData':
                processingOptions.parallel = Number.isInteger(processingOptions.parallel) ? processingOptions.parallel : 1;
                searchForm = new MediaDocSearchForm({
                    type: 'audio',
                    genre: genre,
                    artist: artist,
                    album: album,
                    playlists: playlists,
                    personalRateOverall: personalRateOverall,
                    sort: 'dateAsc',
                    pageNum: Number.isInteger(pageNum) ? pageNum : 1
                });
                if (!force) {
                    searchForm.moreFilter = 'noMetaOnly:noMetaOnly'
                }
                console.log('START processing: readMp3MetaData', searchForm, processingOptions);

                promise = mdocManagerModule.syncExistingMediaDataFromFiles(searchForm, processingOptions);
                break;
            case 'exportAudioFiles':
                if (exportDir === undefined) {
                    console.error(action + ' missing parameter - usage: --exportDir EXPORTDIR', argv);
                    promise = Promise.reject(action + ' missing parameter - usage: --exportDir EXPORTDIR [-force true/false]');
                    return promise;
                }

                if (exportName === undefined) {
                    console.error(action + ' missing parameter - usage: --exportName EXPORTNAME', argv);
                    promise = Promise.reject(action + ' missing parameter - usage: --exportName EXPORTNAME');
                    return promise;
                }

                const directoryProfile = argv['directoryProfile'];
                if (directoryProfile === undefined) {
                    console.error(action + ' missing parameter - usage: --directoryProfile directoryProfile', argv);
                    promise = Promise.reject(action + ' missing parameter - usage: --directoryProfile directoryProfile');
                    return promise;
                }

                const fileNameProfile = argv['fileNameProfile'];
                if (fileNameProfile === undefined) {
                    console.error(action + ' missing parameter - usage: --fileNameProfile fileNameProfile', argv);
                    promise = Promise.reject(action + ' missing parameter - usage: --fileNameProfile fileNameProfile');
                    return promise;
                }

                let resolutionProfile = argv['resolutionProfile'];
                if (resolutionProfile === undefined) {
                    resolutionProfile = 'default';
                }

                if (createHtml && !srcFile) {
                    console.error(action + ' missing parameter - usage: --srcFile srcFileForHtmlViewer', argv);
                    promise = Promise.reject(action + ' missing parameter - usage: --srcFile srcFileForHtmlViewer');
                    return promise;
                }

                processingOptions.parallel = Number.isInteger(processingOptions.parallel) ? processingOptions.parallel : 1;
                searchForm = new MediaDocSearchForm({
                    type: 'audio',
                    genre: genre,
                    artist: artist,
                    album: album,
                    playlists: playlists,
                    personalRateOverall: personalRateOverall,
                    sort: 'm3uExport',
                    pageNum: Number.isInteger(pageNum) ? pageNum : 1
                });

                const rateMinFilter = argv['rateMinFilter'];
                if (rateMinFilter !== undefined && Number.isInteger(rateMinFilter)) {
                    const rateFilters = [];
                    for (let i = Number.parseInt(rateMinFilter, 10); i >= 0 && i <= 15; i++) {
                        rateFilters.push(i + '');
                    }
                    if (rateFilters.length > 0) {
                        searchForm.personalRateOverall = rateFilters.join(',');
                    }
                }

                const blockedFilters = argv['showNonBlockedOnly'] + '';
                if (blockedFilters !== undefined && blockedFilters.toLowerCase() !== 'showall') {
                    let blockedValues: string[] = undefined;
                    for (const blockedFilter of blockedFilters.split(',')) {
                        switch (blockedFilter) {
                            case 'nonblocked_meonly':
                                blockedValues = ['null', '0',
                                    '1', '2', '3', '4', '5',
                                    '6', '7', '8', '9', '10',
                                    '11', '12', '13', '14', '15',
                                    '16', '17', '18', '19', '20',
                                    '21', '22', '23', '24', '25'];
                                break;
                            case 'nonblocked_innerfamily':
                                blockedValues = ['null', '0',
                                    '1', '2', '3', '4', '5',
                                    '6', '7', '8', '9', '10',
                                    '11', '12', '13', '14', '15',
                                    '16', '17', '18', '19', '20'];
                                break;
                            case 'nonblocked_family':
                                blockedValues = ['null', '0',
                                    '1', '2', '3', '4', '5',
                                    '6', '7', '8', '9', '10',
                                    '11', '12', '13', '14', '15'];
                                break;
                            case 'nonblocked_friends':
                                blockedValues = ['null', '0',
                                    '1', '2', '3', '4', '5',
                                    '6', '7', '8', '9', '10'];
                                break;
                            case 'nonblocked_nonpublic':
                                blockedValues = ['null', '0',
                                    '1', '2', '3', '4', '5'];
                                break;
                            case 'blocked_meonly':
                                blockedValues.push('21', '22', '23', '24', '25');
                                break;
                            case 'blocked_innerfamily':
                                blockedValues.push('16', '17', '18', '19', '20');
                                break;
                            case 'blocked_family':
                                blockedValues.push('11', '12', '13', '14', '15');
                                break;
                            case 'blocked_friends':
                                blockedValues.push('6', '7', '8', '9', '10');
                                break;
                            case 'blocked_nonpublic':
                                blockedValues.push('1', '2', '3', '4', '5');
                                break;
                            case 'nonblocked_public':
                            case 'nonblocked':
                                blockedValues = ['null', '0'];
                                break
                            default:
                                console.error(action + ' invalid parameter - usage: --showNonBlockedOnly FILTER', argv);
                                promise = Promise.reject(action + ' missing parameter - usage: --showNonBlockedOnly srcFileForHtmlViewer');
                                return promise;
                        }
                    }

                    if (blockedValues && blockedValues.length > 0) {
                        searchForm.moreFilter = searchForm.moreFilter
                            ? searchForm.moreFilter + '_,_'
                            : '';
                        searchForm.moreFilter = searchForm.moreFilter + 'blocked_i:' + blockedValues.join(',');
                    }
                }
                console.log('START processing: exportAudioFiles', searchForm, exportDir, processingOptions);

                promise = mdocManagerModule.exportMediaFiles(searchForm, <MediaExportProcessingOptions & ProcessingOptions>{
                    ...processingOptions,
                    exportBasePath: exportDir,
                    exportBaseFileName: exportName,
                    directoryProfile: directoryProfile,
                    fileNameProfile: fileNameProfile,
                    resolutionProfile: resolutionProfile,
                    jsonBaseElement: 'mdocs'
                }).then((result) => {
                    if (!createHtml || !srcFile) {
                        return Promise.resolve(result);
                    }

                    const exportJsonFile = exportDir + '/' + exportName + '.mdocsexport.json';
                    return viewerManagerModule.generateViewerHtmlFile(srcFile, [exportJsonFile],
                        exportDir + '/' + exportName + '.html', 100, 'mdocs',
                        function (html: string) {
                            return viewerManagerModule.htmlConfigConverter(html, 'staticMDocsFiles');
                        },
                        function (html: string, jsonPFileName: string) {
                            return viewerManagerModule.jsonToJsTargetContentConverter(html, jsonPFileName,
                                'importStaticDataMDocsJsonP');
                        },
                        function (html: string, dataFileConfigName: string) {
                            return viewerManagerModule.htmlInlineFileConverter(html, dataFileConfigName,
                                'staticMDocsFiles');
                        }
                    );
                });

                break;
            case 'setPDocsInViewerFile':
                if (srcFile === undefined) {
                    console.error(action + ' missing parameter - usage: --srcFile SRCFILE', argv);
                    promise = Promise.reject(action + ' missing parameter - usage: --srcFile SRCFILE');
                    return promise;
                }

                if (pdocFile === undefined) {
                    console.error(action + ' missing parameter - usage: --pdocFile PDOCFILE', argv);
                    promise = Promise.reject(action + ' missing parameter - usage: --pdocFile PDOCFILE');
                    return promise;
                }

                promise = viewerManagerModule.generateViewerHtmlFile(srcFile, [pdocFile],
                    srcFile, 999999999, 'pdocs',
                    function (html: string) {
                        return html;
                    },
                    function (html: string, jsonPFileName: string) {
                        return viewerManagerModule.jsonToJsTargetContentConverter(html, jsonPFileName,
                            'importStaticDataPDocsJsonP');
                    },
                    function (html: string, jsonPFilePath: string) {
                        return me.htmlPDocInlineFileConverter(html, jsonPFilePath,
                            'staticPDocsFile');
                    }
                );
                break;
            case 'generateHtmlViewerFileForExport':
                if (createHtml && !srcFile) {
                    console.error(action + ' missing parameter - usage: --srcFile srcFileForHtmlViewer', argv);
                    promise = Promise.reject(action + ' missing parameter - usage: --srcFile srcFileForHtmlViewer');
                    return promise;
                }

                if (exportDir === undefined) {
                    console.error(action + ' missing parameter - usage: --exportDir EXPORTDIR', argv);
                    promise = Promise.reject(action + ' missing parameter - usage: --exportDir EXPORTDIR [-force true/false]');
                    return promise;
                }

                if (exportName === undefined) {
                    console.error(action + ' missing parameter - usage: --exportName EXPORTNAME', argv);
                    promise = Promise.reject(action + ' missing parameter - usage: --exportName EXPORTNAME');
                    return promise;
                }

                if (srcFiles.length < 1) {
                    console.error(action + ' missing parameter - usage: --srcFiles JSONFILE,JSONFILE2...', argv);
                    promise = Promise.reject(action + ' missing parameter - usage: --srcFiles JSONFILE,JSONFILE2...');
                    return promise;
                }

                promise = FileUtils.mergeJsonFiles(srcFiles, exportDir + '/' + exportName + '-merged.mdocsexport.json', 'id', 'mdocs')
                    .then((resultFile) => {
                        return viewerManagerModule.generateViewerHtmlFile(srcFile, [resultFile],
                            exportDir + '/' + exportName + '.html', 100, 'mdocs',
                            function (html: string) {
                                return viewerManagerModule.htmlConfigConverter(html, 'staticMDocsFiles');
                            },
                            function (html: string, jsonPFileName: string) {
                                return viewerManagerModule.jsonToJsTargetContentConverter(html, jsonPFileName,
                                    'importStaticDataMDocsJsonP');
                            },
                            function (html: string, jsonPFilePath: string) {
                                return viewerManagerModule.htmlInlineFileConverter(html, jsonPFilePath,
                                    'staticMDocsFiles');
                            }
                        );
                });

                break;
            case 'inlineDataOnViewerFile':
                if (!backendConfig.nodejsBinaryPath || !backendConfig.inlineJsPath) {
                    console.error(action + ' missing config - nodejsBinaryPath, inlineJsPath');
                    promise = Promise.reject(action + ' missing config - nodejsBinaryPath, inlineJsPath');
                    return promise;
                }

                if (srcFile === undefined) {
                    console.error(action + ' missing parameter - usage: --srcFile SRCFILE', argv);
                    promise = Promise.reject(action + ' missing parameter - usage: --srcFile SRCFILE');
                    return promise;
                }

                const targetFileName = outputFile !== undefined
                    ? outputFile
                    : srcFile

                // TODO password for encryption

                promise = viewerManagerModule.inlineDataOnViewerFile(
                    backendConfig.nodejsBinaryPath,
                    backendConfig.inlineJsPath,
                    srcFile,
                    targetFileName,
                    inlineProfile);

                break;
            case 'generateMediaDocsFromMediaDir':
                if (importDir === undefined) {
                    console.error(action + ' missing parameter - usage: --importDir INPUTDIR', argv);
                    promise = Promise.reject(action + ' missing parameter - usage: --importDir INPUTDIR --outputFile outputFile [-force true/false --mappingFile mapper]');
                    return promise;
                }
                if (outputFile === undefined) {
                    console.error(action + ' missing parameter - usage: --outputFile OUTPUTFILE', argv);
                    promise = Promise.reject(action + ' missing parameter - usage: --importDir INPUTDIR --outputFile outputFile [-force true/false]');
                    return promise;
                }

                const mappingFile = argv['importMappingFile'];
                let mappings = {}
                if (mappingFile !== undefined) {
                    mappings = JSON.parse(fs.readFileSync(mappingFile, {encoding: 'utf8'}));
                }

                let fileCheckPromise: Promise<any>;
                if (fs.existsSync(outputFile)) {
                    if (!renameFileIfExists) {
                        console.error(action + ' outputFile must not exist', argv);
                        promise = Promise.reject('outputFile must not exist');
                        return promise;
                    }

                    const newFile = outputFile + '.' + DateUtils.formatToFileNameDate(new Date(), '', '-', '') + '-export.MOVED';
                    fileCheckPromise = FileUtils.moveFile(outputFile, newFile, false, true, false);
                } else {
                    fileCheckPromise = Promise.resolve();
                }

                promise = fileCheckPromise.then(() => {
                    console.log('START processing: generateTourDocRecordsFromMediaDir', importDir);
                    return mdocManagerModule.generateMediaDocRecordsFromMediaDir(importDir, mappings);
                }).then(value => {
                    const responseMapper = new MediaDocAdapterResponseMapper(backendConfig);
                    const mdocs = [];
                    for (const mdoc of value) {
                        if (!mdoc.isValid()) {
                            console.error('mdoc invalid', mdoc, MediaDocRecordValidator.instance.validate(mdoc, ''),
                                responseMapper.mapToAdapterDocument({}, mdoc));
                        } else {
                            mdocs.push(responseMapper.mapToAdapterDocument({}, mdoc));
                        }
                    }
                    fs.writeFileSync(outputFile, JSON.stringify({mdocs: mdocs}, undefined, ' '));
                });

                break;
            default:
                if (outputFile !== undefined && fs.existsSync(outputFile)) {
                    return Promise.reject(action + ' outputFile must not exist');
                }

                promise = commonMediadManagerCommand.process(argv);
                return promise;
        }

        return promise;
    }

    public htmlPDocInlineFileConverter(html: string, jsonPFilePath: string, dataFileConfigName: string): string {
        const fileName = path.basename(jsonPFilePath);
        html = html.replace(/<\/head>/g,
            '\n  <script inlineexport type="text/javascript" src="' + fileName + '"></script>\n</head>');
        const regExp = new RegExp(dataFileConfigName + '": ".*?"', 'g');
        html = html.replace(regExp,
            dataFileConfigName + '": "' + fileName + '"');

        return html;
    }
}
