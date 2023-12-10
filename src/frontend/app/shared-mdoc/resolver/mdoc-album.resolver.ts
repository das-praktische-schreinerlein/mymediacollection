import {Injectable} from '@angular/core';
import {GenericAppService} from '@dps/mycms-commons/dist/commons/services/generic-app.service';
import {MediaDocSearchForm} from '../../../shared/mdoc-commons/model/forms/mdoc-searchform';
import {MediaDocRecord} from '../../../shared/mdoc-commons/model/records/mdoc-record';
import {MediaDocSearchResult} from '../../../shared/mdoc-commons/model/container/mdoc-searchresult';
import {MediaDocDataService} from '../../../shared/mdoc-commons/services/mdoc-data.service';
import {CommonDocAlbumResolver} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/resolver/cdoc-album.resolver';
import {MediaDocAlbumService} from '../services/mdoc-album.service';

@Injectable()
export class MediaDocAlbumResolver extends CommonDocAlbumResolver<MediaDocRecord, MediaDocSearchForm, MediaDocSearchResult,
    MediaDocDataService> {
    constructor(appService: GenericAppService, albumService: MediaDocAlbumService, dataService: MediaDocDataService) {
        super(appService, albumService, dataService);
    }
}
