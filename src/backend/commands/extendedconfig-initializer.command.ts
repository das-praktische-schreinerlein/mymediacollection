import {
    SimpleConfigFilePathValidationRule,
    ValidationRule
} from '@dps/mycms-commons/dist/search-commons/model/forms/generic-validator.util';
import {PasswordUtils} from '@dps/mycms-commons/dist/commons/utils/password.utils';
import {ConfigInitializerUtil} from '@dps/mycms-commons/dist/tools/config-initializer.util';
import * as Promise_serial from 'promise-serial';
import {ConfigInitializerCommand} from '@dps/mycms-server-commons/dist/backend-commons/commands/config-initializer.command';

export class ExtendedConfigInitializerCommand extends ConfigInitializerCommand {
    protected solrconfigbasepath: string;
    protected installerdbbasepath: string;

    protected createValidationRules(): {[key: string]: ValidationRule} {
        return {
            ...super.createValidationRules(),
            'solrconfigbasepath': new SimpleConfigFilePathValidationRule(false),
            'installerdbbasepath': new SimpleConfigFilePathValidationRule(false)
        };
    }

    protected definePossibleActions(): string[] {
        return super.definePossibleActions().concat([
            'resetMysqlDevPasswords',
            'setMysqlDevPasswords']);
    }

    protected processCommandArgs(argv: {}): Promise<any> {
        this.configbasepath = argv['configbasepath'] || 'config';
        this.solrconfigbasepath = argv['solrconfigbasepath'] || 'installer/solr';
        this.installerdbbasepath = argv['installerdbbasepath'] || 'installer/db';
        const tokenkey = argv['tokenkey'];
        const newpassword = argv['newpassword'];

        const action = argv['action'];
        switch (action) {
            case 'resetServicePasswords':
                return this.setMysqlDevPasswords(PasswordUtils.createNewDefaultPassword(30));
            case 'resetMysqlDevPasswords':
                return this.setMysqlDevPasswords(PasswordUtils.createNewDefaultPassword(30));
            case 'resetTokenCookie':
                return this.setTokenCookie(tokenkey, PasswordUtils.createNewDefaultPassword(30));
            case 'setMysqlDevPasswords':
                return this.setMysqlDevPasswords(newpassword);
            case 'setTokenCookie':
                return this.setTokenCookie(tokenkey, newpassword);
            default:
                return super.processCommandArgs(argv);
        }
    }

    protected setMysqlDevPasswords(newpassword: string): Promise<any> {
        if (newpassword === undefined || newpassword.length < 8) {
            return Promise.reject('valid newpassword required');
        }

        const me = this;
        const promises = [];
        promises.push(function () {
            return ConfigInitializerUtil.replaceMysqlPasswordInBackendConfig(
                me.configbasepath + '/backend.dev.json',
                'MediaDocSqlMediadbAdapter',
                newpassword, false);
        });
        promises.push(function () {
            return ConfigInitializerUtil.replaceMysqlPasswordInBackendConfig(
                me.configbasepath + '/backend.beta.json',
                'MediaDocSqlMediadbAdapter',
                newpassword, false);
        });
        promises.push(function () {
            return ConfigInitializerUtil.replaceMysqlPasswordInBackendConfig(
                me.configbasepath + '/backend.prod.json',
                'MediaDocSqlMediadbAdapter',
                newpassword, false);
        });
        promises.push(function () {
            return ConfigInitializerUtil.replaceMysqlPasswordInCreateUserSql(
                me.installerdbbasepath + '/mysql/musikdb/step2_create-user.sql',
                '.*?',
                newpassword, false);
        });
        promises.push(function () {
            return ConfigInitializerUtil.replaceMysqlPasswordInDbMigrateConfig(
                me.configbasepath + '/db-migrate-database.json',
                'mediadb_mysql',
                newpassword, false);
        });

        return Promise_serial(promises, {parallelize: 1}).then(() => {
            return Promise.resolve('DONE - setMysqlDevPasswords');
        }).catch(reason => {
            return Promise.reject(reason);
        });
    }
}
