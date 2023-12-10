/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {TranslateModule} from '@ngx-translate/core';
import {MediaDocDataServiceStub} from '../../../../testing/mdoc-dataservice-stubs';
import {Router} from '@angular/router';
import {RouterStub} from '@dps/mycms-frontend-commons/dist/angular-commons/testing/router-stubs';
import {CommonRoutingService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/common-routing.service';
import {CommonDocRoutingService} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/services/cdoc-routing.service';
import {MediaDocContentUtils} from '../../services/mdoc-contentutils.service';
import {GenericAppService} from '@dps/mycms-commons/dist/commons/services/generic-app.service';
import {AppServiceStub} from '@dps/mycms-frontend-commons/dist/angular-commons/testing/appservice-stubs';
import {MediaDocLinkedPlaylistsComponent} from './mdoc-linked-playlists.component';
import {MediaDocActionTagService} from '../../services/mdoc-actiontag.service';
import {ToastrService} from 'ngx-toastr';
import {ToastrServiceStub} from '@dps/mycms-frontend-commons/dist/testing/toasts-stubs';
import {MediaDocDataService} from '../../../../shared/mdoc-commons/services/mdoc-data.service';
import {MediaDocAlbumService} from '../../services/mdoc-album.service';
import {MediaDocPlaylistService} from '../../services/mdoc-playlist.service';
import {CommonDocContentUtils} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/services/cdoc-contentutils.service';

describe('MediaDocLinkedPlaylistsComponent', () => {
    let component: MediaDocLinkedPlaylistsComponent;
    let fixture: ComponentFixture<MediaDocLinkedPlaylistsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [MediaDocLinkedPlaylistsComponent],
            providers: [
                { provide: Router, useValue: new RouterStub() },
                CommonRoutingService,
                CommonDocRoutingService,
                CommonDocContentUtils,
                MediaDocContentUtils,
                MediaDocActionTagService,
                MediaDocAlbumService,
                MediaDocPlaylistService,
                NgbModal,
                { provide: MediaDocDataService, useValue: new MediaDocDataServiceStub() },
                { provide: ToastrService, useValue: new ToastrServiceStub() },
                { provide: GenericAppService, useValue: new AppServiceStub() }
            ],
            schemas: [NO_ERRORS_SCHEMA],
            imports: [
                TranslateModule.forRoot()]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(MediaDocLinkedPlaylistsComponent);
        component = fixture.componentInstance;
        component.record = MediaDocDataServiceStub.defaultRecord();
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
