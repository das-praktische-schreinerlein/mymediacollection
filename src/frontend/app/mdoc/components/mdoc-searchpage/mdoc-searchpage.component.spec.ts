/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {MediaDocSearchpageComponent} from './mdoc-searchpage.component';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {MediaDocDataService} from '../../../../shared/mdoc-commons/services/mdoc-data.service';
import {ActivatedRoute, Router} from '@angular/router';
import {MediaDocSearchFormConverter} from '../../../shared-mdoc/services/mdoc-searchform-converter.service';
import {ToastrService} from 'ngx-toastr';
import {ToastrServiceStub} from '@dps/mycms-frontend-commons/dist/testing/toasts-stubs';
import {CommonDocRoutingService} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/services/cdoc-routing.service';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {ActivatedRouteStub} from '@dps/mycms-frontend-commons/dist/testing/router-stubs';
import {MediaDocDataServiceStub} from '../../../../testing/mdoc-dataservice-stubs';
import {SearchParameterUtils} from '@dps/mycms-commons/dist/search-commons/services/searchparameter.utils';
import {ErrorResolver} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/resolver/error.resolver';
import {PageUtils} from '@dps/mycms-frontend-commons/dist/angular-commons/services/page.utils';
import {CommonRoutingService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/common-routing.service';
import {RouterStub} from '@dps/mycms-frontend-commons/dist/angular-commons/testing/router-stubs';
import {Angulartics2} from 'angulartics2';
import {GenericTrackingService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/generic-tracking.service';
import {Angulartics2Stub} from '@dps/mycms-frontend-commons/dist/angular-commons/testing/angulartics2-stubs';
import {PlatformService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/platform.service';
import {LayoutService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/layout.service';
import {SearchFormUtils} from '@dps/mycms-frontend-commons/dist/angular-commons/services/searchform-utils.service';
import {MediaDocRoutingService} from '../../../../shared/mdoc-commons/services/mdoc-routing.service';
import {GenericAppService} from '@dps/mycms-commons/dist/commons/services/generic-app.service';
import {AppServiceStub} from '@dps/mycms-frontend-commons/dist/angular-commons/testing/appservice-stubs';
import {MediaDocActionTagService} from '../../../shared-mdoc/services/mdoc-actiontag.service';
import {MediaDocAlbumService} from '../../../shared-mdoc/services/mdoc-album.service';
import {MediaDocSearchFormUtils} from '../../../shared-mdoc/services/mdoc-searchform-utils.service';
import {MediaDocPlaylistService} from '../../../shared-mdoc/services/mdoc-playlist.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {CommonDocContentUtils} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/services/cdoc-contentutils.service';
import {Location} from '@angular/common';

describe('MediaDocSearchpageComponent', () => {
    let component: MediaDocSearchpageComponent;
    let fixture: ComponentFixture<MediaDocSearchpageComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [MediaDocSearchpageComponent],
            imports: [
                TranslateModule.forRoot()
            ],
            providers: [
                { provide: MediaDocDataService, useValue: new MediaDocDataServiceStub() },
                { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
                { provide: Router, useValue: new RouterStub() },
                NgbModal,
                { provide: Location, useValue: {} },
                CommonRoutingService,
                MediaDocSearchFormConverter,
                SearchFormUtils,
                { provide: SearchParameterUtils, useValue: new SearchParameterUtils() },
                CommonDocRoutingService,
                MediaDocRoutingService,
                { provide: ToastrService, useValue: new ToastrServiceStub() },
                TranslateService,
                ErrorResolver,
                PageUtils,
                { provide: GenericAppService, useValue: new AppServiceStub() },
                PlatformService,
                GenericTrackingService,
                { provide: Angulartics2, useValue: new Angulartics2Stub() },
                LayoutService,
                MediaDocActionTagService,
                MediaDocAlbumService,
                MediaDocSearchFormUtils,
                MediaDocPlaylistService,
                CommonDocContentUtils
            ],
            schemas: [NO_ERRORS_SCHEMA]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(MediaDocSearchpageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
