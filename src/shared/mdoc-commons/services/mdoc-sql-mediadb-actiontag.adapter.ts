import {ActionTagForm} from '@dps/mycms-commons/dist/commons/utils/actiontag.utils';
import {KeywordValidationRule, NumberValidationRule} from '@dps/mycms-commons/dist/search-commons/model/forms/generic-validator.util';
import {utils} from 'js-data';
import {SqlQueryBuilder} from '@dps/mycms-commons/dist/search-commons/services/sql-query.builder';
import {StringUtils} from '@dps/mycms-commons/dist/commons/utils/string.utils';

export class MediaDocSqlMediadbActionTagAdapter {

    private keywordValidationRule = new KeywordValidationRule(true);
    private rateValidationRule = new NumberValidationRule(true, 0, 15, 0);
    private config: any;
    private knex: any;
    private sqlQueryBuilder: SqlQueryBuilder;

    constructor(config: any, knex: any, sqlQueryBuilder: SqlQueryBuilder) {
        this.config = config;
        this.knex = knex;
        this.sqlQueryBuilder = sqlQueryBuilder;
    }

    public executeActionTagPlaylist(table: string, id: number, actionTagForm: ActionTagForm, opts: any): Promise<any> {
        opts = opts || {};

        if (!utils.isInteger(id)) {
            return utils.reject('actiontag ' + actionTagForm.key + ' id not an integer');
        }
        if (actionTagForm.payload === undefined) {
            return utils.reject('actiontag ' + actionTagForm.key + ' playload expected');
        }
        const playlistKey = actionTagForm.payload['playlistkey'];
        if (!this.keywordValidationRule.isValid(playlistKey)) {
            return utils.reject('actiontag ' + actionTagForm.key + ' playlistkey not valid');
        }
        const playlistKeys = StringUtils.uniqueKeywords(playlistKey);

        const ratePersGesamt = actionTagForm.payload['mdocratepers.gesamt'] || 0;
        if (!this.rateValidationRule.isValid(ratePersGesamt)) {
            return utils.reject('actiontag ' + actionTagForm.key + ' ratePersGesamt not valid');
        }

        let baseTableName;
        let joinTableName;
        let idName;
        let rateName;
        switch (table) {
            case 'audio':
                baseTableName = 'titles';
                joinTableName = 'titles_playlist';
                idName = 't_id';
                rateName = 't_rate';
                break;
            default:
                return utils.reject('actiontag ' + actionTagForm.key + ' table not valid');
        }

        const deleteSql = 'DELETE FROM ' + joinTableName + ' ' +
            'WHERE ' + joinTableName + '.p_id IN (SELECT playlist.p_id FROM playlist WHERE p_name IN ("' + playlistKeys.join('", "') + '"))' +
            ' AND ' + idName + ' = "' + id + '"';
        const insertSql = 'INSERT INTO ' + joinTableName + ' (p_id, ' + idName + ')' +
            ' SELECT playlist.p_id AS p_id, "' + id + '" AS ' + idName + ' FROM playlist WHERE p_name IN ("' + playlistKeys.join('", "') + '")';
        let updateSql = 'UPDATE ' + baseTableName + ' SET ' + rateName + '=GREATEST(COALESCE(' + rateName + ', 0), ' + ratePersGesamt + ')' +
            '  WHERE ' + idName + ' = "' + id + '"';
        updateSql = this.sqlQueryBuilder.transformToSqlDialect(updateSql, this.config.knexOpts.client);

        const sqlBuilder = utils.isUndefined(opts.transaction) ? this.knex : opts.transaction;
        const rawDelete = sqlBuilder.raw(deleteSql);
        const result = new Promise((resolve, reject) => {
            rawDelete.then(function doneDelete(dbresults: any) {
                if (actionTagForm.payload.set) {
                    return sqlBuilder.raw(insertSql).then(function doneInsert() {
                        return sqlBuilder.raw(updateSql);
                    }).catch(function errorPlaylist(reason) {
                        console.error('_doActionTag update ' + baseTableName + ' failed:', reason);
                        return reject(reason);
                    });
                }

                return resolve(true);
            }).then(function doneInsert(dbresults: any) {
                return resolve(true);
            }).catch(function errorPlaylist(reason) {
                console.error('_doActionTag delete/insert ' + joinTableName + ' failed:', reason);
                return reject(reason);
            });
        });

        return result;
    }
}
