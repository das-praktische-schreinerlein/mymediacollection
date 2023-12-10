import {EventEmitter, Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {GenericAppService} from '@dps/mycms-commons/dist/commons/services/generic-app.service';
import {
    CommonDocActionTagService,
    CommonDocActionTagServiceConfig
} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/services/cdoc-actiontag.service';
import {MediaDocDataService} from '../../../shared/mdoc-commons/services/mdoc-data.service';
import {MediaDocRecord} from '../../../shared/mdoc-commons/model/records/mdoc-record';
import {MediaDocSearchForm} from '../../../shared/mdoc-commons/model/forms/mdoc-searchform';
import {MediaDocSearchResult} from '../../../shared/mdoc-commons/model/container/mdoc-searchresult';
import {MediaDocAlbumService} from './mdoc-album.service';
import {MediaDocPlaylistService} from './mdoc-playlist.service';
import {
    ActionTagEvent,
    MultiRecordActionTagEvent
} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/components/cdoc-actiontags/cdoc-actiontags.component';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ToastrService} from 'ngx-toastr';

@Injectable()
export class MediaDocActionTagService extends CommonDocActionTagService<MediaDocRecord, MediaDocSearchForm, MediaDocSearchResult,
    MediaDocDataService> {
    constructor(router: Router, cdocDataService: MediaDocDataService, cdocPlaylistService: MediaDocPlaylistService,
                cdocAlbumService: MediaDocAlbumService, appService: GenericAppService, protected modalService: NgbModal,
                protected toastr: ToastrService) {
        super(router, cdocDataService, cdocPlaylistService, cdocAlbumService, appService);
        this.configureComponent({});
    }

    protected getComponentConfig(config: {}): CommonDocActionTagServiceConfig {
        return {
            baseEditPath: 'mdocadmin'
        };
    }

    protected processActionTagEventUnknown(actionTagEvent: ActionTagEvent,
                                           actionTagEventEmitter: EventEmitter<ActionTagEvent>): Promise<MediaDocRecord> {
        if (actionTagEvent.config.type === 'noop') {
            return this.processActionTagEventNoop(actionTagEvent, actionTagEventEmitter);
        } else {
            return super.processActionTagEventUnknown(actionTagEvent, actionTagEventEmitter);
        }
    }

    protected processActionMultiRecordTagEventUnknown(actionTagEvent: MultiRecordActionTagEvent,
                                                      actionTagEventEmitter: EventEmitter<MultiRecordActionTagEvent>):
        Promise<MediaDocRecord[]> {
        if (actionTagEvent.config.type === 'noop') {
            return this.processActionMultiRecordTagEventNoop(actionTagEvent, actionTagEventEmitter);
        } else {
            return super.processActionMultiRecordTagEventUnknown(actionTagEvent, actionTagEventEmitter);
        }
    }

    // TODO move to commons
    protected processActionTagEventNoop(actionTagEvent: ActionTagEvent,
                                        actionTagEventEmitter: EventEmitter<ActionTagEvent>): Promise<MediaDocRecord> {
        actionTagEvent.processed = true;
        actionTagEvent.result = actionTagEvent.record;
        actionTagEventEmitter.emit(actionTagEvent);
        return Promise.resolve(<MediaDocRecord>actionTagEvent.record);
    }

    // TODO move to commons
    protected processActionMultiRecordTagEventNoop(actionTagEvent: MultiRecordActionTagEvent,
                                                   actionTagEventEmitter: EventEmitter<MultiRecordActionTagEvent>)
        : Promise<MediaDocRecord[]> {
        actionTagEvent.processed = true;
        actionTagEvent.results = actionTagEvent.records;
        actionTagEventEmitter.emit(actionTagEvent);
        actionTagEventEmitter.error(actionTagEvent.error);
        return Promise.resolve(<MediaDocRecord[]>actionTagEvent.results);
    }
}
