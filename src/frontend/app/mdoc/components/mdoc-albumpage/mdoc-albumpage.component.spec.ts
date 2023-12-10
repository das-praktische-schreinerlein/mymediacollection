/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
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
import {MediaDocAlbumpageComponent} from './mdoc-albumpage.component';
import {MediaDocAlbumService} from '../../../shared-mdoc/services/mdoc-album.service';
import {FormBuilder} from '@angular/forms';
import {AppServiceStub} from '@dps/mycms-frontend-commons/dist/angular-commons/testing/appservice-stubs';
import {GenericAppService} from '@dps/mycms-commons/dist/commons/services/generic-app.service';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {SearchFormUtils} from '@dps/mycms-frontend-commons/dist/angular-commons/services/searchform-utils.service';
import {MediaDocRoutingService} from '../../../../shared/mdoc-commons/services/mdoc-routing.service';
import {PlatformService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/platform.service';
import {LayoutService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/layout.service';
import {MediaDocPlaylistService} from '../../../shared-mdoc/services/mdoc-playlist.service';
import {CommonDocContentUtils} from '@dps//mycms-frontend-commons/dist/frontend-cdoc-commons/services/cdoc-contentutils.service';
import {MediaDocActionTagService} from '../../../shared-mdoc/services/mdoc-actiontag.service';
import {MediaDocSearchFormUtils} from '../../../shared-mdoc/services/mdoc-searchform-utils.service';

describe('MediaDocAlbumpageComponent', () => {
    let component: MediaDocAlbumpageComponent;
    let fixture: ComponentFixture<MediaDocAlbumpageComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [MediaDocAlbumpageComponent],
            imports: [
                TranslateModule.forRoot(),
                NoopAnimationsModule
            ],
            providers: [
                { provide: MediaDocDataService, useValue: new MediaDocDataServiceStub() },
                { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
                { provide: Router, useValue: new RouterStub() },
                CommonRoutingService,
                MediaDocSearchFormConverter,
                SearchFormUtils,
                { provide: GenericAppService, useValue: new AppServiceStub() },
                { provide: SearchParameterUtils, useValue: new SearchParameterUtils() },
                CommonDocRoutingService,
                MediaDocRoutingService,
                { provide: ToastrService, useValue: new ToastrServiceStub() },
                TranslateService,
                ErrorResolver,
                PageUtils,
                GenericTrackingService,
                MediaDocAlbumService,
                FormBuilder,
                { provide: Angulartics2, useValue: new Angulartics2Stub() },
                PlatformService,
                LayoutService,
                MediaDocPlaylistService,
                CommonDocContentUtils,
                MediaDocActionTagService,
                MediaDocSearchFormUtils
            ],
            schemas: [NO_ERRORS_SCHEMA]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(MediaDocAlbumpageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
