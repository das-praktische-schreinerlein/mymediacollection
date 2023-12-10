import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {AppState, GenericAppService} from '@dps/mycms-commons/dist/commons/services/generic-app.service';
import {MediaDocDataService} from '../../../shared/mdoc-commons/services/mdoc-data.service';
import {MediaDocRecord} from '../../../shared/mdoc-commons/model/records/mdoc-record';
import {IdValidationRule} from '@dps/mycms-commons/dist/search-commons/model/forms/generic-validator.util';
import {ResolvedData, ResolverError} from '@dps/mycms-frontend-commons/dist/angular-commons/resolver/resolver.utils';
import {LogUtils} from '@dps/mycms-commons/dist/commons/utils/log.utils';

@Injectable()
export class SectionsMediaDocRecordResolver implements Resolve<ResolvedData<MediaDocRecord>> {
    static ERROR_UNKNOWN_SDOC_ID = 'ERROR_UNKNOWN_SDOC_ID';
    static ERROR_INVALID_SDOC_ID = 'ERROR_INVALID_SDOC_ID';
    static ERROR_READING_SDOC_ID = 'ERROR_READING_SDOC_ID';
    idValidationRule = new IdValidationRule(true);

    constructor(private appService: GenericAppService, private dataService: MediaDocDataService) {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<ResolvedData<MediaDocRecord>> {
        const result: ResolvedData<MediaDocRecord> = {
            route: route,
            state: state
        };

        return new Promise<ResolvedData<MediaDocRecord>>((resolve) => {
            this.appService.getAppState().subscribe(appState => {
                if (appState === AppState.Ready) {
                    let id = route.params['id'];
                    if (!this.idValidationRule.isValid(id)) {
                        // console.log('error no id for mdoc:', LogUtils.sanitizeLogMsg(id));
                        result.error = new ResolverError(SectionsMediaDocRecordResolver.ERROR_INVALID_SDOC_ID, id, undefined);
                        return resolve(result);
                    }

                    id = this.idValidationRule.sanitize(id);
                    this.dataService.getById(id).then(
                        function doneGetById(mdoc: MediaDocRecord) {
                            if (mdoc === undefined) {
                                console.warn('warning no mdoc for id:' + LogUtils.sanitizeLogMsg(id));
                                result.error = new ResolverError(SectionsMediaDocRecordResolver.ERROR_UNKNOWN_SDOC_ID, id, undefined);
                                return resolve(result);
                            }

                            result.data = mdoc;
                            return resolve(result);
                        }).catch(function errorGetById(reason: any) {
                            console.error('error mdoc for id:' + LogUtils.sanitizeLogMsg(id), reason);
                            result.error = new ResolverError(SectionsMediaDocRecordResolver.ERROR_READING_SDOC_ID, id, reason);
                            return resolve(result);
                        }
                    );
                } else if (appState === AppState.Failed) {
                    result.error = new ResolverError(GenericAppService.ERROR_APP_NOT_INITIALIZED, undefined, undefined);
                    return resolve(result);
                }
            });
        });
    }
}
