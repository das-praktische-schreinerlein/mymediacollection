import {SiteMapGeneratorCommand} from './sitemap-generator.command';
import {
    CommonAdminCommandConfigType,
    CommonAdminCommandManager
} from '@dps/mycms-server-commons/dist/backend-commons/commands/common-admin-command.manager';
import {DbMigrateCommand} from '@dps/mycms-server-commons/dist/backend-commons/commands/dbmigrate.command';
import {PageManagerCommand} from '@dps/mycms-server-commons/dist/pdoc-backend-commons/commands/pdoc-manager.command';
import {PDocLoaderCommand} from '@dps/mycms-server-commons/dist/pdoc-backend-commons/commands/pdoc-loader.command';
import {PDocConverterCommand} from '@dps/mycms-server-commons/dist/pdoc-backend-commons/commands/pdoc-converter.command';
import {ExtendedConfigInitializerCommand} from './extendedconfig-initializer.command';
import {MediaDocLoaderCommand} from './mdoc-loader.command';
import {MediaDocExporterCommand} from './mdoc-exporter.command';
import {MediaManagerCommand} from './media-manager.command';
import {PDocPdfManagerCommand} from '@dps/mycms-server-commons/dist/pdoc-backend-commons/commands/pdoc-pdf-manager.command';

// tslint:disable-next-line:no-empty-interface
export interface AdminCommandConfigType extends CommonAdminCommandConfigType {
}

export class AdminCommandManager extends CommonAdminCommandManager<AdminCommandConfigType> {
    constructor(adminCommandConfig: AdminCommandConfigType) {
        super({
            'convertPDoc': new PDocConverterCommand(),
            'dbMigrate': new DbMigrateCommand(),
            'exportMediaDoc': new MediaDocExporterCommand(),
            'generateSitemap': new SiteMapGeneratorCommand(),
            'initConfig': new ExtendedConfigInitializerCommand(),
            'loadMediaDoc': new MediaDocLoaderCommand(),
            'loadPDoc': new PDocLoaderCommand(),
            'mediaManager': new MediaManagerCommand(),
            'pdocPdfManager': new PDocPdfManagerCommand(),
            'pageManager': new PageManagerCommand()
        }, adminCommandConfig);
    }

}

