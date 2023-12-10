/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {MediaDocDashboardSearchColumnComponent} from './mdoc-dashboard-searchcolumn.component';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {MediaDocDataService} from '../../../../shared/mdoc-commons/services/mdoc-data.service';
import {ActivatedRoute, Router} from '@angular/router';
import {MediaDocDataStore, MediaDocTeamFilterConfig} from '../../../../shared/mdoc-commons/services/mdoc-data.store';
import {AppServiceStub} from '@dps/mycms-frontend-commons/dist/angular-commons/testing/appservice-stubs';
import {MediaDocSearchFormConverter} from '../../services/mdoc-searchform-converter.service';
import {ToastrService} from 'ngx-toastr';
import {CommonDocRoutingService} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/services/cdoc-routing.service';
import {TranslateModule} from '@ngx-translate/core';
import {GenericAppService} from '@dps/mycms-commons/dist/commons/services/generic-app.service';
import {ActivatedRouteStub} from '@dps/mycms-frontend-commons/dist/testing/router-stubs';
import {MediaDocDataServiceStub} from '../../../../testing/mdoc-dataservice-stubs';
import {SearchParameterUtils} from '@dps/mycms-commons/dist/search-commons/services/searchparameter.utils';
import {CommonRoutingService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/common-routing.service';
import {RouterStub} from '@dps/mycms-frontend-commons/dist/angular-commons/testing/router-stubs';
import {PageUtils} from '@dps/mycms-frontend-commons/dist/angular-commons/services/page.utils';
import {SearchFormUtils} from '@dps/mycms-frontend-commons/dist/angular-commons/services/searchform-utils.service';
import {MediaDocRoutingService} from '../../../../shared/mdoc-commons/services/mdoc-routing.service';
import {MediaDocSearchFormUtils} from '../../services/mdoc-searchform-utils.service';
import {MediaDocActionTagService} from '../../services/mdoc-actiontag.service';
import {MediaDocAlbumService} from '../../services/mdoc-album.service';
import {MediaDocPlaylistService} from '../../services/mdoc-playlist.service';
import {ToastrServiceStub} from '@dps/mycms-frontend-commons/dist/testing/toasts-stubs';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {MediaDocContentUtils} from '../../services/mdoc-contentutils.service';
import {CommonDocContentUtils} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/services/cdoc-contentutils.service';

describe('MediaDocDashboardSearchColumnComponent', () => {
    let component: MediaDocDashboardSearchColumnComponent;
    let fixture: ComponentFixture<MediaDocDashboardSearchColumnComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [MediaDocDashboardSearchColumnComponent],
            imports: [
                TranslateModule.forRoot()
            ],
            providers: [
                { provide: MediaDocDataStore, useValue: new MediaDocDataStore(new SearchParameterUtils(), new MediaDocTeamFilterConfig()) },
                { provide: GenericAppService, useValue: new AppServiceStub() },
                { provide: MediaDocDataService, useValue: new MediaDocDataServiceStub() },
                { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
                { provide: Router, useValue: new RouterStub() },
                NgbModal,
                CommonRoutingService,
                SearchFormUtils,
                MediaDocSearchFormConverter,
                { provide: SearchParameterUtils, useValue: new SearchParameterUtils() },
                CommonDocRoutingService,
                MediaDocRoutingService,
                { provide: ToastrService, useValue: new ToastrServiceStub() },
                PageUtils,
                MediaDocSearchFormUtils,
                MediaDocActionTagService,
                MediaDocAlbumService,
                MediaDocPlaylistService,
                MediaDocContentUtils,
                CommonDocContentUtils
            ],
            schemas: [NO_ERRORS_SCHEMA]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(MediaDocDashboardSearchColumnComponent);
        component = fixture.componentInstance;
        component.params = {};
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
