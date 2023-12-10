import {ChangeDetectionStrategy, ChangeDetectorRef, Component} from '@angular/core';
import {MediaDocRecord} from '../../../../shared/mdoc-commons/model/records/mdoc-record';
import {DomSanitizer} from '@angular/platform-browser';
import {CommonRoutingService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/common-routing.service';
import {CommonDocRoutingService} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/services/cdoc-routing.service';
import {MediaDocLinkedPlaylistRecord} from '../../../../shared/mdoc-commons/model/records/mdoclinkedplaylist-record';
import {GenericAppService} from '@dps/mycms-commons/dist/commons/services/generic-app.service';
import {MediaDocActionTagService} from '../../services/mdoc-actiontag.service';
import {ToastrService} from 'ngx-toastr';
import {MediaDocSearchForm} from '../../../../shared/mdoc-commons/model/forms/mdoc-searchform';
import {MediaDocSearchResult} from '../../../../shared/mdoc-commons/model/container/mdoc-searchresult';
import {MediaDocDataService} from '../../../../shared/mdoc-commons/services/mdoc-data.service';
import {CommonDocLinkedPlaylistsComponent} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/components/cdoc-linked-playlists/cdoc-linked-playlists.component';

@Component({
    selector: 'app-mdoc-linked-playlists',
    templateUrl: './../../../../../../node_modules/@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/components/cdoc-linked-playlists/cdoc-linked-playlists.component.html',
    styleUrls: ['./../../../../../../node_modules/@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/components/cdoc-linked-playlists/cdoc-linked-playlists.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MediaDocLinkedPlaylistsComponent extends CommonDocLinkedPlaylistsComponent<MediaDocRecord, MediaDocSearchForm,
    MediaDocSearchResult, MediaDocDataService, MediaDocActionTagService, MediaDocLinkedPlaylistRecord> {

    constructor(sanitizer: DomSanitizer, commonRoutingService: CommonRoutingService,
                cdocRoutingService: CommonDocRoutingService, appService: GenericAppService,
                actionTagService: MediaDocActionTagService, toastr: ToastrService,
                cdocDataService: MediaDocDataService, cd: ChangeDetectorRef) {
        super(sanitizer, commonRoutingService, cdocRoutingService, appService, actionTagService, toastr, cdocDataService, cd);
    }

    protected updateData(): void {
        if (this.record === undefined || this.record['mdoclinkedplaylists'] === undefined
            || this.record['mdoclinkedplaylists'].length <= 0) {
            this.linkedPlaylists = [];
            this.maxPlaylistValues = {};
            return;
        }

        this.maxPlaylistValues = {};
        this.linkedPlaylists = this.record['mdoclinkedplaylists'];
    }

}
