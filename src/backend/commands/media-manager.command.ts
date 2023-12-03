import * as fs from 'fs';
import {
    CommonAdminCommand,
    SimpleConfigFilePathValidationRule,
    SimpleFilePathValidationRule
} from '@dps/mycms-server-commons/dist/backend-commons/commands/common-admin.command';
import {
    KeywordValidationRule,
    NumberValidationRule,
    ValidationRule,
    WhiteListValidationRule
} from '@dps/mycms-commons/dist/search-commons/model/forms/generic-validator.util';
import {BackendConfigType} from '../modules/backend.commons';
import {ViewerManagerModule} from '@dps/mycms-server-commons/dist/media-commons/modules/viewer-manager.module';

export class MediaManagerCommand extends CommonAdminCommand {
    protected createValidationRules(): {[key: string]: ValidationRule} {
        return {
            action: new KeywordValidationRule(true),
            backend: new SimpleConfigFilePathValidationRule(true),
            srcFile: new SimpleFilePathValidationRule(false),
            exportDir: new SimpleFilePathValidationRule(false),
            exportName: new SimpleFilePathValidationRule(false),
            ignoreErrors: new NumberValidationRule(false, 1, 999999999, 10),
            parallel: new NumberValidationRule(false, 1, 999, 10),
            force: new KeywordValidationRule(false),
            skipCheckForExistingFilesInDataBase : new KeywordValidationRule(false),
            renameFileIfExists:  new WhiteListValidationRule(false, [true, false, 'true', 'false'], false)
        };
    }

    protected definePossibleActions(): string[] {
        return [
            'generateHtmlViewerFileForExport', 'inlineDataOnViewerFile'
            ];
    }

    protected processCommandArgs(argv: {}): Promise<any> {
        // importDir and outputDir are used in CommonMediaManagerCommand too
        argv['srcFile'] = this.normalizeCygwinPath(argv['srcFile']);

        const filePathConfigJson = argv['backend'];
        if (filePathConfigJson === undefined) {
            return Promise.reject('ERROR - parameters required backendConfig: "--backend"');
        }

        const action = argv['action'];
        const backendConfig: BackendConfigType = JSON.parse(fs.readFileSync(filePathConfigJson, {encoding: 'utf8'}));

        let promise: Promise<any>;

        const srcFile = argv['srcFile'];
        const exportDir = argv['exportDir'];
        const exportName = argv['exportName'];

        const viewerManagerModule = new ViewerManagerModule();

        switch (action) {
            case 'generateHtmlViewerFileForExport':
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

                promise = viewerManagerModule.generateViewerHtmlFile(srcFile, [],
                    exportDir + '/' + exportName + '.html', 100, 'pdocs',
                    function (html: string) {
                        return html;
                    },
                    function (html: string, jsonPFileName: string) {
                        return html;
                    },
                    function (html: string, dataFileConfigName: string) {
                        return html;
                    }
                );

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

                promise = viewerManagerModule.inlineDataOnViewerFile(
                    backendConfig.nodejsBinaryPath,
                    backendConfig.inlineJsPath,
                    srcFile,
                    srcFile);

                break;
        }

        return promise;
    }

    public normalizeCygwinPath(path: string): string {
        if (!path) {
            return path;
        }

        path = path.replace(/^\/cygdrive\/([a-z])\//g, '$1:/');

        return path;
    }

}
